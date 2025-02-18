import { ApplicationRef, ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonListSkeletonComponent } from "./ui/pokemon-list-skeleton/pokemon-list-skeleton.component";
import { app } from '../../../../server';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal, toObservable} from '@angular/core/rxjs-interop'
import { map, tap } from 'rxjs';

@Component({
  selector: 'pokemons-page',
  standalone: true,
  imports: [PokemonListComponent, PokemonListSkeletonComponent, RouterLink],
  templateUrl: './pokemons-page.component.html',
  styleUrl: './pokemons-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PokemonsPageComponent {



  private pokemonService = inject (PokemonsService);

  public pokemons = signal<SimplePokemon[]>([]);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  public currentPage = toSignal<number>(
    this.route.params.pipe(
      map( params => params['page'] ?? '1'),
      map( pag => ( isNaN(+pag) ? 1 : +pag)),
      map( pag => Math.max(1, pag))
      )
    );

    public loadOnPageChanged = effect(()  => {

      this.loadPokemons(this.currentPage());
    } ,{ allowSignalWrites: true }
  );






    private title = inject(Title);
    private meta = inject(Meta);


  // ngOnInit(): void {

  //   this.route.queryParamMap.subscribe( params => {

  //   })
  //  // console.log(this.currentPage());

  //   this.loadPokemons();
  //  // this.title.setTitle(`Lista de Pokèmon - Página ${this.currentPage()}`);
  //   this.meta.updateTag({name:'description', content: 'Lista de Pokèmon'});
  //   this.meta.updateTag({name:'og:title', content: 'Lista de Pokèmon'});
  //   this.meta.updateTag({name:'keywords', content: 'Hola, Mundo, Curso, Angular'});

  //   // setTimeout(() => {
  //   //   this.isLoading.set(false);

  //   // }, 1500);
  // }

  public loadPokemons ( page = 0) {

    const pageToLoad = this.currentPage()! + page;

    this.pokemonService.loadPage( pageToLoad )
    .pipe(


      tap( () => this.title.setTitle(`Lista de Pokèmon - Página ${pageToLoad}`))
    )
    .subscribe( pokes =>{

      this.pokemons.set(pokes);

    });
  }




}
