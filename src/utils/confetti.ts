import confettiLib from 'canvas-confetti';

// Same API as canvas-confetti, but skipped when the OS "reduce motion" setting is on
export default function confetti(options?: confettiLib.Options) {
  return confettiLib({ disableForReducedMotion: true, ...options });
}
