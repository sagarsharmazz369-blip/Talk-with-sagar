export interface MicErrorInfo {
  code: 'NotAllowedError' | 'NotFoundError' | 'NotReadableError' | 'SecurityError' | 'UnknownError';
  title: string;
  message: string;
  inFrame: boolean;
  canOpenInNewTab: boolean;
  suggestedAction?: string;
}

export function isRunningInIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
}

export function openAppInNewTab(): void {
  if (typeof window !== 'undefined') {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  }
}

export function parseMicError(err: unknown): MicErrorInfo {
  const inFrame = isRunningInIframe();
  const errorName = err && typeof err === 'object' && 'name' in err ? String(err.name) : '';
  const errorMessage = err && typeof err === 'object' && 'message' in err ? String(err.message) : '';

  // 1. SecurityError: blocked because the app runs inside an iframe / permissions policy
  if (errorName === 'SecurityError') {
    return {
      code: 'SecurityError',
      title: 'Microphone blocked by preview frame',
      message: 'Microphone access is blocked because the app runs inside an embedded frame.',
      inFrame: true,
      canOpenInNewTab: true,
      suggestedAction: 'Open this app in a full browser tab to use microphone features.',
    };
  }

  // 2. NotAllowedError: blocked in browser or inside frame
  if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
    if (inFrame) {
      return {
        code: 'NotAllowedError',
        title: 'Microphone permission blocked in frame',
        message: 'Microphone access is blocked in this preview frame. You can open the app in a new tab, or allow microphone in your browser site settings.',
        inFrame: true,
        canOpenInNewTab: true,
        suggestedAction: 'Open in a new tab or update site settings.',
      };
    }

    return {
      code: 'NotAllowedError',
      title: 'Microphone blocked in browser',
      message: 'Microphone access is blocked in your browser. To allow it, click the lock or site settings icon in your address bar, set Microphone to "Allow", and reload.',
      inFrame: false,
      canOpenInNewTab: false,
      suggestedAction: 'Allow microphone access in site settings.',
    };
  }

  // 3. NotFoundError: no microphone found
  if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
    return {
      code: 'NotFoundError',
      title: 'No microphone found',
      message: 'No microphone was found on your device. Please plug in or enable an audio input device to use voice features.',
      inFrame,
      canOpenInNewTab: false,
      suggestedAction: 'Connect an audio input device.',
    };
  }

  // 4. NotReadableError: microphone in use by another app or hardware error
  if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
    return {
      code: 'NotReadableError',
      title: 'Microphone in use by another app',
      message: 'Your microphone is currently in use by another application or busy. Please close other apps using your mic (such as Zoom, Meet, or FaceTime) and try again.',
      inFrame,
      canOpenInNewTab: false,
      suggestedAction: 'Close other apps using the microphone.',
    };
  }

  // Fallback for unknown errors
  return {
    code: 'UnknownError',
    title: 'Microphone unavailable',
    message: errorMessage || 'Microphone access could not be established. Please check your browser permissions.',
    inFrame,
    canOpenInNewTab: inFrame,
  };
}

export async function requestUserMicrophone(
  constraints: MediaStreamConstraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
  }
): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    const error = new Error('Microphone access is not supported in this browser.');
    error.name = 'NotFoundError';
    throw error;
  }

  return await navigator.mediaDevices.getUserMedia(constraints);
}
