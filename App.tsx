import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Nav, Route } from './src/nav';
import { Onboarding, Pseudo } from './src/screens/onboarding';
import { Home, Profil, Rejoindre } from './src/screens/home';
import { ChoixJeu, Paywall, Distance } from './src/screens/create';
import { Lobby, Countdown, Reveal } from './src/screens/lobby';
import { Manhunt } from './src/screens/manhunt';
import { Geo } from './src/screens/geo';
import { Slot, Objet } from './src/screens/objet';
import { Fin } from './src/screens/fin';
import { Partage } from './src/screens/partage';
import { Selfie, Position, Notifs } from './src/screens/perms';
import { play } from './src/sound';

const W = Dimensions.get('window').width;

const SCREENS: Record<string, React.ComponentType<{ nav: Nav; p: any }>> = {
  onboarding: Onboarding, pseudo: Pseudo, selfie: Selfie, position: Position, notifs: Notifs, home: Home, profil: Profil, rejoindre: Rejoindre,
  choix: ChoixJeu, paywall: Paywall, distance: Distance, lobby: Lobby, countdown: Countdown,
  reveal: Reveal, manhunt: Manhunt, partage: Partage, geo: Geo, slot: Slot, objet: Objet, fin: Fin,
};

// Web only: ?s=lobby&jeu=manhunt opens a screen directly, used for page-by-page captures.
function initialRoute(): Route {
  const loc = (globalThis as any).location;
  if (!loc?.search) return { name: 'onboarding', p: {} };
  const q = new URLSearchParams(loc.search);
  const name = q.get('s') || 'onboarding';
  const p: any = {};
  q.forEach((v, k) => { if (k !== 's') p[k] = v; });
  return { name: SCREENS[name] ? name : 'onboarding', p };
}

export default function App() {
  const [stack, setStack] = useState<Route[]>(() => [initialRoute()]);
  const [dir, setDir] = useState(1);
  const x = useRef(new Animated.Value(0)).current;
  const cur = stack[stack.length - 1];

  useEffect(() => {
    x.setValue(dir * W * 0.35);
    Animated.timing(x, { toValue: 0, duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [stack]);

  const nav: Nav = {
    go: (name, p = {}) => { play('whoosh'); setDir(1); setStack((s) => [...s, { name, p }]); },
    replace: (name, p = {}) => { setDir(1); setStack((s) => [...s.slice(0, -1), { name, p }]); },
    back: () => { setDir(-1); setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)); },
    reset: (name, p = {}) => { setDir(-1); setStack([{ name, p }]); },
  };

  const Screen = SCREENS[cur.name];
  const opacity = x.interpolate({ inputRange: [-W * 0.35, 0, W * 0.35], outputRange: [0, 1, 0] });
  return (
    <View style={s.root}>
      <StatusBar style="auto" />
      <Animated.View key={stack.length + cur.name} style={[StyleSheet.absoluteFill, { opacity, transform: [{ translateX: x }] }]}>
        <Screen nav={nav} p={cur.p} />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: '#fff' } });
