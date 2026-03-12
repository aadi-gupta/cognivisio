export function createAmbientAudio() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  let context = null;
  let master = null;
  let filter = null;
  let padLfo = null;
  let padLfoGain = null;
  let shimmerLfo = null;
  let shimmerLfoGain = null;
  let voices = [];
  let enabled = true;
  let started = false;
  const targetGain = 0.55;

  function fadeTo(value, duration = 1) {
    if (!context || !master) {
      return;
    }

    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + duration);
  }

  function createVoice(type, frequency, gainValue) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;
    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start();

    return { oscillator, gain };
  }

  function ensureStarted() {
    if (started) {
      return;
    }

    context = new AudioContextClass();
    master = context.createGain();
    filter = context.createBiquadFilter();
    padLfo = context.createOscillator();
    padLfoGain = context.createGain();
    shimmerLfo = context.createOscillator();
    shimmerLfoGain = context.createGain();

    voices = [
      createVoice("triangle", 196, 0.11),
      createVoice("triangle", 246.94, 0.08),
      createVoice("sine", 329.63, 0.065),
      createVoice("sine", 392, 0.045),
    ];

    const drone = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = "sine";
    drone.frequency.value = 110;
    droneGain.gain.value = 0.05;
    drone.connect(droneGain);
    droneGain.connect(master);
    drone.start();
    voices.push({ oscillator: drone, gain: droneGain });

    filter.type = "lowpass";
    filter.frequency.value = 1100;
    filter.Q.value = 0.55;
    filter.connect(master);

    master.gain.value = 0;
    master.connect(context.destination);

    padLfo.type = "sine";
    padLfo.frequency.value = 0.08;
    padLfoGain.gain.value = 260;
    padLfo.connect(padLfoGain);
    padLfoGain.connect(filter.frequency);
    padLfo.start();

    shimmerLfo.type = "sine";
    shimmerLfo.frequency.value = 0.12;
    shimmerLfoGain.gain.value = 0.085;
    shimmerLfo.connect(shimmerLfoGain);
    shimmerLfoGain.connect(master.gain);
    shimmerLfo.start();

    const sparkLfo = context.createOscillator();
    const sparkGain = context.createGain();
    sparkLfo.type = "sawtooth";
    sparkLfo.frequency.value = 0.35;
    sparkGain.gain.value = 0.024;
    sparkLfo.connect(sparkGain);
    sparkGain.connect(master);
    sparkLfo.start();
    voices.push({ oscillator: sparkLfo, gain: sparkGain });

    started = true;
  }

  return {
    async resume() {
      ensureStarted();

      if (context.state === "suspended") {
        await context.resume();
      }

      fadeTo(enabled ? targetGain : 0, 0.7);
    },
    toggle() {
      enabled = !enabled;
      fadeTo(enabled ? targetGain : 0, 0.5);
      return enabled;
    },
    isEnabled() {
      return enabled;
    },
    stop() {
      if (!started || !context || !master) {
        return;
      }

      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.2);

      window.setTimeout(() => {
        voices.forEach(({ oscillator }) => oscillator.stop());
        padLfo.stop();
        shimmerLfo.stop();
        context.close();
      }, 250);
    },
  };
}
