import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
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
