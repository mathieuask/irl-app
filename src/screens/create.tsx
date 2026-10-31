import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { C, IMG } from '../theme';
import { Appear, Back, Fond, MoiPin, Pill, Verre } from '../ui';
import { play } from '../sound';

const { width: W, height: H } = Dimensions.get('window');

// État de session partagé : une fois l'achat simulé, plus aucun cadenas ni paywall.
export const session = { premium: false };

// Carte nette (sans le cercle cuit dans carte.jpg) : on zoome dans l'intérieur du cercle d'origine.
export function MapClean({ blur = false, veil = 0 }: { blur?: boolean; veil?: number }) {
  const w = W * 2.4;
  const k = w / 853;
  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', backgroundColor: '#DCE9F2' }]}>
      <Image source={IMG.carte} style={[{ position: 'absolute', width: w, height: w * (1794 / 853), left: -230 * k, top: -340 * k }, blur && ({ filter: 'blur(5px)' } as any)]} />
      {veil ? <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(255,255,255,${veil})` }]} /> : null}
    </View>
  );
}

// Diamètre du cercle à l'écran pour un rayon en mètres (la carte dézoome quand la zone grandit).
export const zoneSize = (m: number) => 110 + 270 * Math.sqrt(Math.max(0, m - 200) / 1800);
export const fmtM = (m: number) => (m >= 1000 ? `${String(m / 1000).replace('.', ',')} km` : `${m} m`);

export function ZoneCercle({ size, style }: { size: number; style?: any }) {
  const v = useRef(new Animated.Value(size)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: size, friction: 8, tension: 70, useNativeDriver: false }).start();
  }, [size]);
  return (
    <Animated.View pointerEvents="none" style={[{
      width: v, height: v, borderRadius: Animated.divide(v, 2) as any, backgroundColor: 'rgba(79,179,244,0.3)',
      borderWidth: 4, borderColor: '#fff', boxShadow: '0 0 28px 8px rgba(40,150,255,0.85)',
    }, style]} />
  );
}

type JeuCard = { id: 'manhunt' | 'geo' | 'objet'; nom: string; sous: string; icone: any; img: any; free: boolean };

const CARDS: JeuCard[] = [
  { id: 'manhunt', nom: 'Manhunt', sous: 'Un fuyard, des chasseurs', icone: 'walk', img: IMG.rue, free: true },
  { id: 'geo', nom: 'GeoGuessr', sous: 'Retrouve le lieu de la photo', icone: 'image', img: IMG.lieu, free: false },
  { id: 'objet', nom: "Trouve l'objet", sous: 'Le premier qui le photographie', icone: 'search', img: IMG.rue, free: false },
];

export function ChoixJeu({ nav }: { nav: Nav; p: any }) {
  const [pw, setPw] = useState<JeuCard | null>(null);
  const [, maj] = useState(0);
  const choisir = (j: JeuCard) => {
    if (j.free || session.premium) nav.go('distance', { jeu: j.id });
    else setPw(j);
  };
  const [manhunt, geo, objet] = CARDS;
  return (
    <View style={{ flex: 1 }}>
      <Fond veil={0.1} />
      <View style={c.top}>
        <Back onPress={nav.back} />
        <Text style={c.titre}>Choisis ton jeu</Text>
      </View>
      <View style={c.liste}>
        <Appear style={{ flex: 1.2 }}>
          <CarteJeu j={manhunt} grand onPress={() => choisir(manhunt)} />
        </Appear>
        <View style={c.rang}>
          {[geo, objet].map((j, i) => (
            <Appear key={j.id} delay={(i + 1) * 110} style={{ flex: 1 }}>
              <CarteJeu j={j} onPress={() => choisir(j)} />
            </Appear>
          ))}
        </View>
      </View>
      {pw ? (
        <PaywallFeuille
          onFermer={() => setPw(null)}
          onSuite={() => { const jeu = pw.id; setPw(null); maj((x) => x + 1); nav.go('distance', { jeu }); }}
        />
      ) : null}
    </View>
  );
}

// Rogne rue.jpg (853 x 1794) sur une zone propre, sans les retouches grises de l'image d'origine.
function Recadre({ source, x, y, srcW, pw }: { source: any; x: number; y: number; srcW: number; pw: number }) {
  const k = pw / srcW;
  return <Image source={source} style={{ position: 'absolute', width: 853 * k, height: 1794 * k, left: -x * k, top: -y * k }} />;
}

function CarteJeu({ j, grand, onPress }: { j: JeuCard; grand?: boolean; onPress: () => void }) {
  const lock = !j.free && !session.premium;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [c.card, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
      <View style={c.photo}>
        {j.id === 'geo'
          ? <Image source={j.img} resizeMode="cover" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} />
          : <Recadre source={j.img} x={270} y={j.id === 'objet' ? 760 : 765} srcW={j.id === 'objet' ? 295 : 583} pw={grand ? W - 44 : (W - 50) / 2 - 8} />}
        {lock ? <View style={c.lock}><Ionicons name="lock-closed" size={18} color={C.bleu} /></View> : null}
        {j.free ? <View style={c.gratuit}><Text style={c.gratuitT}>Gratuit</Text></View> : null}
      </View>
      {grand ? (
        <Verre radius={26} style={c.label}>
          <View style={c.ic}><Ionicons name={j.icone} size={26} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={c.nom}>{j.nom}</Text>
            <Text style={c.sous}>{j.sous}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={C.bleu} />
        </Verre>
      ) : (
        <Verre radius={22} style={c.labelP}>
          <Text style={c.nomP} numberOfLines={1} adjustsFontSizeToFit>{j.nom}</Text>
          <Text style={c.sousP} numberOfLines={2}>{j.sous}</Text>
        </Verre>
      )}
    </Pressable>
  );
}

const FEATURES = [
  { ic: 'game-controller', t: "GeoGuessr et Trouve l'objet" },
  { ic: 'people', t: "12 joueurs, zone plus grande" },
  { ic: 'time', t: 'Le replay de tes parties' },
];

type Etat = 'idle' | 'feuille' | 'attente' | 'fait';

function usePaywall(onSuite: () => void) {
  const [sel, setSel] = useState<'sem' | 'an'>('an');
  const [etat, setEtat] = useState<Etat>('idle');
  const payer = () => {
    setEtat('attente');
    setTimeout(() => { session.premium = true; play('ding'); setEtat('fait'); }, 1500);
  };
  return { sel, setSel, etat, setEtat, payer, an: sel === 'an', onSuite };
}

type PW = ReturnType<typeof usePaywall>;

function PaywallContenu({ pw, onFermer, style }: { pw: PW; onFermer: () => void; style: any }) {
  const { an, setSel, setEtat } = pw;
  return (
    <View style={style}>
      <Pressable onPress={onFermer} hitSlop={12} style={c.fermer}><Ionicons name="close" size={22} color={C.texte} /></Pressable>
      <Appear from={14} style={{ alignItems: 'center' }}>
        <Image source={IMG.logo} style={c.logo} />
        <Text style={c.pwT}>Tous les jeux</Text>
      </Appear>
      <View style={{ marginTop: 6 }}>
        {FEATURES.map((f) => (
          <View key={f.t} style={c.li}>
            <View style={c.liIc}><Ionicons name={f.ic as any} size={22} color={C.bleu} /></View>
            <Text style={c.liT}>{f.t}</Text>
          </View>
        ))}
      </View>
      <View style={c.offres}>
        <Offre on={!an} t="Semaine" prix="3,99 €" onPress={() => setSel('sem')} />
        <Offre on={an} t="Année" prix="29,99 €" sous="2,50 € par mois" badge="Le plus choisi" onPress={() => setSel('an')} />
      </View>
      <View style={{ flex: 1, minHeight: 14 }} />
      <Pill label={an ? 'Essayer gratuitement' : "S'abonner"} onPress={() => setEtat('feuille')} />
      <Text style={c.small}>{an ? 'Aucun paiement maintenant' : 'Annulable à tout moment'}</Text>
    </View>
  );
}

function PaiementPw({ pw }: { pw: PW }) {
  return pw.etat !== 'idle'
    ? <FeuillePaiement etat={pw.etat} an={pw.an} onPayer={pw.payer} onFermer={() => pw.setEtat('idle')} onSuite={pw.onSuite} />
    : null;
}

// Feuille qui monte depuis le bas de « Choisir un jeu » : prix, puis paiement simulé qui déverrouille.
function PaywallFeuille({ onFermer, onSuite }: { onFermer: () => void; onSuite: () => void }) {
  const pw = usePaywall(onSuite);
  const y = useRef(new Animated.Value(640)).current;
  useEffect(() => {
    Animated.timing(y, { toValue: 0, duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);
  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', backgroundColor: 'rgba(3,6,28,0.45)' }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onFermer} />
      <Animated.View style={{ transform: [{ translateY: y }] }}>
        <PaywallContenu pw={pw} onFermer={onFermer} style={c.feuillePw} />
      </Animated.View>
      <PaiementPw pw={pw} />
    </View>
  );
}

export function Paywall({ nav, p }: { nav: Nav; p: any }) {
  const pw = usePaywall(() => nav.replace('distance', p));
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: 270 }}>
        <MapClean />
        <View style={[StyleSheet.absoluteFill, c.centre, { paddingBottom: 30 }]}>
          <ZoneCercle size={190} />
          <View style={{ position: 'absolute' }}><MoiPin size={52} halo={0} /></View>
        </View>
      </View>
      <PaywallContenu pw={pw} onFermer={nav.back} style={c.sheet} />
      <PaiementPw pw={pw} />
    </View>
  );
}

function Offre({ on, t, prix, sous, badge, onPress }: { on: boolean; t: string; prix: string; sous?: string; badge?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View style={[c.offre, on && c.offreOn]}>
        {badge ? <View style={c.badge}><Text style={c.badgeT}>{badge}</Text></View> : null}
        <Text style={c.offreT}>{t}</Text>
        <Text style={c.prix}>{prix}</Text>
        <Text style={c.offreS}>{sous || ' '}</Text>
      </View>
    </Pressable>
  );
}

// Feuille de paiement simulée façon App Store : confirmer, attente, « Fait ».
function FeuillePaiement({ etat, an, onPayer, onFermer, onSuite }: { etat: Etat; an: boolean; onPayer: () => void; onFermer: () => void; onSuite: () => void }) {
  const y = useRef(new Animated.Value(420)).current;
  useEffect(() => {
    Animated.timing(y, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);
  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', backgroundColor: 'rgba(3,6,28,0.45)' }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={etat === 'feuille' ? onFermer : undefined} />
      <Animated.View style={[c.pay, { transform: [{ translateY: y }] }]}>
        <View style={c.grab} />
        {etat === 'fait' ? (
          <Appear from={10} style={{ alignItems: 'center', paddingVertical: 14 }}>
            <View style={c.check}><Ionicons name="checkmark" size={54} color="#fff" /></View>
            <Text style={c.payFait}>Fait</Text>
            <Text style={c.payS}>Tous les jeux sont débloqués.</Text>
            <Pill label="Continuer" onPress={onSuite} style={{ alignSelf: 'stretch', marginTop: 22 }} />
          </Appear>
        ) : (
          <>
            <View style={c.payHead}>
              <Image source={IMG.logo} style={c.payLogo} />
              <View style={{ flex: 1 }}>
                <Text style={c.payT}>irl+ · {an ? 'Année' : 'Semaine'}</Text>
                <Text style={c.payS}>Abonnement, renouvelé automatiquement</Text>
              </View>
            </View>
            <View style={c.payLigne}><Text style={c.payK}>Compte</Text><Text style={c.payV}>Mathieu</Text></View>
            <View style={c.payLigne}><Text style={c.payK}>{an ? 'Aujourd\'hui' : 'Prix'}</Text><Text style={c.payV}>{an ? '0,00 € (3 jours gratuits)' : '3,99 € par semaine'}</Text></View>
            {an ? <View style={c.payLigne}><Text style={c.payK}>Ensuite</Text><Text style={c.payV}>29,99 € par an</Text></View> : null}
            {etat === 'attente' ? (
              <View style={c.attente}><ActivityIndicator color={C.bleu} /><Text style={c.attenteT}>Paiement en cours</Text></View>
            ) : (
              <Pill label={an ? 'Confirmer' : 'Payer 3,99 €'} icon="scan" onPress={onPayer} style={{ marginTop: 18 }} />
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
}

const PAS = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];

export function Distance({ nav, p }: { nav: Nav; p: any }) {
  const [r, setR] = useState(500);
  const [tw, setTw] = useState(1);
  const ox = useRef(0);
  const track = useRef<any>(null);
  const jeu = CARDS.find((x) => x.id === p.jeu) || CARDS[0];
  const set = (pageX: number) => {
    const f = Math.min(1, Math.max(0, (pageX - ox.current) / tw));
    const v = PAS[Math.round(f * (PAS.length - 1))];
    if (v !== r) setR(v);
  };
  const frac = (r - 200) / 1800;
  const mapH = H - 330;
  return (
    <View style={{ flex: 1 }}>
      <MapClean />
      <View style={[c.centre, { position: 'absolute', top: 0, left: 0, right: 0, height: mapH }]}>
        <ZoneCercle size={zoneSize(r)} />
        <View style={{ position: 'absolute' }}><MoiPin size={52} halo={0} /></View>
      </View>
      <View style={c.entete}>
        <Back onPress={nav.back} />
        <Verre radius={24} style={c.chipJeu}><Text style={c.chipT}>{jeu.nom}</Text></Verre>
        <View style={{ width: 44 }} />
      </View>
      <View style={c.panneau}>
        <View style={c.grab} />
        <Verre radius={26} style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={c.ic2}><Ionicons name="radio-button-on" size={26} color={C.bleu} /></View>
            <Text style={c.zoneT}>Distance</Text>
            <Text style={c.zoneV}>{fmtM(r)}</Text>
          </View>
          <View
            ref={track}
            style={c.slider}
            onLayout={(e) => setTw(e.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => {
              const px = e.nativeEvent.pageX;
              (track.current as any)?.measureInWindow((x: number) => { ox.current = x; set(px); });
            }}
            onResponderMove={(e) => set(e.nativeEvent.pageX)}
          >
            <View style={c.rail} />
            <View style={[c.rail, c.railOn, { width: `${frac * 100}%` }]} />
            <View style={[c.thumb, { left: frac * (tw - 30) }]} />
          </View>
          <View style={c.bornes}><Text style={c.borne}>200 m</Text><Text style={c.borne}>2 km</Text></View>
        </Verre>
        <Pill label="Créer la salle" onPress={() => nav.replace('lobby', { ...p, rayon: r })} style={{ marginTop: 14 }} h={64} />
      </View>
    </View>
  );
}

const c = StyleSheet.create({
  top: { paddingTop: 64, paddingHorizontal: 20 },
  titre: { position: 'absolute', top: 64, left: 0, right: 0, fontSize: 36, fontWeight: '900', color: C.texte, letterSpacing: -1, textAlign: 'center', lineHeight: 44 },
  liste: { flex: 1, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 36, gap: 14 },
  rang: { flex: 1, flexDirection: 'row', gap: 14 },
  labelP: { position: 'absolute', left: 8, right: 8, bottom: 8, paddingHorizontal: 12, paddingVertical: 10 },
  nomP: { fontSize: 20, fontWeight: '900', color: C.texte, letterSpacing: -0.5 },
  sousP: { fontSize: 13, fontWeight: '600', color: C.gris, marginTop: 1 },
  card: { flex: 1, borderRadius: 30, backgroundColor: '#fff', padding: 4, shadowColor: '#2B5FA8', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  photo: { flex: 1, borderRadius: 26, overflow: 'hidden', backgroundColor: '#DCEBFA' },
  label: { position: 'absolute', left: 10, right: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  ic: { width: 46, height: 46, borderRadius: 16, backgroundColor: C.bleu, alignItems: 'center', justifyContent: 'center' },
  nom: { fontSize: 24, fontWeight: '900', color: C.texte, letterSpacing: -0.5 },
  sous: { fontSize: 14, fontWeight: '600', color: C.gris, marginTop: 1 },
  lock: { position: 'absolute', top: 12, right: 12, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  gratuit: { position: 'absolute', top: 12, right: 12, backgroundColor: C.bleu, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2, borderColor: '#fff' },
  gratuitT: { color: '#fff', fontWeight: '900', fontSize: 14 },
  centre: { alignItems: 'center', justifyContent: 'center' },
  feuillePw: { height: 570, backgroundColor: '#fff', borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 36 },
  sheet: { flex: 1, marginTop: -34, backgroundColor: '#fff', borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 30, shadowColor: '#2B5FA8', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: -6 } },
  fermer: { position: 'absolute', top: 14, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF3FA', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  logo: { width: 66, height: 66, borderRadius: 18 },
  pwT: { fontSize: 32, fontWeight: '900', color: C.texte, letterSpacing: -0.8, marginTop: 6 },
  li: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  liIc: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E4F0FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  liT: { fontSize: 17, fontWeight: '700', color: C.texte, flex: 1 },
  offres: { flexDirection: 'row', gap: 12, marginTop: 12 },
  offre: { borderRadius: 24, paddingVertical: 18, paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#F4F7FC', borderWidth: 2, borderColor: 'transparent', minHeight: 128, justifyContent: 'center' },
  offreOn: { backgroundColor: '#E4F1FF', borderColor: C.azur, shadowColor: C.azur, shadowOpacity: 0.55, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  offreT: { fontSize: 18, fontWeight: '700', color: C.texte },
  prix: { fontSize: 28, fontWeight: '900', color: C.texte, marginTop: 2, letterSpacing: -0.5 },
  offreS: { fontSize: 14, color: C.gris, fontWeight: '600', marginTop: 2 },
  badge: { position: 'absolute', top: -13, backgroundColor: C.bleu, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5 },
  badgeT: { color: '#fff', fontSize: 13, fontWeight: '800' },
  small: { color: C.gris, textAlign: 'center', marginTop: 8, fontSize: 14, fontWeight: '600' },
  pied: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 10, gap: 22 },
  piedT: { color: C.gris, fontSize: 14, fontWeight: '600' },
  sep: { width: 1.5, height: 18, backgroundColor: '#C9D2E0' },
  pay: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 22, paddingBottom: 40 },
  grab: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#C9D2E0', marginBottom: 14 },
  payHead: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  payLogo: { width: 56, height: 56, borderRadius: 14 },
  payT: { fontSize: 20, fontWeight: '900', color: C.texte },
  payS: { fontSize: 14, color: C.gris, fontWeight: '600', marginTop: 2 },
  payLigne: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E6ECF5' },
  payK: { fontSize: 16, color: C.gris, fontWeight: '600' },
  payV: { fontSize: 16, color: C.texte, fontWeight: '800' },
  attente: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, height: 64, marginTop: 18 },
  attenteT: { fontSize: 18, fontWeight: '800', color: C.texte },
  check: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.bleu, alignItems: 'center', justifyContent: 'center', shadowColor: C.bleu, shadowOpacity: 0.5, shadowRadius: 18, shadowOffset: { width: 0, height: 6 } },
  payFait: { fontSize: 34, fontWeight: '900', color: C.texte, marginTop: 14 },
  entete: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chipJeu: { paddingHorizontal: 26, paddingVertical: 10 },
  chipT: { fontSize: 26, fontWeight: '900', color: C.texte, letterSpacing: -0.5 },
  panneau: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(244,248,255,0.96)', borderTopLeftRadius: 34, borderTopRightRadius: 34, padding: 16, paddingTop: 12, paddingBottom: 34 },
  ic2: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#E4F0FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  zoneT: { flex: 1, fontSize: 24, fontWeight: '900', color: C.texte },
  zoneV: { fontSize: 30, fontWeight: '900', color: C.bleu, letterSpacing: -0.5 },
  slider: { height: 44, justifyContent: 'center', marginTop: 8 },
  rail: { position: 'absolute', left: 0, right: 0, height: 10, borderRadius: 5, backgroundColor: '#DCE5F2' },
  railOn: { right: undefined, backgroundColor: C.bleu },
  thumb: { position: 'absolute', width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#D5DEEC', shadowColor: '#2B5FA8', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  bornes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  borne: { fontSize: 13, fontWeight: '700', color: C.gris },
});
