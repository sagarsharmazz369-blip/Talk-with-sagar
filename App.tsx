import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  ExternalLink,
  Github,
  Headphones,
  Linkedin,
  Mic,
  MicOff,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Youtube,
} from 'lucide-react';
import { AssistantOrb, OrbMood, OrbState } from './components/AssistantOrb';
import { LiveCaption, LiveConversationModal } from './components/LiveConversationModal';
import { MarkdownMessage } from './components/MarkdownMessage';
import { QuickView } from './components/QuickView';
import { CardRenderer } from './components/RichCards';
import {
  CardRef,
  KNOWLEDGE_BASE,
  localKeywordFallback,
  STARTER_CHIPS,
} from './data/knowledgeBase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cards?: CardRef[];
  mood?: OrbMood;
  fallbackUsed?: boolean;
  notice?: string;
  searchSources?: Array<{ title: string; url: string }>;
  timestamp: string;
  isGeneral?: boolean;
}

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'chat' | 'quickview'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [orbMood, setOrbMood] = useState<OrbMood>('calm');
  const [isLiveOpen, setIsLiveOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Adjust textarea height automatically
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Browser speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListeningMic(false);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleMicListening = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListeningMic) {
      speechRecognitionRef.current.stop();
      setIsListeningMic(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListeningMic(true);
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    }
  };

  // Extract recent card keys from message history (to prevent duplicates within 5 messages)
  const getRecentCardKeys = (): string[] => {
    const recent = messages.slice(-5);
    const keys: string[] = [];
    for (const msg of recent) {
      if (msg.cards) {
        for (const c of msg.cards) {
          keys.push(`${c.type}:${c.id}`);
        }
      }
    }
    return keys;
  };

  // Send message to server
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || isLoading) return;

    if (text.length > 1000) {
      alert('Message must be 1,000 characters or less.');
      return;
    }

    // Stop ongoing audio
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setPlayingAudioId(null);
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsLoading(true);
    setOrbState('thinking');

    const newSessionCount = sessionCount + 1;
    setSessionCount(newSessionCount);

    const recentCardKeys = getRecentCardKeys();

    // Browser local time & timezone
    const localDateTime = {
      dateTime: new Date().toLocaleString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Last 10 messages for conversational context
    const history = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionMessageCount: newSessionCount,
          recentCardKeys,
          localDateTime,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || "I'm here to help with Sagar's portfolio.",
        cards: data.cards || [],
        mood: data.mood || 'calm',
        fallbackUsed: data.fallbackUsed,
        notice: data.notice,
        searchSources: data.searchSources,
        isGeneral: data.isGeneral,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.mood) setOrbMood(data.mood);
      setOrbState('idle');
    } catch (err) {
      console.warn('[App] Chat request error, falling back locally:', err);
      const fallback = localKeywordFallback(text, recentCardKeys);
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fallback.reply,
        cards: fallback.cards,
        mood: 'calm',
        fallbackUsed: true,
        notice: 'Live AI is unavailable right now, showing saved answers.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setOrbMood('calm');
      setOrbState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Play text-to-speech for an assistant message
  const handlePlayTTS = async (msg: ChatMessage) => {
    if (playingAudioId === msg.id) {
      audioPlayerRef.current?.pause();
      setPlayingAudioId(null);
      setOrbState('idle');
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    try {
      setPlayingAudioId(msg.id);
      setOrbState('speaking');

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.content }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const data = await res.json();
      if (!data.audioBase64) throw new Error('No audio returned');

      const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setPlayingAudioId(null);
        setOrbState('idle');
      };

      audio.onerror = () => {
        setPlayingAudioId(null);
        setOrbState('idle');
      };

      await audio.play();
    } catch (err) {
      console.warn('[App] TTS play error:', err);
      setPlayingAudioId(null);
      setOrbState('idle');
    }
  };

  // Switch to chat from QuickView with optional starter query
  const handleSwitchToChat = (query?: string) => {
    setViewMode('chat');
    if (query) {
      setTimeout(() => handleSendMessage(query), 100);
    }
  };

  const handleLiveClose = (captions: LiveCaption[], cards: CardRef[]) => {
    setIsLiveOpen(false);
    if (captions.length > 0) {
      const summaryMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Completed voice conversation (${captions.length} turns).`,
        cards: cards.slice(0, 2),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, summaryMsg]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F4EF] text-[#14161A] dark:bg-[#111215] dark:text-[#F2F0EA] font-sans antialiased">
      {/* Hidden audio element */}
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Desktop Left Rail / Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-72 lg:w-80 shrink-0 border-r border-[#14161A]/10 dark:border-[#F2F0EA]/10 p-6 bg-[#F6F4EF] dark:bg-[#111215] select-none">
        <div className="space-y-6">
          {/* Brand & Persona */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C8102E]">
                Talk to Sagar's AI
              </span>
            </div>
            <h1 className="mt-2 font-serif-editorial text-3xl font-medium tracking-tight text-[#14161A] dark:text-[#F2F0EA]">
              {KNOWLEDGE_BASE.name}
            </h1>
            <p className="mt-1 text-xs text-[#14161A]/65 dark:text-[#F2F0EA]/65 leading-relaxed">
              {KNOWLEDGE_BASE.role} · {KNOWLEDGE_BASE.location}
            </p>
          </div>

          {/* Interactive Assistant Presence Orb */}
          <div className="p-4 rounded-xl border border-[#14161A]/10 dark:border-[#F2F0EA]/12 bg-[#FAF8F4] dark:bg-[#16181C] text-center space-y-3">
            <div className="flex justify-center items-center py-1">
              <AssistantOrb state={orbState} mood={orbMood} size={90} />
            </div>
            <div>
              <div className="text-xs font-medium text-[#14161A] dark:text-[#F2F0EA]">
                {orbState === 'thinking' ? 'Analyzing...' : orbState === 'speaking' ? 'Speaking...' : 'Assistant Online'}
              </div>
              <div className="text-[11px] text-[#14161A]/50 dark:text-[#F2F0EA]/50 capitalize">
                Tone: {orbMood}
              </div>
            </div>

            {/* Quick Actions in Rail */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/8">
              <button
                type="button"
                onClick={() => setIsLiveOpen(true)}
                className="py-1.5 px-2.5 rounded-lg border border-[#C8102E]/30 text-[#C8102E] hover:bg-[#C8102E]/8 text-[11px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Start a real-time voice call"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Talk Live</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode((prev) => (prev === 'chat' ? 'quickview' : 'chat'))}
                className="py-1.5 px-2.5 rounded-lg border border-[#14161A]/12 dark:border-[#F2F0EA]/15 text-[#14161A]/80 dark:text-[#F2F0EA]/80 hover:bg-[#14161A]/5 dark:hover:bg-[#F2F0EA]/5 text-[11px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{viewMode === 'chat' ? 'Quick View' : 'Chat View'}</span>
              </button>
            </div>
          </div>

          {/* Bio Snippet */}
          <div className="text-[12.5px] leading-relaxed text-[#14161A]/70 dark:text-[#F2F0EA]/70">
            <p>
              Sagar is a Class 12 student building practical AI tools (scholarship finder{' '}
              <strong className="text-[#14161A] dark:text-[#F2F0EA]">Udaan</strong>, agricultural{' '}
              <strong className="text-[#14161A] dark:text-[#F2F0EA]">Crop Disease Detector</strong>, and food recovery{' '}
              <strong className="text-[#14161A] dark:text-[#F2F0EA]">Surplus Connector</strong>).
            </p>
          </div>
        </div>

        {/* Footer Links & Direct Contacts */}
        <div className="pt-6 border-t border-[#14161A]/10 dark:border-[#F2F0EA]/10 space-y-2">
          <div className="text-[11px] font-semibold text-[#14161A]/40 dark:text-[#F2F0EA]/40 uppercase tracking-wider">
            Verified Links
          </div>
          <div className="flex flex-col gap-1.5 text-xs">
            <a
              href="https://www.youtube.com/@JustSagarX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-[#14161A]/75 dark:text-[#F2F0EA]/75 hover:text-[#C8102E] dark:hover:text-[#C8102E] py-0.5 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube @JustSagarX</span>
              </span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="https://github.com/sagarsharmazz369-blip"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-[#14161A]/75 dark:text-[#F2F0EA]/75 hover:text-[#C8102E] dark:hover:text-[#C8102E] py-0.5 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="https://www.linkedin.com/in/sagar-sharma-29453b3b6/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-[#14161A]/75 dark:text-[#F2F0EA]/75 hover:text-[#C8102E] dark:hover:text-[#C8102E] py-0.5 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                <span>LinkedIn</span>
              </span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="mailto:sagarsharmazz369@gmail.com"
              className="inline-flex items-center justify-between text-[#14161A]/75 dark:text-[#F2F0EA]/75 hover:text-[#C8102E] dark:hover:text-[#C8102E] py-0.5 transition-colors"
            >
              <span>sagarsharmazz369@gmail.com</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Center Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[#14161A]/10 dark:border-[#F2F0EA]/10 bg-[#FAF8F4] dark:bg-[#16181C] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
            <div>
              <div className="font-serif-editorial text-base font-semibold leading-none text-[#14161A] dark:text-[#F2F0EA]">
                Sagar
              </div>
              <div className="text-[10px] text-[#14161A]/60 dark:text-[#F2F0EA]/60 leading-tight">
                AI Portfolio
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLiveOpen(true)}
              className="px-2.5 py-1 rounded-md border border-[#C8102E]/30 text-[#C8102E] text-xs font-medium inline-flex items-center gap-1"
            >
              <Headphones className="w-3 h-3" />
              <span>Talk Live</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode((v) => (v === 'chat' ? 'quickview' : 'chat'))}
              className="px-2.5 py-1 rounded-md border border-[#14161A]/15 dark:border-[#F2F0EA]/15 text-xs font-medium text-[#14161A]/80 dark:text-[#F2F0EA]/80"
            >
              {viewMode === 'chat' ? 'Quick View' : 'Chat'}
            </button>
          </div>
        </header>

        {/* View Switch: QuickView vs Chat */}
        {viewMode === 'quickview' ? (
          <div className="flex-1 overflow-y-auto">
            <QuickView onSwitchToChat={handleSwitchToChat} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Scrollable Chat Message List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
              <div className="max-w-[720px] mx-auto w-full space-y-6">
                {/* Empty State Banner (shown when no messages yet) */}
                {messages.length === 0 && (
                  <div className="py-8 sm:py-12 space-y-6 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#14161A]/10 dark:border-[#F2F0EA]/12 bg-[#FAF8F4] dark:bg-[#16181C] text-xs text-[#14161A]/70 dark:text-[#F2F0EA]/70">
                      <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
                      <span>Conversational AI Portfolio</span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#14161A] dark:text-[#F2F0EA]">
                        Talk to Sagar's AI
                      </h2>
                      <p className="max-w-md mx-auto text-sm sm:text-base text-[#14161A]/70 dark:text-[#F2F0EA]/70 leading-relaxed">
                        I am Sagar's AI assistant. I speak about Sagar Sharma in the third person, answering strictly from his verified knowledge base or assisting with general coding and technical inquiries.
                      </p>
                    </div>

                    {/* Starter Chips Grid */}
                    <div className="pt-4 max-w-xl mx-auto">
                      <div className="text-xs font-medium text-[#14161A]/50 dark:text-[#F2F0EA]/50 mb-3 uppercase tracking-wider">
                        Suggested Inquiries
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {STARTER_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleSendMessage(chip)}
                            className="px-3.5 py-1.5 rounded-lg border border-[#14161A]/12 dark:border-[#F2F0EA]/14 bg-[#FAF8F4] dark:bg-[#16181C] hover:border-[#C8102E] hover:text-[#C8102E] text-xs font-medium text-[#14161A]/85 dark:text-[#F2F0EA]/85 transition-colors cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Render Messages */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    } animate-fade-up`}
                  >
                    {/* Role Header */}
                    <div className="flex items-center gap-2 mb-1.5 px-1 text-[11px] text-[#14161A]/50 dark:text-[#F2F0EA]/50">
                      {msg.role === 'assistant' ? (
                        <>
                          <Bot className="w-3.5 h-3.5 text-[#C8102E]" />
                          <span className="font-medium text-[#14161A]/80 dark:text-[#F2F0EA]/80">
                            Sagar's AI Assistant
                          </span>
                          {msg.mood && (
                            <span className="capitalize text-[10px] px-1.5 py-0.2 rounded bg-[#14161A]/5 dark:bg-[#F2F0EA]/8">
                              {msg.mood}
                            </span>
                          )}
                        </>
                      ) : (
                        <span>You</span>
                      )}
                      <span>·</span>
                      <time>{msg.timestamp}</time>
                    </div>

                    {/* Speech Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 sm:px-5 py-3.5 ${
                        msg.role === 'user'
                          ? 'bg-[#14161A] text-white dark:bg-[#202227] dark:text-[#F2F0EA] rounded-br-xs shadow-sm'
                          : 'bg-[#FAF8F4] dark:bg-[#16181C] border border-[#14161A]/10 dark:border-[#F2F0EA]/12 rounded-bl-xs text-[#14161A] dark:text-[#F2F0EA] shadow-xs'
                      }`}
                    >
                      {/* Notice Banner (e.g. fallback notice) */}
                      {msg.notice && (
                        <div className="mb-2.5 pb-2 border-b border-[#14161A]/10 dark:border-[#F2F0EA]/10 text-xs text-[#C8102E] font-medium">
                          {msg.notice}
                        </div>
                      )}

                      {/* Message Content */}
                      <MarkdownMessage content={msg.content} />

                      {/* Google Search Grounding Sources */}
                      {msg.searchSources && msg.searchSources.length > 0 && (
                        <div className="mt-3.5 pt-2.5 border-t border-[#14161A]/8 dark:border-[#F2F0EA]/10">
                          <div className="text-[11px] font-semibold text-[#14161A]/50 dark:text-[#F2F0EA]/50 uppercase tracking-wider mb-1.5">
                            Sources
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.searchSources.map((source, sIdx) => (
                              <a
                                key={sIdx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#14161A]/6 dark:bg-[#F2F0EA]/8 text-[11px] font-medium text-[#C8102E] hover:underline"
                              >
                                <span className="max-w-[180px] truncate">{source.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Audio listen toggle button for assistant replies */}
                      {msg.role === 'assistant' && (
                        <div className="mt-3 pt-2 flex items-center justify-end border-t border-[#14161A]/6 dark:border-[#F2F0EA]/8">
                          <button
                            type="button"
                            onClick={() => handlePlayTTS(msg)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-[#14161A]/60 dark:text-[#F2F0EA]/60 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors cursor-pointer"
                            title="Listen to this response"
                          >
                            {playingAudioId === msg.id ? (
                              <>
                                <Pause className="w-3 h-3 text-[#C8102E] animate-pulse" />
                                <span className="text-[#C8102E] font-medium">Pause audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Embedded Visual Cards */}
                    {msg.cards && msg.cards.length > 0 && (
                      <div className="w-full mt-3 space-y-3 max-w-[85%] sm:max-w-[78%]">
                        {msg.cards.map((card, idx) => (
                          <CardRenderer key={`${card.type}-${card.id}-${idx}`} card={card} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking / Loading indicator */}
                {isLoading && (
                  <div className="flex flex-col items-start animate-fade-up">
                    <div className="flex items-center gap-2 mb-1.5 px-1 text-[11px] text-[#14161A]/50 dark:text-[#F2F0EA]/50">
                      <Bot className="w-3.5 h-3.5 text-[#C8102E]" />
                      <span className="font-medium text-[#14161A]/80 dark:text-[#F2F0EA]/80">
                        Sagar's AI Assistant
                      </span>
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-xs bg-[#FAF8F4] dark:bg-[#16181C] border border-[#14161A]/10 dark:border-[#F2F0EA]/12 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-[#14161A]/60 dark:text-[#F2F0EA]/60 ml-1">
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Sticky Input Bar */}
            <div className="border-t border-[#14161A]/10 dark:border-[#F2F0EA]/10 bg-[#FAF8F4]/90 dark:bg-[#16181C]/90 backdrop-blur-md p-3 sm:p-4 shrink-0">
              <div className="max-w-[720px] mx-auto w-full">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative flex items-end gap-2 bg-[#F6F4EF] dark:bg-[#111215] border border-[#14161A]/12 dark:border-[#F2F0EA]/14 rounded-2xl p-2 focus-within:border-[#C8102E] dark:focus-within:border-[#C8102E] transition-colors"
                >
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputMessage}
                    onChange={handleTextareaChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about Sagar's projects, tech stack, contact, or ask any general question..."
                    disabled={isLoading}
                    maxLength={1000}
                    className="flex-1 max-h-40 min-h-[40px] resize-none bg-transparent px-2 py-2 text-sm text-[#14161A] dark:text-[#F2F0EA] placeholder:text-[#14161A]/40 dark:placeholder:text-[#F2F0EA]/40 focus:outline-none"
                  />

                  {/* Mic toggle */}
                  <button
                    type="button"
                    onClick={toggleMicListening}
                    disabled={isLoading}
                    className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                      isListeningMic
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'text-[#14161A]/50 dark:text-[#F2F0EA]/50 hover:text-[#C8102E]'
                    }`}
                    title={isListeningMic ? 'Stop voice listening' : 'Dictate message'}
                  >
                    {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D26] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Sub-bar with character limit and message limit indicator */}
                <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-[#14161A]/50 dark:text-[#F2F0EA]/50">
                  <span>
                    {sessionCount}/30 session messages · 50 daily requests cap
                  </span>
                  <span>{inputMessage.length}/1000 characters</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Live Voice Conversation Modal */}
      {isLiveOpen && (
        <LiveConversationModal
          isOpen={isLiveOpen}
          onClose={handleLiveClose}
          onMoodChange={(mood) => setOrbMood(mood)}
        />
      )}
    </div>
  );
};

export default App;
