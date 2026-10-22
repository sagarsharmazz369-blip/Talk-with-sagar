import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  analyser,
  isRecording,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barCount = 24;
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      if (analyser && isRecording && dataArray) {
        analyser.getByteFrequencyData(dataArray);
      }

      const barWidth = Math.max(2, (width - (barCount - 1) * 3) / barCount);
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        let value = 0;
        if (analyser && isRecording && dataArray) {
          const binIndex = Math.floor((i / barCount) * (dataArray.length * 0.5));
          value = dataArray[binIndex] / 255;
        }

        const barHeight = Math.max(4, value * (height - 6));
        const x = i * (barWidth + 3);
        const y = centerY - barHeight / 2;

        ctx.fillStyle = '#C8102E';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isRecording) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-8 block pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
