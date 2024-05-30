import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon.list';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, mergeMap, throwError } from 'rxjs';
import { PokemonDetail } from '../models/pokemon.detail';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  public pokemonsFavorites: Pokemon[] = [];
  private totalPokemons: number = 1302;

  constructor() { }

  getPokemonsList(offset: number, limit: number = 20): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.baseUrl}?offset=${offset}&limit=${limit}`)
      .pipe(
        mergeMap(response => {
          const requests = response.results.map((pokemon: any) =>
            this.http.get<any>(pokemon.url).pipe(
              map(details => ({
                id: details.id,
                name: details.name,
                url: details.url,
                isFavorite: false,
                image: details.sprites.front_default,
                gif: details.sprites.other.showdown.front_default,
                types: details.types,
              }))
            )
          );
          return forkJoin(requests) as Observable<Pokemon[]>;
        }),
        catchError(error => throwError(error)));
  }

  getPokemonDetail(pokemon: number | string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/${pokemon}`);
  }
  
  getAllPokemons(): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.baseUrl}?offset=0&limit=${this.totalPokemons}`)
      .pipe(
        mergeMap(response => {
          const requests = response.results.map((pokemon: any) =>
            this.http.get<any>(pokemon.url).pipe(
              map(details => ({
                id: details.id,
                name: details.name,
                url: details.url,
                isFavorite: false,
                image: details.sprites.front_default,
                gif: details.sprites.other.showdown.front_default,
                types: details.types,
              }))
            )
          );
          return forkJoin(requests) as Observable<Pokemon[]>;
        }),
        catchError(error => throwError(error)));
  }

  isFavorite(id: number): boolean {
    return (this.pokemonsFavorites.filter(x => x.id === id).length > 0);
  }

  toggleFavorite(pokemon: Pokemon): void {
    if (this.pokemonsFavorites.filter(x => x.id === pokemon.id).length > 0) {
      this.pokemonsFavorites.splice(this.pokemonsFavorites.indexOf(pokemon), 1);
    } else {
      this.pokemonsFavorites.push(pokemon);
    }
  }
  
}
