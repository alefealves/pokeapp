export interface Pokemon {
  id: number;
  name: string;
  url: string;
  image: string;
  gif: string;
  types: Type[];
  isFavorite: boolean;
}

export interface Type {
    slot: number;
    type: {
        name: string;
    }
}