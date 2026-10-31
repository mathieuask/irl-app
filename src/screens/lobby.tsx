import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, AvKey, C, IMG, JOUEURS } from '../theme';
import { Appear, Avatar, Back, MoiPin, Pill, Verre } from '../ui';
import { play } from '../sound';
import { fmtM, MapClean, ZoneCercle } from './create';

const { width: W, height: H } = Dimensions.get('window');
const NOM_JEU: Record<string, string> = { manhunt: 'Manhunt', geo: 'GeoGuessr', objet: "Trouve l'objet" };
const MAX = 6;

let partie = 0;

const CIBLES = [
  { ic: 'chatbubble-ellipses', t: 'Messages' },
  { ic: 'logo-whatsapp', t: 'WhatsApp' },
  { ic: 'link', t: 'Copier le lien' },
  { ic: 'qr-code', t: 'AirDrop' },
];

export function Lobby({ nav, p }: { nav: Nav; p: any }) {
  const [n, setN] = useState(0); // joueurs arrivés en plus de Toi
  const [partage, setPartage] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => {
    const id = setInterval(() => setN((x) => {
      if (x < JOUEURS.length) play('pop');
      return Math.min(x + 1, JOUEURS.length);
    }), 900);
    return () => clearInterval(id);
  }, []);
  const total = n + 1;
  const pret = total >= 3;
  const lancer = () => {
    if (!pret) return;
    partie += 1;
    const role = p.role || (p.jeu === 'manhunt' ? (partie % 2 === 1 ? 'chasseur' : 'fuyard') : 'joueur');
    nav.replace('countdown', { ...p, role });
  };
  const envoyer = (t: string) => {
    setPartage(false);
    setToast(t === 'Copier le lien' ? 'Lien copié' : `Envoyé via ${t}`);
    play('ding');
    setTimeout(() => setToast(''), 1800);
  };
  return (
    <View style={{ flex: 1 }}>
      <MapClean blur veil={0.25} />
      <View style={l.entete}>
        <Back onPress={nav.back} />
        <Verre radius={26} style={l.chipTitre}><Text style={l.chipT}>Salle d'attente</Text></Verre>
        <View style={{ width: 44 }} />
      </View>
      <View style={l.bas}>
        <Verre radius={32} style={{ padding: 18 }}>
          <Text style={l.codeL}>Code de la partie</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={l.code}>K7Q2</Text>
            <View style={l.qr}><Ionicons name="qr-code" size={74} color={C.texte} /></View>
          </View>
          <Pressable onPress={() => setPartage(true)} style={({ pressed }) => [l.partager, pressed && { opacity: 0.7 }]}>
            <Ionicons name="share-outline" size={26} color={C.bleu} />
            <Text style={l.partagerT}>Partager le lien</Text>
          </Pressable>
        </Verre>
        <Verre radius={32} style={{ padding: 18, marginTop: 14 }}>
          <View style={l.jTete}>
            <Text style={l.jT}>Joueurs</Text>
            <Text style={l.jJeu}>{NOM_JEU[p.jeu] || 'Manhunt'} · {fmtM(Number(p.rayon) || 500)}</Text>
          </View>
          <View style={l.rang}>
            <Slot src={AV.moi} nom="Toi" hote />
            {Array.from({ length: MAX - 1 }).map((_, i) => {
              const j = JOUEURS[i];
              return i < n ? <Slot key={j.id} src={AV[j.id as AvKey]} nom={j.nom} /> : <Slot key={'v' + i} />;
            })}
          </View>
        </Verre>
        <View style={{ height: 14 }} />
        {p.invite ? <Text style={l.attente}>En attente du créateur</Text> : null}
        <View style={{ opacity: pret ? 1 : 0.55 }}>
          <Pill label={p.invite ? `Prêt (${total}/${MAX})` : `Lancer la partie (${total}/${MAX})`} onPress={lancer} h={64} />
        </View>
      </View>
      {toast ? <Appear from={-10} style={l.toast}><Text style={l.toastT}>{toast}</Text></Appear> : null}
      {partage ? <FeuillePartage onChoix={envoyer} onFermer={() => setPartage(false)} /> : null}
    </View>
  );
}

