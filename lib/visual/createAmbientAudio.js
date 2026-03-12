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
  let melodyOsc = null;
  let melodyGain = null;
  let melodyTimeout = null;
  let enabled = true;
  let started = false;
  const targetGain = 0.85;

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
      createVoice("triangle", 196, 0.16),
      createVoice("triangle", 246.94, 0.12),
      createVoice("sine", 329.63, 0.095),
      createVoice("sine", 392, 0.08),
    ];

    const drone = context.createOscillator();
    const droneGain = context.createGain();
    drone.type = "sine";
    drone.frequency.value = 110;
    droneGain.gain.value = 0.08;
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
    padLfoGain.gain.value = 320;
    padLfo.connect(padLfoGain);
    padLfoGain.connect(filter.frequency);
    padLfo.start();

    shimmerLfo.type = "sine";
    shimmerLfo.frequency.value = 0.12;
    shimmerLfoGain.gain.value = 0.12;
    shimmerLfo.connect(shimmerLfoGain);
    shimmerLfoGain.connect(master.gain);
    shimmerLfo.start();

    const sparkLfo = context.createOscillator();
    const sparkGain = context.createGain();
    sparkLfo.type = "sawtooth";
    sparkLfo.frequency.value = 0.35;
    sparkGain.gain.value = 0.035;
    sparkLfo.connect(sparkGain);
    sparkGain.connect(master);
    sparkLfo.start();
    voices.push({ oscillator: sparkLfo, gain: sparkGain });

    melodyOsc = context.createOscillator();
    melodyGain = context.createGain();
    melodyOsc.type = "sine";
    melodyGain.gain.value = 0;
    melodyOsc.connect(melodyGain);
    melodyGain.connect(master);

    const melodyNotes = [262, 294, 330, 349, 392, 440, 494];
    let melodyIndex = 0;

    const playMelodyStep = () => {
      if (!melodyOsc || !melodyGain) {
        return;
      }

      const now = context.currentTime;
      const nextFreq = melodyNotes[melodyIndex % melodyNotes.length];
      melodyIndex += 1;

      melodyOsc.frequency.cancelScheduledValues(now);
      melodyOsc.frequency.setValueAtTime(nextFreq, now);

      melodyGain.gain.cancelScheduledValues(now);
      melodyGain.gain.setValueAtTime(0, now);
      melodyGain.gain.linearRampToValueAtTime(0.16, now + 0.45);
      melodyGain.gain.linearRampToValueAtTime(0.01, now + 1.25);

      const delay = 950 + Math.random() * 500;
      melodyTimeout = window.setTimeout(playMelodyStep, delay);
    };

    playMelodyStep();
    melodyOsc.start();

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
        if (melodyOsc) {
          melodyOsc.stop();
          melodyOsc = null;
        }
        if (melodyTimeout) {
          clearTimeout(melodyTimeout);
          melodyTimeout = null;
        }
        context.close();
      }, 250);
    },
  };
}
