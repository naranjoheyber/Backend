import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Movie, MoviePayload } from './models/movie.model';
import { MovieService } from './services/movie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly movieService = inject(MovieService);
  readonly movies = signal<Movie[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly search = signal('');
  readonly activeSection = signal('Movies');
  readonly modalOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(8);
  readonly total = computed(() => this.movies().length);
  readonly publishedCount = computed(() => this.movies().filter(m => m.status === 'Publicado').length);
  readonly draftCount = computed(() => this.movies().filter(m => m.status === 'Borrador').length);
  readonly averageRating = computed(() => {
    const rated = this.movies().filter(m => Number(m.rating) > 0);
    return rated.length ? (rated.reduce((sum, m) => sum + Number(m.rating), 0) / rated.length).toFixed(1) : '—';
  });
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  readonly visibleMovies = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.movies().slice(start, start + this.pageSize());
  });
  readonly form = signal<MoviePayload>(this.emptyForm());
  readonly genres = ['Acción', 'Animación', 'Aventura', 'Ciencia ficción', 'Comedia', 'Documental', 'Drama', 'Fantasía', 'Romance', 'Suspenso', 'Terror'];

  ngOnInit(): void { this.loadMovies(); }
  private emptyForm(): MoviePayload {
    return { title: '', description: '', year: new Date().getFullYear(), genre: 'Drama', posterUrl: '', rating: 0, status: 'Borrador', type: 'Película' };
  }
  loadMovies(): void {
    this.loading.set(true); this.error.set('');
    this.movieService.list(this.search()).subscribe({
      next: result => { this.movies.set(result.data ?? []); this.page.set(1); this.loading.set(false); },
      error: err => { this.error.set(this.errorMessage(err)); this.loading.set(false); }
    });
  }
  onSearch(value: string): void { this.search.set(value); this.loadMovies(); }
  setSection(section: string): void {
    this.activeSection.set(section);
    if (section === 'Movies') this.loadMovies();
    else if (section === 'TV Shows') this.onSearch('');
  }
  openCreate(): void { this.editingId.set(null); this.form.set(this.emptyForm()); this.modalOpen.set(true); this.notice.set(''); }
  openEdit(movie: Movie): void {
    if (!movie._id) return;
    this.editingId.set(movie._id);
    this.form.set({ title: movie.title, description: movie.description ?? '', year: movie.year, genre: movie.genre, posterUrl: movie.posterUrl ?? '', rating: movie.rating ?? 0, status: movie.status, type: movie.type });
    this.modalOpen.set(true); this.notice.set('');
  }
  closeModal(): void { if (!this.saving()) this.modalOpen.set(false); }
  updateField<K extends keyof MoviePayload>(key: K, value: MoviePayload[K]): void { this.form.update(current => ({ ...current, [key]: value })); }
  saveMovie(): void {
    const value = this.form();
    if (!value.title.trim() || !value.year || !value.genre.trim()) { this.error.set('Completa al menos el título, el año y el género.'); return; }
    this.saving.set(true); this.error.set('');
    const id = this.editingId();
    const request = id ? this.movieService.update(id, value) : this.movieService.create(value);
    request.subscribe({
      next: response => { this.saving.set(false); this.modalOpen.set(false); this.notice.set(response.message ?? 'Cambios guardados.'); this.loadMovies(); },
      error: err => { this.saving.set(false); this.error.set(this.errorMessage(err)); }
    });
  }
  deleteMovie(movie: Movie): void {
    if (!movie._id || !confirm(`¿Seguro que quieres eliminar «${movie.title}»? Esta acción no se puede deshacer.`)) return;
    this.movieService.delete(movie._id).subscribe({
      next: response => { this.notice.set(response.message); this.loadMovies(); },
      error: err => this.error.set(this.errorMessage(err))
    });
  }
  changePage(delta: number): void { this.page.set(Math.min(this.pageCount(), Math.max(1, this.page() + delta))); }
  changePageSize(value: string): void { this.pageSize.set(Number(value)); this.page.set(1); }
  trackById(_index: number, movie: Movie): string { return movie._id ?? movie.title; }
  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No se pudo conectar con la API. Comprueba que MongoDB y el backend estén iniciados.';
      return error.error?.message || `Error HTTP ${error.status}.`;
    }
    return 'Ocurrió un error inesperado.';
  }
}