function Slot({ src, nom, hote }: { src?: any; nom?: string; hote?: boolean }) {
  if (!src) {
    return (
      <View style={l.slot}>
        <View style={l.vide} />
        <Text style={l.att}>En attente</Text>
      </View>
    );
  }
  return (
    <Appear from={16} style={l.slot}>
      <Avatar src={src} size={48} ring="#fff" />
      {hote ? <View style={l.hote}><Text style={l.hoteT}>Hôte</Text></View> : null}
      <Text style={l.nom}>{nom}</Text>
    </Appear>
  );
}

// Feuille de partage simulée façon iOS.
function FeuillePartage({ onChoix, onFermer }: { onChoix: (t: string) => void; onFermer: () => void }) {
  const y = useRef(new Animated.Value(380)).current;
  useEffect(() => {
    Animated.timing(y, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);
  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', backgroundColor: 'rgba(3,6,28,0.4)' }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onFermer} />
      <Animated.View style={[l.feuille, { transform: [{ translateY: y }] }]}>
        <View style={l.grab} />
        <View style={l.fHead}>
          <Image source={IMG.logo} style={l.fLogo} />
          <View style={{ flex: 1 }}>
            <Text style={l.fT}>Rejoins ma partie irl</Text>
            <Text style={l.fS}>Code K7Q2</Text>
          </View>
        </View>
        <View style={l.cibles}>
          {CIBLES.map((x) => (
            <Pressable key={x.t} onPress={() => onChoix(x.t)} style={l.cible}>
              <View style={l.cibleIc}><Ionicons name={x.ic as any} size={28} color={C.bleu} /></View>
              <Text style={l.cibleT}>{x.t}</Text>
            </Pressable>
          ))}
        </View>
        <Pill label="Annuler" kind="verre" onPress={onFermer} h={54} />
      </Animated.View>
    </View>
  );
}

const BULLES: { id: AvKey; nom: string; x: number; y: number }[] = [
  { id: 'lea', nom: 'Léa', x: 0.74, y: 0.27 },
  { id: 'hugo', nom: 'Hugo', x: 0.2, y: 0.3 },
  { id: 'ines', nom: 'Inès', x: 0.14, y: 0.55 },
  { id: 'sam', nom: 'Sam', x: 0.8, y: 0.55 },
  { id: 'theo', nom: 'Théo', x: 0.62, y: 0.78 },
];

export function Countdown({ nav, p }: { nav: Nav; p: any }) {
  const [n, setN] = useState(3);
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    s.setValue(0);
    play(n > 0 ? 'tick' : 'go');
    Animated.timing(s, { toValue: 1, duration: 700, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }).start();
    const t = setTimeout(() => {
      if (n > 0) setN(n - 1);
      else nav.replace(p.jeu === 'manhunt' ? 'reveal' : p.jeu === 'objet' ? 'slot' : 'geo', p);
    }, 950);
    return () => clearTimeout(t);
  }, [n]);
  const scale = s.interpolate({ inputRange: [0, 1], outputRange: [1.7, 1] });
  const consigne = p.role === 'fuyard' ? 'Cache-toi dans la zone' : p.jeu === 'manhunt' ? 'Prépare-toi à chasser' : 'Prépare-toi';
  return (
    <View style={{ flex: 1 }}>
      <MapClean />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />
      <View style={[StyleSheet.absoluteFill, l.centre]}>
        <ZoneCercle size={W - 20} />
      </View>
      {BULLES.map((b) => (
        <View key={b.id} style={[l.bulle, { left: b.x * W - 36, top: b.y * H - 36 }]}>
          <Avatar src={AV[b.id]} size={64} ring="#fff" />
          <View style={l.bulleNom}><Text style={l.bulleNomT}>{b.nom}</Text></View>
        </View>
      ))}
      <View style={{ position: 'absolute', left: W / 2 - 29, top: 0.62 * H - 29 }}><MoiPin size={58} halo={0} /></View>
      <Pressable onPress={() => nav.reset('home')} style={l.fermer}><Ionicons name="close" size={26} color={C.texte} /></Pressable>
      <View style={l.hautC}>
        <Image source={IMG.logo} style={l.logoC} />
        <Verre radius={24} style={l.chipInfo}><Text style={l.chipInfoT}>{NOM_JEU[p.jeu] || 'Manhunt'} · 6 joueurs</Text></Verre>
      </View>
      <View style={[StyleSheet.absoluteFill, l.centre, { paddingBottom: 60 }]} pointerEvents="none">
        <Animated.Text style={[l.cd, n === 0 && { fontSize: 150 }, { opacity: s, transform: [{ scale }] }]}>{n > 0 ? n : 'GO'}</Animated.Text>
        <Verre radius={24} style={l.consigne}><Text style={l.consigneT}>{consigne}</Text></Verre>
      </View>
      <Verre radius={30} style={l.zoneCarte}>
        <View style={l.zoneIc}><Ionicons name="locate" size={30} color={C.bleu} /></View>
        <View>
          <Text style={l.zoneL}>Zone de jeu</Text>
          <Text style={l.zoneV}>{fmtM(Number(p.rayon) || 500)} autour de toi</Text>
        </View>
      </Verre>
    </View>
  );
}

