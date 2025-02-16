import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { PokeAPIResponse, Pokemon, SimplePokemon } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  private http = inject(HttpClient);

  public loadPage( page: number): Observable<SimplePokemon[]>{ //1, 2, 3...

    if(page != 0 ){
      --page;
    }

    if( page < 0 ) {
      page = Math.max(0, page);
    }

    return this.http.get<PokeAPIResponse>(`${ this.baseUrl }?offset=${ page * 20 }&limit=20`
    ).pipe(
      map( resp => {
        const simplePokemons : SimplePokemon[] = resp.results.map( (poke: { url: string, name: string }) => ({
          id: poke.url.split('/').at(-2) ?? '', // url= "https://pokeapi.co/api/v2/pokemon/21/"
          name: poke.name
        }))
        return simplePokemons;
      }),
      //tap( pokemons => console.log(pokemons))
    );
  }


  public loadPokemon(id: string) {
    console.log(`${ this.baseUrl }/${ id }`);

    return this.http.get<Pokemon>(`${ this.baseUrl }/${ id }`);
  }


}
