export function createAmbientAudio() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  const context = new AudioContextClass();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  const masterLfo = context.createOscillator();
  const masterLfoGain = context.createGain();

  const voices = [
    { type: "sine", frequency: 196, gain: 0.026 },
    { type: "sine", frequency: 246.94, gain: 0.018 },
    { type: "sine", frequency: 293.66, gain: 0.012 },
  ].map((voice) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = voice.type;
    oscillator.frequency.value = voice.frequency;
    gain.gain.value = voice.gain;
    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start();

    return { oscillator, gain };
  });

  filter.type = "lowpass";
  filter.frequency.value = 780;
  filter.Q.value = 0.45;
  filter.connect(master);

  master.gain.value = 0;
  master.connect(context.destination);

  lfo.type = "sine";
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  masterLfo.type = "sine";
  masterLfo.frequency.value = 0.045;
  masterLfoGain.gain.value = 0.018;
  masterLfo.connect(masterLfoGain);
  masterLfoGain.connect(master.gain);
  masterLfo.start();

  let enabled = true;
  const targetGain = 0.085;

  function fadeTo(value, duration = 1.2) {
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + duration);
  }

  return {
    async resume() {
      if (context.state === "suspended") {
        await context.resume();
      }

      fadeTo(enabled ? targetGain : 0);
    },
    toggle() {
      enabled = !enabled;
      fadeTo(enabled ? targetGain : 0, 0.8);
      return enabled;
    },
    isEnabled() {
      return enabled;
    },
    stop() {
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.25);
      window.setTimeout(() => {
        voices.forEach(({ oscillator }) => oscillator.stop());
        lfo.stop();
        masterLfo.stop();
        context.close();
      }, 300);
    },
  };
}
