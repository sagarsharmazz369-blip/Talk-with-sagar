import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ExternalLink,
  Mic,
  MicOff,
  PhoneOff,
  Plus,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import { CardRef } from '../data/knowledgeBase';
import { AssistantOrb, OrbMood, OrbState } from './AssistantOrb';
import { CardRenderer } from './RichCards';
import {
  MicErrorInfo,
  parseMicError,
  requestUserMicrophone,
} from '../utils/micPermissions';

export interface LiveCaption {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface LiveConversationModalProps {
  isOpen: boolean;
  onClose: (captions: LiveCaption[], cards: CardRef[]) => void;
  onCardTriggered?: (card: CardRef) => void;
  onMoodChange?: (mood: OrbMood) => void;
  initialStream?: MediaStream | null;
  initialError?: MicErrorInfo | null;
}

export const LiveConversationModal: React.FC<LiveConversationModalProps> = ({
  isOpen,
  onClose,
  onCardTriggered,
  onMoodChange,
  initialStream,
  initialError,
}) => {
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number>(180); // 3 minutes = 180s
  const [orbState, setOrbState] = useState<OrbState>('thinking');
  const [orbMood, setOrbMood] = useState<OrbMood>('calm');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Connecting to Live AI...');
  const [captions, setCaptions] = useState<LiveCaption[]>([]);
  const [liveCards, setLiveCards] = useState<CardRef[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micError, setMicError] = useState<MicErrorInfo | null>(initialError || null);

  // Audio Contexts & WebSockets
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const inputScriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNextStartTimeRef = useRef<number>(0);
  const activeAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const captionsEndRef = useRef<HTMLDivElement>(null);

  const isCancelledRef = useRef<boolean>(false);

  useEffect(() => {
    captionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [captions.length]);

  const startLiveSession = async () => {
    isCancelledRef.current = false;
    try {
        setErrorMessage(null);
        setMicError(null);
        setStatusMessage('Requesting microphone access...');
        setOrbState('thinking');

        // 1. Acquire microphone stream FIRST (directly on user tap)
        let stream = micStreamRef.current;
        if (!stream || !stream.active) {
          if (initialStream && initialStream.active) {
            stream = initialStream;
          } else {
            stream = await requestUserMicrophone({
              audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });
          }
        }
        micStreamRef.current = stream;

        // 2. Setup Audio contexts
        const inputCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
          sampleRate: 16000,
        });
        const outputCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
          sampleRate: 24000,
        });
        inputAudioCtxRef.current = inputCtx;
        outputAudioCtxRef.current = outputCtx;

        await inputCtx.resume();
        await outputCtx.resume();

        // 3. Fetch ephemeral token
        setStatusMessage('Requesting secure session token...');
        const tokenRes = await fetch('/api/live/token', { method: 'POST' });
        if (!tokenRes.ok) {
          const errData = await tokenRes.json().catch(() => ({}));
          throw new Error(errData.error || `Unable to start live session (HTTP ${tokenRes.status})`);
        }

        const { token } = await tokenRes.json();
        if (isCancelledRef.current) return;

        setStatusMessage('Connecting audio stream...');

        // 4. Open WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/live-ws?token=${encodeURIComponent(token)}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        // Connect mic audio to processor
        const source = inputCtx.createMediaStreamSource(stream);
        const scriptProcessor = inputCtx.createScriptProcessor(2048, 1, 1);
        inputScriptProcessorRef.current = scriptProcessor;

