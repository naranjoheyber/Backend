import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MoviePayload } from '../models/movie.model';

interface MovieListResponse { data: Movie[]; total: number; }
interface MovieResponse { data: Movie; message?: string; }

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  // Cambia esta URL si tu backend utiliza otro puerto o un dominio remoto.
  private readonly apiUrl = 'http://localhost:3000/api/movies';

  list(search = ''): Observable<MovieListResponse> {
    let params = new HttpParams();
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<MovieListResponse>(this.apiUrl, { params });
  }
  create(movie: MoviePayload): Observable<MovieResponse> {
    return this.http.post<MovieResponse>(this.apiUrl, movie);
  }
  update(id: string, movie: MoviePayload): Observable<MovieResponse> {
    return this.http.put<MovieResponse>(`${this.apiUrl}/${id}`, movie);
  }
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
