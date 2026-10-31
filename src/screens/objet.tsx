import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { C, IMG } from '../theme';
import { Appear, BigTimer, Btn, useCountdown } from '../ui';
import { play } from '../sound';

const ITEMS = [
  { ic: 'bicycle', t: 'un vélo' }, { ic: 'cafe', t: 'une terrasse' }, { ic: 'bus', t: 'un arrêt de bus' },
  { ic: 'trash', t: 'une poubelle verte' }, { ic: 'flower', t: 'une fleur' }, { ic: 'car-sport', t: 'une voiture rouge' },
  { ic: 'storefront', t: 'une boulangerie' }, { ic: 'water', t: 'une fontaine' },
];
const H = 150;
const TOURS = 5;
const REEL = [...Array(TOURS)].flatMap(() => ITEMS).concat([{ ic: 'mail', t: 'une boîte aux lettres' }]);

export function Slot({ nav, p }: { nav: Nav; p: any }) {
  const y = useRef(new Animated.Value(0)).current;
  const [done, setDone] = useState(false);
  useEffect(() => {
    play('reel');
    const ticks = setInterval(() => play('tick'), 140);
    Animated.timing(y, { toValue: -(REEL.length - 1) * H, duration: 3200, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
      clearInterval(ticks);
      play('tada');
      setDone(true);
    });
    return () => clearInterval(ticks);
  }, []);
  return (
    <View style={o.root}>
      <Text style={o.h}>Trouve l'objet</Text>
      <View style={o.machine}>
        <View style={o.window}>
          <Animated.View style={{ transform: [{ translateY: y }] }}>
            {REEL.map((it, i) => (
              <View key={i} style={o.cell}>
                {i === REEL.length - 1
                  ? <Image source={IMG.boite} style={{ width: 120, height: 120 }} resizeMode="contain" />
                  : <Ionicons name={it.ic as any} size={96} color={C.bleu} />}
              </View>
            ))}
          </Animated.View>
        </View>
        <View style={[o.arrow, { left: -6 }]}><Ionicons name="caret-forward" size={36} color={C.rouge} /></View>
        <View style={[o.arrow, { right: -6 }]}><Ionicons name="caret-back" size={36} color={C.rouge} /></View>
      </View>
      {done ? (
        <Appear style={{ alignItems: 'center' }}>
          <Text style={o.find}>Trouve</Text>
          <Text style={o.obj}>une boîte aux lettres</Text>
        </Appear>
      ) : <Text style={o.find}>Tirage…</Text>}
      <View style={{ flex: 1 }} />
      {done ? <Btn label="Go, 5 minutes" kind="blanc" icon="flash" onPress={() => nav.replace('objet', p)} /> : null}
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
        <View style={o.target}><Image source={IMG.boite} style={{ width: 54, height: 54 }} resizeMode="contain" /></View>
        <BigTimer s={t} color="#fff" size={72} />
      </View>
      <View pointerEvents="none" style={o.frame} />
      <View style={o.bottomCam}>
        {etat === 'vise' && (
          <Pressable onPress={shoot} style={o.shutter}><View style={o.shutterIn} /></Pressable>
        )}
        {etat === 'envoi' && <View style={o.pill}><Text style={o.pillT}>Photo envoyée, validation…</Text></View>}
        {etat === 'ok' && (
          <Appear style={{ width: '100%' }}>
            <View style={[o.pill, { backgroundColor: '#0A9F6E', marginBottom: 12 }]}><Ionicons name="checkmark-circle" size={22} color="#fff" /><Text style={o.pillT}>Validée, tu gagnes la manche</Text></View>
            <Btn label="Voir le classement" kind="blanc" onPress={() => nav.replace('fin', { ...p, issue: 'objet' })} />
          </Appear>
        )}
      </View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', opacity: flash }]} />
    </View>
  );
}

const o = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.nuit, paddingTop: 80, paddingHorizontal: 24, paddingBottom: 44, alignItems: 'center' },
  h: { color: '#fff', fontSize: 30, fontWeight: '900', marginBottom: 30 },
  machine: { width: 230, height: H, borderRadius: 36, backgroundColor: '#fff', borderWidth: 6, borderColor: C.azur, justifyContent: 'center' },
  window: { height: H - 12, overflow: 'hidden', borderRadius: 30 },
  cell: { height: H, alignItems: 'center', justifyContent: 'center', marginTop: -6 },
  arrow: { position: 'absolute', top: H / 2 - 24 },
  find: { color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: '800', marginTop: 36 },
  obj: { color: '#fff', fontSize: 38, fontWeight: '900', textAlign: 'center' },
  top: { position: 'absolute', top: 56, left: 20, right: 20, alignItems: 'center' },
  target: { backgroundColor: '#fff', borderRadius: 24, padding: 10, marginBottom: 4 },
  frame: { position: 'absolute', top: '34%', left: '14%', right: '14%', height: '30%', borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 28 },
  bottomCam: { position: 'absolute', left: 20, right: 20, bottom: 44, alignItems: 'center' },
  shutter: { width: 86, height: 86, borderRadius: 43, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterIn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#fff' },
  pill: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  pillT: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