        scriptProcessor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);

          // Calculate RMS amplitude for orb listening state
          let sumSquares = 0;
          const int16Array = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            sumSquares += s * s;
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          const rms = Math.sqrt(sumSquares / inputData.length);
          setAudioLevel(Math.min(1, rms * 4));

          // Base64 encode PCM 16-bit
          const uint8 = new Uint8Array(int16Array.buffer);
          let binary = '';
          for (let i = 0; i < uint8.byteLength; i++) {
            binary += String.fromCharCode(uint8[i]);
          }
          const base64Audio = btoa(binary);

          ws.send(
            JSON.stringify({
              type: 'audio',
              pcm16Base64: base64Audio,
            })
          );
        };

        source.connect(scriptProcessor);
        scriptProcessor.connect(inputCtx.destination);

        ws.onopen = () => {
          setStatusMessage('Live with Sagar’s AI. Speak anytime.');
          setOrbState('idle');

          // Start 3-minute countdown
          setSessionTimeRemaining(180);
          timerIntervalRef.current = window.setInterval(() => {
            setSessionTimeRemaining((prev) => {
              if (prev <= 1) {
                handleEndCall();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'audio' && data.pcm24Base64) {
              setOrbState('speaking');
              playPcm24Chunk(outputCtx, data.pcm24Base64);
            } else if (data.type === 'interrupted') {
              // Full duplex: visitor spoke over model -> cancel queued audio immediately
              stopActivePlayback(outputCtx);
              setOrbState('listening');
            } else if (data.type === 'turn_complete') {
              setOrbState('idle');
            } else if (data.type === 'caption') {
              const newText = data.text?.trim();
              if (newText) {
                setCaptions((prev) => {
                  const last = prev[prev.length - 1];
                  if (last && last.role === data.role) {
                    return [
                      ...prev.slice(0, -1),
                      { ...last, text: `${last.text} ${newText}` },
                    ];
                  }
                  return [
                    ...prev,
                    {
                      id: `caption-${Date.now()}-${Math.random()}`,
                      role: data.role,
                      text: newText,
                    },
                  ];
                });
              }
            } else if (data.type === 'show_card') {
              const newCard: CardRef = { type: data.cardType, id: data.cardId };
              setLiveCards((prev) => [...prev, newCard]);
              if (onCardTriggered) onCardTriggered(newCard);
            } else if (data.type === 'set_mood') {
              const newMood = data.mood as OrbMood;
              setOrbMood(newMood);
              if (onMoodChange) onMoodChange(newMood);
            } else if (data.type === 'error') {
              setErrorMessage(data.message || 'Live session encountered an error.');
            }
          } catch {
            // Ignore parse errors
          }
        };

        ws.onerror = () => {
          setErrorMessage('Could not connect to Live voice service.');
        };

        ws.onclose = () => {
          setStatusMessage('Live call ended.');
        };
      } catch (err: unknown) {
        const parsed = parseMicError(err);
        setMicError(parsed);
        setStatusMessage(parsed.title);
        setOrbState('idle');
      }
    };

  useEffect(() => {
    if (!isOpen) return;

    if (initialError) {
      setMicError(initialError);
      setStatusMessage(initialError.title);
      setOrbState('idle');
      return;
    }

    startLiveSession();

    return () => {
      isCancelledRef.current = true;
      cleanupAudio();
    };
  }, [isOpen, initialError, initialStream]);

  const playPcm24Chunk = (ctx: AudioContext, base64Pcm: string) => {
    try {
      const binary = atob(base64Pcm);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);

      let sumSquares = 0;
      for (let i = 0; i < int16Array.length; i++) {
        const val = int16Array[i] / 32768.0;
        float32Array[i] = val;
        sumSquares += val * val;
      }

      const rms = Math.sqrt(sumSquares / int16Array.length);
      setAudioLevel(Math.min(1, rms * 4));

      const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const startTime = Math.max(ctx.currentTime, outputNextStartTimeRef.current);
      source.start(startTime);
      outputNextStartTimeRef.current = startTime + audioBuffer.duration;

      activeAudioSourcesRef.current.push(source);
      source.onended = () => {
        const idx = activeAudioSourcesRef.current.indexOf(source);
        if (idx !== -1) activeAudioSourcesRef.current.splice(idx, 1);
        if (activeAudioSourcesRef.current.length === 0) {
          setOrbState('idle');
        }
      };
    } catch {
      // Audio playback catch
    }
  };

  const stopActivePlayback = (ctx: AudioContext) => {
    for (const src of activeAudioSourcesRef.current) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Ignore
      }
    }
    activeAudioSourcesRef.current = [];
    outputNextStartTimeRef.current = ctx.currentTime;
  };

  const cleanupAudio = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (inputScriptProcessorRef.current) {
      try {
        inputScriptProcessorRef.current.disconnect();
      } catch {}
      inputScriptProcessorRef.current = null;
    }

    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {}
      micStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {}
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      stopActivePlayback(outputAudioCtxRef.current);
      try {
        outputAudioCtxRef.current.close();
      } catch {}
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
  };

  const handleEndCall = () => {
    cleanupAudio();
    onClose(captions, liveCards);
  };

  const handleToggleMute = () => {
    if (micStreamRef.current) {
      const tracks = micStreamRef.current.getAudioTracks();
      const nextMuted = !isMuted;
      tracks.forEach((t) => {
        t.enabled = !nextMuted;
      });
      setIsMuted(nextMuted);
    }
  };

  const handleExtendSession = () => {
    setSessionTimeRemaining((prev) => prev + 180);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(sessionTimeRemaining / 60);
  const seconds = sessionTimeRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-talk-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-[4px] animate-fade-up"
    >
      <div className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-[16px] border border-[#14161A]/16 dark:border-[#F2F0EA]/18 bg-[#FAF8F4] dark:bg-[#16181C] shadow-lg overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#14161A]/10 dark:border-[#F2F0EA]/12 bg-[#F6F4EF]/80 dark:bg-[#111215]/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse" />
            <h3
              id="live-talk-title"
              className="text-xs font-semibold tracking-wide uppercase text-[#14161A] dark:text-[#F2F0EA]"
            >
              Talk Live · AI Voice
            </h3>
            <span className="text-[11px] text-[#14161A]/40 dark:text-[#F2F0EA]/40">
              Gemini 3.8 Live
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Session Timer */}
            <div
              className={`px-2.5 py-1 rounded-[6px] text-xs font-mono tabular-nums border ${
                sessionTimeRemaining <= 30
                  ? 'border-[#C8102E] text-[#C8102E] font-semibold bg-[#C8102E]/10'
                  : 'border-[#14161A]/12 dark:border-[#F2F0EA]/14 text-[#14161A]/75 dark:text-[#F2F0EA]/75'
              }`}
            >
              {timeFormatted}
            </div>

            {sessionTimeRemaining <= 45 && (
              <button
                type="button"
                onClick={handleExtendSession}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-[6px] bg-[#C8102E] text-white hover:bg-[#A50D26] cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>+3m</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleEndCall}
              aria-label="End live conversation"
              className="w-8 h-8 rounded-full bg-[#C8102E]/10 hover:bg-[#C8102E] text-[#C8102E] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Presence Orb Arena */}
        <div className="relative py-6 px-4 flex flex-col items-center justify-center border-b border-[#14161A]/8 dark:border-[#F2F0EA]/10 bg-radial from-[#F6F4EF] to-[#FAF8F4] dark:from-[#131518] dark:to-[#16181C]">
          <AssistantOrb
            state={orbState}
            mood={orbMood}
            audioLevel={audioLevel}
            size={130}
          />
          <p className="mt-3 text-xs text-[#14161A]/65 dark:text-[#F2F0EA]/65 font-medium text-center">
            {statusMessage}
          </p>
          <p className="mt-0.5 text-[11px] text-[#14161A]/40 dark:text-[#F2F0EA]/40">
            Tone: {orbMood} · Full duplex (speak freely to interrupt)
          </p>

          {micError && (
            <div className="mt-3 w-full max-w-md mx-auto p-3.5 rounded-[12px] bg-[#C8102E]/10 border border-[#C8102E]/20 text-xs text-left animate-fade-up">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-[#C8102E]">{micError.title}</p>
                  <p className="text-[#14161A]/85 dark:text-[#F2F0EA]/85 leading-relaxed">
                    {micError.message}
                  </p>
                  {micError.suggestedAction && (
                    <p className="text-[11px] text-[#14161A]/60 dark:text-[#F2F0EA]/60">
                      {micError.suggestedAction}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#C8102E]/15 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMicError(null);
                    setErrorMessage(null);
                    // Retrying directly from user tap
                    requestUserMicrophone({
                      audio: {
                        channelCount: 1,
                        sampleRate: 16000,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                      },
                    })
                      .then((newStream) => {
                        micStreamRef.current = newStream;
                        setStatusMessage('Microphone connected. Initializing...');
                        startLiveSession();
                      })
                      .catch((retryErr) => {
                        const parsed = parseMicError(retryErr);
                        setMicError(parsed);
                        setStatusMessage(parsed.title);
                      });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#14161A]/14 dark:border-[#F2F0EA]/16 bg-[#FAF8F4] dark:bg-[#16181C] text-xs font-medium text-[#14161A] dark:text-[#F2F0EA] hover:border-[#C8102E] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try again</span>
                </button>

                {micError.canOpenInNewTab && (
                  <a
                    href={typeof window !== 'undefined' ? window.location.href : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#C8102E] text-white text-xs font-medium hover:bg-[#A50D26] transition-colors cursor-pointer"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {errorMessage && !micError && (
            <div className="mt-2 px-3 py-1.5 rounded-[8px] bg-[#C8102E]/10 text-xs text-[#C8102E] max-w-sm text-center">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Real-time Captions & Triggered Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 min-h-[160px] max-h-[300px]">
          {captions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-xs text-[#14161A]/45 dark:text-[#F2F0EA]/45 py-8">
              Live captions will appear here as you speak.
            </div>
          ) : (
            captions.map((cap) => (
              <div
                key={cap.id}
                className={`flex flex-col ${
                  cap.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-[10px] text-[#14161A]/45 dark:text-[#F2F0EA]/45 mb-0.5">
                  {cap.role === 'user' ? 'You' : 'Sagar’s AI assistant'}
                </span>
                <div
                  className={`max-w-[85%] rounded-[10px] px-3 py-2 text-xs leading-relaxed ${
                    cap.role === 'user'
                      ? 'bg-[#EEECE6] dark:bg-[#1F2128] text-[#14161A] dark:text-[#F2F0EA]'
                      : 'border border-[#14161A]/10 dark:border-[#F2F0EA]/12 bg-[#FAF8F4] dark:bg-[#181A1F] text-[#14161A] dark:text-[#F2F0EA]'
                  }`}
                >
                  {cap.text}
                </div>
              </div>
            ))
          )}

          {/* Render any rich cards requested by tool call in real-time */}
          {liveCards.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#14161A]/50 dark:text-[#F2F0EA]/50">
                Triggered Cards
              </span>
              {liveCards.map((card, i) => (
                <CardRenderer key={`live-card-${i}-${card.type}-${card.id}`} card={card} />
              ))}
            </div>
          )}

          <div ref={captionsEndRef} />
        </div>

        {/* Footer Controls */}
        <div className="px-5 py-3 border-t border-[#14161A]/10 dark:border-[#F2F0EA]/12 flex items-center justify-between gap-4 bg-[#F6F4EF]/60 dark:bg-[#111215]/60 text-xs">
          <div className="flex items-center gap-2 text-[#14161A]/60 dark:text-[#F2F0EA]/60">
            <Volume2 className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>AI Voice · Never human or Sagar</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleMute}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-xs font-medium cursor-pointer transition-colors ${
                isMuted
                  ? 'border-[#C8102E] text-[#C8102E] bg-[#C8102E]/10'
                  : 'border-[#14161A]/14 dark:border-[#F2F0EA]/16 text-[#14161A] dark:text-[#F2F0EA] hover:border-[#C8102E]'
              }`}
            >
              {isMuted ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Mute mic</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              className="px-4 py-1.5 rounded-[8px] bg-[#C8102E] text-white text-xs font-medium hover:bg-[#A50D26] cursor-pointer"
            >
              End call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
