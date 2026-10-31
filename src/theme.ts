export const C = {
  azur: '#4FB3F4',
  bleu: '#086EF7',
  nuit: '#0638E8',
  rouge: '#FC1D33',
  texte: '#03061C',
  blanc: '#FFFFFF',
  gris: '#6B7280',
  verre: 'rgba(255,255,255,0.82)',
};

export const IMG = {
  logo: require('../assets/img/logo.jpg'),
  carte: require('../assets/img/carte.jpg'),
  lieu: require('../assets/img/lieu.jpg'),
  rue: require('../assets/img/rue.jpg'),
  boite: require('../assets/img/boite.png'),
};

export const AV = {
  moi: require('../assets/av/moi.jpg'),
  lea: require('../assets/av/lea.jpg'),
  hugo: require('../assets/av/hugo.jpg'),
  sam: require('../assets/av/sam.jpg'),
  ines: require('../assets/av/ines.jpg'),
  theo: require('../assets/av/theo.jpg'),
};

export type AvKey = keyof typeof AV;

export const JOUEURS: { id: AvKey; nom: string }[] = [
  { id: 'lea', nom: 'Léa' },
  { id: 'hugo', nom: 'Hugo' },
  { id: 'sam', nom: 'Sam' },
  { id: 'ines', nom: 'Inès' },
  { id: 'theo', nom: 'Théo' },
];

export type Jeu = 'manhunt' | 'geo' | 'objet';

export const JEUX: { id: Jeu; nom: string; phrase: string; icone: string; couleur: string }[] = [
  { id: 'manhunt', nom: 'Manhunt', phrase: 'Un fuyard, des chasseurs. Trouve-le avant la fin.', icone: 'walk', couleur: C.rouge },
  { id: 'geo', nom: 'GeoGuessr', phrase: 'Une photo. Retrouve le lieu en vrai.', icone: 'image', couleur: C.bleu },
  { id: 'objet', nom: "Trouve l'objet", phrase: "Un objet tiré au sort. Le premier qui le photographie gagne.", icone: 'search', couleur: '#0A9F6E' },
];
