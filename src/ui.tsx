import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, IMG } from './theme';
import { play } from './sound';

export function Btn({ label, onPress, kind = 'bleu', icon, style }: {
  label: string; onPress: () => void; kind?: 'bleu' | 'rouge' | 'blanc' | 'ghost'; icon?: any; style?: ViewStyle;
}) {
  const s = useRef(new Animated.Value(1)).current;
  const bg = kind === 'bleu' ? C.bleu : kind === 'rouge' ? C.rouge : kind === 'blanc' ? C.blanc : 'transparent';
  const fg = kind === 'blanc' ? C.texte : kind === 'ghost' ? C.bleu : C.blanc;
  return (
    <Pressable
      onPressIn={() => Animated.spring(s, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(s, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
      onPress={() => { play('pop'); onPress(); }}
    >
      <Animated.View style={[st.btn, { backgroundColor: bg, transform: [{ scale: s }] }, kind !== 'ghost' && st.relief, style]}>
        {icon ? <Ionicons name={icon} size={22} color={fg} style={{ marginRight: 8 }} /> : null}
        <Text style={[st.btnTxt, { color: fg }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function Avatar({ src, size = 56, ring = C.blanc }: { src: ImageSourcePropType; size?: number; ring?: string }) {
  return <Image source={src} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: size > 40 ? 4 : 3, borderColor: ring }} />;
}

export function Appear({ children, delay = 0, from = 30, style }: { children: React.ReactNode; delay?: number; from?: number; style?: ViewStyle }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 420, delay, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }).start();
  }, []);
  const ty = v.interpolate({ inputRange: [0, 1], outputRange: [from, 0] });
  return <Animated.View style={[style, { opacity: v, transform: [{ translateY: ty }] }]}>{children}</Animated.View>;
}

export function useCountdown(start: number, running = true) {
  const [t, setT] = useState(start);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);
  return t;
}

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function BigTimer({ s, color = C.texte, size = 88 }: { s: number; color?: string; size?: number }) {
  return <Text style={{ fontSize: size, fontWeight: '900', color, fontVariant: ['tabular-nums'], letterSpacing: -2 }}>{mmss(s)}</Text>;
}

export function Zone({ size = 300, color = C.azur }: { size?: number; color?: string }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(p, { toValue: 1, duration: 2400, easing: Easing.out(Easing.quad), useNativeDriver: true })).start();
  }, []);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      <Animated.View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 3, borderColor: color,
        opacity: p.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }), transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }] }} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(79,179,244,0.22)', borderWidth: 4, borderColor: color }} />
    </View>
  );
}

export function MapBg({ children, zone = 300 }: { children?: React.ReactNode; zone?: number }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={IMG.carte} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" />
      {zone ? <Zone size={zone} /> : null}
      {children}
    </View>
  );
}

export function Me() {
  return (
    <View style={{ width: 0, height: 0, borderLeftWidth: 14, borderRightWidth: 14, borderBottomWidth: 30, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: C.bleu, transform: [{ rotate: '25deg' }] }} />
  );
}

export function Glass({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[st.glass, style]}>{children}</View>;
}

