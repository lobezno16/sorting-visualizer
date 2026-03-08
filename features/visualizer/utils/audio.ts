// Web Audio API engine for sorting visualization
// Creates tones mapping array values to frequencies

let audioCtx: AudioContext | null = null;
// Add a global gain node to control master volume and prevent clipping
let masterGainNode: GainNode | null = null;

// Initialize the audio context (must be called after a user gesture)
export function initAudio() {
    if (typeof window === "undefined") return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.value = 0.1; // globally lower volume to prevent ear-bleeding
        masterGainNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

export type ToneType = "compare" | "swap" | "active" | "sorted";

/**
 * Plays a discrete tone mapped to an array value.
 * @param value The value of the array element (determines pitch)
 * @param maxVal The maximum possible value in the array (for scaling)
 * @param type The type of operation (determines waveform/envelope)
 */
export function playTone(value: number, maxVal: number, type: ToneType = "compare") {
    if (!audioCtx || !masterGainNode) return;

    const osc = audioCtx.createOscillator();
    const node = audioCtx.createGain();

    // Map value to frequency (e.g., 200Hz to 1200Hz)
    // We use an exponential curve so it sounds musically pleasant
    const minFreq = 200;
    const maxFreq = 1200;
    const t = maxVal === 0 ? 0 : value / maxVal;
    const frequency = minFreq * Math.pow(maxFreq / minFreq, t);

    osc.frequency.value = frequency;

    // Determine waveform and timing based on operation type
    let attack = 0.01;
    let release = 0.05;
    let sustainVolume = 0.5;

    switch (type) {
        case "compare":
            osc.type = "sine";
            sustainVolume = 0.3;
            release = 0.05;
            break;
        case "swap":
            osc.type = "triangle";
            sustainVolume = 0.7;
            attack = 0.02;
            release = 0.1;
            break;
        case "active":
            osc.type = "sine";
            sustainVolume = 0.4;
            release = 0.05;
            break;
        case "sorted":
            osc.type = "sine";
            sustainVolume = 0.2;
            // High chime for marking sorted
            osc.frequency.value = 1000 + frequency * 0.5;
            attack = 0.05;
            release = 0.15;
            break;
    }

    // Connect nodes
    osc.connect(node);
    node.connect(masterGainNode);

    // Envelope (ADSR) to prevent audio clicks
    const now = audioCtx.currentTime;
    node.gain.setValueAtTime(0, now);
    node.gain.linearRampToValueAtTime(sustainVolume, now + attack);
    node.gain.exponentialRampToValueAtTime(0.001, now + attack + release);

    // Start and stop oscillator
    osc.start(now);
    osc.stop(now + attack + release + 0.05); // Give a bit of margin
}
