import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Pokemon } from '../../pokemons/interfaces';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemon-page',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-page.component.html',
  styleUrl: './pokemon-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PokemonPageComponent implements OnInit {

  private pokemonService = inject(PokemonsService);
  private route = inject(ActivatedRoute);

  private title = inject(Title);
  private meta = inject(Meta);

  public pokemon = signal<Pokemon | null>(null);

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    console.log(id);
    if(!id) return;

    this.pokemonService.loadPokemon(id)
      .pipe(
        tap(({ name,id }) => {

          const pageTitle = `#${ id } - ${ name }`;
          const pageDescription = `Página del Pokémon ${ name }`;
          const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          this.title.setTitle(pageTitle);

          this.meta.updateTag({name: 'descripcion', content: pageDescription});
          this.meta.updateTag({name: 'og:title', content: pageTitle});
          this.meta.updateTag({name: 'og:descripcion', content: pageDescription});
          this.meta.updateTag({name: 'og:image', content: pokemonImage});


        })
      )
      .subscribe(this.pokemon.set);
  }

}