export function Reveal({ nav, p }: { nav: Nav; p: any }) {
  const fuyard = p.role === 'fuyard';
  const s = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    play('impact');
    Animated.spring(s, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
    Animated.loop(Animated.timing(halo, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true })).start();
  }, []);
  const bg = fuyard ? C.rouge : C.nuit;
  const chasseurs: AvKey[] = fuyard ? ['hugo', 'lea', 'sam'] : ['lea', 'sam'];
  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingHorizontal: 24, paddingTop: 70, paddingBottom: 44, alignItems: 'center' }}>
      <View style={l.rvChip}><Text style={l.rvChipT}>{NOM_JEU[p.jeu] || 'Manhunt'}</Text></View>
      <View style={{ height: 170, width: 170, marginTop: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[l.rvHalo, { opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }), transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }] }]} />
        <Animated.View style={[l.rvIc, { transform: [{ scale: s }] }]}>
          <Ionicons name={fuyard ? 'footsteps' : 'locate'} size={78} color={bg} />
        </Animated.View>
      </View>
      <Animated.View style={{ alignItems: 'center', marginTop: 26, opacity: s, transform: [{ scale: s.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
        <Text style={l.rvSmall}>Tu es</Text>
        <Text style={l.rvBig}>{fuyard ? 'chassé' : 'chasseur'}</Text>
      </Animated.View>
      <Appear delay={350} style={{ marginTop: 26, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          {chasseurs.map((k, i) => (
            <View key={k} style={{ marginLeft: i ? -14 : 0 }}>
              <Avatar src={AV[k]} size={64} ring="#fff" />
            </View>
          ))}
          {!fuyard ? <View style={{ marginLeft: 14 }}><Avatar src={AV.hugo} size={64} ring={C.rouge} /></View> : null}
        </View>
        <Text style={l.rvTxt}>
          {fuyard ? "Hugo, Léa et Sam te cherchent. Tu as 3 minutes d'avance, ta position est révélée toutes les 3 minutes." : 'Avec Léa et Sam, trouve Hugo avant la fin du chrono.'}
        </Text>
      </Appear>
      <View style={{ flex: 1 }} />
      <View style={{ alignSelf: 'stretch' }}><Pill label="Continuer" kind="verre" onPress={() => nav.replace('manhunt', p)} h={64} /></View>
    </View>
  );
}

const l = StyleSheet.create({
  entete: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chipTitre: { paddingHorizontal: 24, paddingVertical: 12 },
  chipT: { fontSize: 24, fontWeight: '900', color: C.texte, letterSpacing: -0.5 },
  bas: { position: 'absolute', left: 18, right: 18, bottom: 34 },
  codeL: { fontSize: 20, fontWeight: '800', color: C.texte },
  code: { fontSize: 78, fontWeight: '900', color: C.texte, letterSpacing: -1 },
  qr: { width: 96, height: 96, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  partager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.8)', marginTop: 10 },
  partagerT: { fontSize: 20, fontWeight: '800', color: C.bleu },
  jTete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  jT: { fontSize: 22, fontWeight: '900', color: C.texte },
  jJeu: { fontSize: 14, fontWeight: '700', color: C.gris },
  rang: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, minHeight: 92 },
  slot: { width: 50, alignItems: 'center' },
  vide: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: C.bleu, backgroundColor: 'rgba(255,255,255,0.5)' },
  att: { fontSize: 11, fontWeight: '700', color: C.bleu, marginTop: 6, textAlign: 'center' },
  nom: { fontSize: 13, fontWeight: '800', color: C.texte, marginTop: 4 },
  hote: { position: 'absolute', top: 38, backgroundColor: C.bleu, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 1 },
  hoteT: { color: '#fff', fontSize: 11, fontWeight: '900' },
  attente: { textAlign: 'center', color: C.gris, fontWeight: '700', marginBottom: 8 },
  toast: { position: 'absolute', top: 120, alignSelf: 'center', backgroundColor: C.texte, borderRadius: 22, paddingHorizontal: 20, paddingVertical: 12 },
  toastT: { color: '#fff', fontWeight: '800', fontSize: 16 },
  feuille: { backgroundColor: '#F4F7FC', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 36 },
  grab: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#C9D2E0', marginBottom: 14 },
  fHead: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  fLogo: { width: 52, height: 52, borderRadius: 13 },
  fT: { fontSize: 19, fontWeight: '900', color: C.texte },
  fS: { fontSize: 14, color: C.gris, fontWeight: '600', marginTop: 2 },
  cibles: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  cible: { alignItems: 'center', width: 78 },
  cibleIc: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#2B5FA8', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  cibleT: { fontSize: 12, fontWeight: '700', color: C.texte, marginTop: 8, textAlign: 'center' },
  centre: { alignItems: 'center', justifyContent: 'center' },
  bulle: { position: 'absolute', width: 72, alignItems: 'center' },
  bulleNom: { marginTop: -10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  bulleNomT: { fontSize: 13, fontWeight: '900', color: C.texte },
  fermer: { position: 'absolute', top: 60, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  hautC: { position: 'absolute', top: 54, left: 0, right: 0, alignItems: 'center' },
  logoC: { width: 64, height: 64, borderRadius: 16, borderWidth: 3, borderColor: '#fff' },
  chipInfo: { paddingHorizontal: 22, paddingVertical: 10, marginTop: 10 },
  chipInfoT: { fontSize: 22, fontWeight: '900', color: C.texte, letterSpacing: -0.4 },
  cd: { fontSize: 250, fontWeight: '900', color: '#fff', textShadowColor: C.bleu, textShadowRadius: 26, textShadowOffset: { width: 0, height: 6 }, lineHeight: 270 },
  consigne: { paddingHorizontal: 22, paddingVertical: 12, marginTop: 4 },
  consigneT: { fontSize: 22, fontWeight: '900', color: C.texte, textAlign: 'center' },
  zoneCarte: { position: 'absolute', left: 24, right: 24, bottom: 40, flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  zoneIc: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E4F0FF', alignItems: 'center', justifyContent: 'center' },
  zoneL: { fontSize: 15, fontWeight: '700', color: C.gris },
  zoneV: { fontSize: 24, fontWeight: '900', color: C.bleu, letterSpacing: -0.4 },
  rvChip: { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  rvChipT: { color: '#fff', fontSize: 18, fontWeight: '900' },
  rvHalo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: '#fff' },
  rvIc: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
  rvSmall: { color: 'rgba(255,255,255,0.9)', fontSize: 30, fontWeight: '800' },
  rvBig: { color: '#fff', fontSize: 76, fontWeight: '900', letterSpacing: -2, lineHeight: 84 },
  rvTxt: { color: '#fff', fontSize: 19, fontWeight: '700', textAlign: 'center', lineHeight: 26, marginTop: 18, paddingHorizontal: 6 },
});
