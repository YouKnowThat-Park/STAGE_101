export type TheaterId = 'musicalA' | 'musicalB' | 'musicalC' | 'cinemaA' | 'cinemaB' | 'cinemaC';

export const THEATER_CONFIG: Record<TheaterId, { label: string; kind: 'musical' | 'cinema' }> = {
  musicalA: { label: '뮤지컬 A관', kind: 'musical' },
  musicalB: { label: '뮤지컬 B관', kind: 'musical' },
  musicalC: { label: '뮤지컬 C관', kind: 'musical' },
  cinemaA: { label: '시네마 A관', kind: 'cinema' },
  cinemaB: { label: '시네마 B관', kind: 'cinema' },
  cinemaC: { label: '시네마 C관', kind: 'cinema' },
};

export const THEATER_LIST = Object.entries(THEATER_CONFIG).map(([id, v]) => ({
  id: id as TheaterId,
  name: v.label,
}));
