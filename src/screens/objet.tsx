import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { C, IMG } from '../theme';
import { Appear, Btn, useCountdown } from '../ui';
import { Chrono, Pill } from '../jeuui';
import { play } from '../sound';

const ITEMS = ['bicycle', 'cafe', 'bus', 'trash', 'flower', 'car-sport', 'storefront', 'water'];
const H = 112;
const TOURS = 5;
// Dernière icône = la boîte aux lettres, suivie d'une icône pour remplir la ligne du bas.
const REEL: (string | null)[] = [...[...Array(TOURS)].flatMap(() => ITEMS), null, 'cafe'];
const WIN = REEL.length - 2;

export function Slot({ nav, p }: { nav: Nav; p: any }) {
  const y = useRef(new Animated.Value(0)).current;
  const bump = useRef(new Animated.Value(1)).current;
  const [done, setDone] = useState(false);
  const [on, setOn] = useState(true);
  useEffect(() => {
    play('reel');
    const ticks = setInterval(() => play('tick'), 150);
    const bulbs = setInterval(() => setOn((v) => !v), 260);
    Animated.timing(y, { toValue: -(WIN - 1) * H, duration: 4200, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
      clearInterval(ticks);
      play('tada');
      setDone(true);
      Animated.sequence([
        Animated.timing(bump, { toValue: 1.07, duration: 160, useNativeDriver: true }),
        Animated.spring(bump, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    });
    return () => { clearInterval(ticks); clearInterval(bulbs); };
  }, []);
  const bulbRow = (n: number, vertical?: boolean) => (
    <View style={[o.bulbs, vertical ? { flexDirection: 'column', height: '100%' } : { width: '100%' }]}>
      {[...Array(n)].map((_, i) => <View key={i} style={[o.bulb, (i % 2 === 0) === on && { backgroundColor: '#fff', shadowOpacity: 1 }]} />)}
    </View>
  );
  return (
    <View style={o.root}>
      <Text style={o.h}>Trouve l'objet</Text>
      <Animated.View style={[o.body, { transform: [{ scale: bump }] }]}>
        <View style={o.bulbTop}>{bulbRow(9)}</View>
        <View style={o.frame}>
          <View style={o.window}>
            <Animated.View style={{ transform: [{ translateY: y }] }}>
              {REEL.map((ic, i) => (
                <View key={i} style={o.cell}>
                  {ic === null
                    ? <Image source={IMG.boite} style={{ width: 84, height: 84 }} resizeMode="contain" />
                    : <Ionicons name={ic as any} size={74} color={C.bleu} />}
                </View>
              ))}
            </Animated.View>
            <View pointerEvents="none" style={[o.fade, { top: 0 }]} />
            <View pointerEvents="none" style={[o.fade, { bottom: 0 }]} />
            <View pointerEvents="none" style={o.line} />
          </View>
          <View style={[o.arrow, { left: -26 }]}><Ionicons name="caret-forward" size={40} color={C.rouge} /></View>
          <View style={[o.arrow, { right: -26 }]}><Ionicons name="caret-back" size={40} color={C.rouge} /></View>
        </View>
        <View style={o.bulbTop}>{bulbRow(9)}</View>
      </Animated.View>
      <View style={{ height: 120, justifyContent: 'center' }}>
        {done ? (
          <Appear style={{ alignItems: 'center' }}>
            <Text style={o.obj}>Trouve une boîte aux lettres</Text>
          </Appear>
        ) : <Text style={o.find}>Tirage en cours</Text>}
      </View>
      <View style={{ flex: 1 }} />
      {done ? <Btn label="C'est parti" kind="blanc" icon="flash" onPress={() => nav.replace('objet', p)} style={{ alignSelf: 'stretch' }} /> : <View style={{ height: 58 }} />}
    </View>
  );
}

export function Objet({ nav, p }: { nav: Nav; p: any }) {
  const t = useCountdown(4 * 60 + 12);
  const [etat, setEtat] = useState<'vise' | 'envoi' | 'ok'>('vise');
  const flash = useRef(new Animated.Value(0)).current;
  const shoot = () => {
    play('shutter');
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    setEtat('envoi');
    setTimeout(() => { play('ding'); setEtat('ok'); }, 1300);
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Image source={IMG.rue} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
      <View style={o.top}>
        <Chrono s={t} />
        <View style={o.target}><Image source={IMG.boite} style={{ width: 64, height: 64 }} resizeMode="contain" /></View>
      </View>
      {etat === 'vise' ? (
        <View pointerEvents="none" style={o.viseur}>
          <View style={[o.corner, { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 26 }]} />
          <View style={[o.corner, { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 26 }]} />
          <View style={[o.corner, { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 26 }]} />
          <View style={[o.corner, { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 26 }]} />
        </View>
      ) : null}
      <View style={o.bottomCam}>
        {etat === 'vise' && <Pressable onPress={shoot} style={o.shutter}><View style={o.shutterIn} /></Pressable>}
        {etat === 'envoi' && <Pill style={{ paddingHorizontal: 22, paddingVertical: 16 }}><Text style={o.pillT}>Photo envoyée, validation...</Text></Pill>}
        {etat === 'ok' && (
          <Appear style={{ width: '100%', alignItems: 'center', gap: 14 }}>
            <Pill style={{ paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row' }}>
              <Ionicons name="checkmark-circle" size={28} color={C.bleu} />
              <Text style={[o.pillT, { marginLeft: 8, fontSize: 24 }]}>Validée</Text>
            </Pill>
            <Btn label="Voir le classement" onPress={() => nav.replace('fin', { ...p, issue: 'objet' })} style={{ alignSelf: 'stretch' }} />
          </Appear>
        )}
      </View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', opacity: flash }]} />
    </View>
  );
}

const o = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bleu, paddingTop: 70, paddingHorizontal: 24, paddingBottom: 44, alignItems: 'center' },
  h: { color: '#fff', fontSize: 34, fontWeight: '900', marginBottom: 34 },
  body: { width: 280, borderRadius: 44, backgroundColor: C.nuit, borderWidth: 5, borderColor: '#fff', paddingVertical: 12, alignItems: 'center',
    shadowColor: C.azur, shadowOpacity: 1, shadowRadius: 30, shadowOffset: { width: 0, height: 0 } },
  bulbTop: { width: '86%', paddingVertical: 8 },
  bulbs: { flexDirection: 'row', justifyContent: 'space-between' },
  bulb: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.azur, shadowColor: '#fff', shadowOpacity: 0, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  frame: { width: 210, height: H * 3, borderRadius: 26, backgroundColor: '#fff', borderWidth: 6, borderColor: C.azur, justifyContent: 'center' },
  window: { height: H * 3 - 12, overflow: 'hidden', borderRadius: 20 },
  cell: { height: H, alignItems: 'center', justifyContent: 'center' },
  fade: { position: 'absolute', left: 0, right: 0, height: H, backgroundColor: 'rgba(255,255,255,0.62)' },
  line: { position: 'absolute', left: 0, right: 0, top: H - 6, height: H, borderTopWidth: 3, borderBottomWidth: 3, borderColor: C.rouge },
  arrow: { position: 'absolute', top: H * 1.5 - 20 },
  find: { color: 'rgba(255,255,255,0.9)', fontSize: 24, fontWeight: '800', marginTop: 36 },
  obj: { color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'center', marginTop: 24 },
  top: { position: 'absolute', top: 54, left: 0, right: 0, alignItems: 'center' },
  target: { backgroundColor: 'rgba(20,24,40,0.55)', borderRadius: 30, padding: 12, marginTop: 18, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  viseur: { position: 'absolute', top: '33%', left: '22%', right: '22%', height: '27%' },
  corner: { position: 'absolute', width: 44, height: 44, borderColor: '#fff' },
  bottomCam: { position: 'absolute', left: 20, right: 20, bottom: 44, alignItems: 'center' },
  shutter: { width: 96, height: 96, borderRadius: 48, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.bleu, shadowOpacity: 1, shadowRadius: 20, shadowOffset: { width: 0, height: 0 } },
  shutterIn: { width: 74, height: 74, borderRadius: 37, backgroundColor: C.bleu },
  pillT: { fontWeight: '900', fontSize: 18, color: C.texte },
});
