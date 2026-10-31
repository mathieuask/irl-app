import { createAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

const SRC = {
  reel: require('../assets/sfx/reel.wav'),
  tada: require('../assets/sfx/tada.wav'),
  tick: require('../assets/sfx/tick.wav'),
  go: require('../assets/sfx/go.wav'),
  pop: require('../assets/sfx/pop.wav'),
  impact: require('../assets/sfx/impact.wav'),
  shutter: require('../assets/sfx/shutter.wav'),
  whoosh: require('../assets/sfx/whoosh.wav'),
  ding: require('../assets/sfx/ding.wav'),
};

export type Sfx = keyof typeof SRC;

// A demo must never crash on audio: every failure is swallowed.
export function play(name: Sfx) {
  try {
    const p = createAudioPlayer(SRC[name]);
    p.play();
    setTimeout(() => {
      try { p.remove(); } catch {}
    }, 4000);
  } catch {}
  try {
    Haptics.impactAsync(name === 'impact' || name === 'go' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}