export function Back({ onPress, light }: { onPress: () => void; light?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={16} style={[st.back, light && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
      <Ionicons name="chevron-back" size={24} color={light ? C.blanc : C.texte} />
    </Pressable>
  );
}

export const st = StyleSheet.create({
  btn: { height: 58, borderRadius: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  relief: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  btnTxt: { fontSize: 18, fontWeight: '800' },
  glass: { backgroundColor: C.verre, borderRadius: 28, padding: 18, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  h1: { fontSize: 34, fontWeight: '900', color: C.texte, letterSpacing: -0.5 },
  p: { fontSize: 16, color: C.gris, fontWeight: '500' },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  screen: { flex: 1, paddingTop: 64, paddingHorizontal: 20, paddingBottom: 40 },
});

// ---- Ajouts agent A : style des maquettes (pilule relief brillante, verre, fond carte floue) ----
const web = Platform.OS === 'web';
const grad = (a: string, b: string) => (web ? ({ backgroundImage: `linear-gradient(180deg, ${a} 0%, ${b} 100%)` } as any) : { backgroundColor: b });

export function Fond({ veil = 0.18, children }: { veil?: number; children?: React.ReactNode }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={require('../assets/img/fond-flou.jpg')} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(255,255,255,${veil})` }]} />
      {children}
    </View>
  );
}

export function Verre({ children, style, radius = 28 }: { children?: React.ReactNode; style?: ViewStyle; radius?: number }) {
  return (
    <View style={[vr.verre, { borderRadius: radius }, web && ({ backdropFilter: 'blur(18px)' } as any), style]}>
      <View pointerEvents="none" style={[vr.verreHi, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]} />
      {children}
    </View>
  );
}

export function Pill({ label, onPress, kind = 'bleu', icon, style, h = 58 }: {
  label: string; onPress: () => void; kind?: 'bleu' | 'verre'; icon?: any; style?: ViewStyle; h?: number;
}) {
  const s = useRef(new Animated.Value(1)).current;
  const bleu = kind === 'bleu';
  return (
    <Pressable
      onPressIn={() => Animated.spring(s, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(s, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
      onPress={() => { play('pop'); onPress(); }}
    >
      <Animated.View style={[bleu ? vr.glow : vr.glowVerre, { height: h, borderRadius: h / 2, transform: [{ scale: s }] }, style]}>
        <View style={[vr.pill, { borderRadius: h / 2 }, bleu ? { ...grad('#2F95FF', '#0452F2'), borderColor: '#0B3FD6' } : { ...grad('#FFFFFF', '#E9F0FB'), borderColor: 'rgba(255,255,255,0.95)' }]}>
          <View pointerEvents="none" style={[vr.gloss, { borderRadius: h / 2 }, web ? ({ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,${bleu ? 0.5 : 0.9}) 0%, rgba(255,255,255,0) 100%)` } as any) : { backgroundColor: bleu ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)' }]} />
          <View pointerEvents="none" style={[vr.shade, bleu ? { backgroundColor: 'rgba(0,30,190,0.22)' } : { backgroundColor: 'rgba(120,150,210,0.10)' }]} />
          {icon ? <Ionicons name={icon} size={22} color={bleu ? '#fff' : C.texte} style={{ marginRight: 8 }} /> : null}
          <Text style={[vr.pillTxt, { color: bleu ? '#fff' : C.texte }, bleu && vr.pillTxtRelief]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function LienSouligne({ label, onPress, color = C.bleu }: { label: string; onPress: () => void; color?: string }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={{ alignSelf: 'center' }}>
      <Text style={{ color, fontSize: 17, fontWeight: '800', textDecorationLine: 'underline', paddingVertical: 8 }}>{label}</Text>
    </Pressable>
  );
}

export function Dots({ n, i }: { n: number; i: number }) {
  return (
    <View style={vr.dots}>
      {Array.from({ length: n }).map((_, k) => (
        <View key={k} style={[vr.dot, k === i && vr.dotOn]} />
      ))}
    </View>
  );
}

const vr = StyleSheet.create({
  verre: { backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.95)', shadowColor: '#2B5FA8', shadowOpacity: 0.22, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, overflow: 'hidden' },
  verreHi: { position: 'absolute', top: 0, left: 0, right: 0, height: 22, backgroundColor: 'rgba(255,255,255,0.55)' },
  glow: { shadowColor: '#086EF7', shadowOpacity: 0.55, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  glowVerre: { shadowColor: '#2B5FA8', shadowOpacity: 0.22, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1.5, paddingHorizontal: 24 },
  gloss: { position: 'absolute', top: 2, left: 8, right: 8, height: '52%' },
  shade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%' },
  pillTxt: { fontSize: 22, fontWeight: '900', letterSpacing: -0.3 },
  pillTxtRelief: { textShadowColor: 'rgba(0,20,120,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  dots: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)', shadowColor: '#2B5FA8', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#C3CCDD' },
  dotOn: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.bleu },
});

export function MoiPin({ size = 64, halo = 130 }: { size?: number; halo?: number }) {
  return (
    <View style={{ width: halo, height: halo, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: halo, height: halo, borderRadius: halo / 2, backgroundColor: 'rgba(120,190,255,0.28)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)' }} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#EAF4FF', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: C.bleu, shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } }}>
        <Ionicons name="navigate" size={size * 0.52} color={C.bleu} style={{ marginRight: 2, marginTop: 2 }} />
      </View>
    </View>
  );
}
