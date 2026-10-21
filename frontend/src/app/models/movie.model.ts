export interface Movie {
  _id?: string;
  title: string;
  description: string;
  year: number;
  genre: string;
  posterUrl: string;
  rating: number;
  status: 'Publicado' | 'Borrador' | 'Inactivo';
  type: 'Película' | 'Serie';
  createdAt?: string;
}

export type MoviePayload = Omit<Movie, '_id' | 'createdAt'>;
