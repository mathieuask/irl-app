export type Route = { name: string; p: any };

export type Nav = {
  go: (name: string, p?: any) => void;
  replace: (name: string, p?: any) => void;
  back: () => void;
  reset: (name: string, p?: any) => void;
};
