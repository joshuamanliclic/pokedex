import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { PokemonService } from '../pokemon-service.service';
import { Ability, PokemonResource, Stats } from '../pokemonResource';
import { EvolutionChain, Chain } from '../evolution-chain';
import { Pokemon } from '../pokemonList';
import { PokemonSpecies } from '../pokemonSpecies';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})

export class PokemonDetailsComponent implements OnInit {
  pokemon: PokemonResource|undefined;
  pokemonDescription: string|undefined;
  pokemonImage: string|undefined;
  evolutionChainUrl: string|undefined;
  evolutionSpeciesList: Pokemon[] = [];
  columnLength: number|undefined;
  pokemonStats: Stats[] = [];
  pokemonAbilities: Ability[] = [];
  pokemonVarieties: Pokemon[] = [];

  cardGridColumnsCount: number = this.evolutionSpeciesList.length;
  pokemonDetailPanelColumnCount: number = 2;
  pokemonImageColSpan: number = 1;
  pokemonDetailsColSpan: number = 1;
  pokemonAbilitiesColumns: number = this.pokemonAbilities.length;
  pokemonAbilitiesRowSpan: number = 1;
  pokemonImageRowSpan: number = 6;
  pokemonDetailsRowSpan: number = 6;
  pokemonDetailsPanelHeight: number = 500;
  cardGridRowHeight: number = 400;
  cardVarietiesGridColumnsCount: number = this.pokemonVarieties.length;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private router: Router,
  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.autoResizeElement(window.innerWidth);
    }, 1000);
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const pokemonFromRoute = String(routeParams.get('name'));

    // Find the product that correspond with the id provided in route.
    this.pokemonService.loadPokemon(pokemonFromRoute).subscribe(p => {
      this.pokemon = p, 
      this.getImage(),
      this.getEvolutionChainUrl(this.pokemon.species.url),
      this.pokemonAbilities = p.abilities,
      this.pokemonStats = p.stats,
      p.weight /= 10,
      p.height *= 0.32,
      this.autoResizeElement(window.innerWidth);
    });
  }

  onResize(event: any) {
    this.autoResizeElement(event.target.innerWidth);
  }

  autoResizeElement(innerWidth: number){
    if(innerWidth > 928){
      this.pokemonImageColSpan = 1;
      this.pokemonDetailPanelColumnCount = 2;
      this.pokemonDetailsColSpan = 1;
      this.pokemonImageRowSpan = 6;
      this.pokemonDetailsRowSpan = 6;
      this.pokemonDetailsPanelHeight = 500;
      this.cardGridRowHeight = 400;
      this.pokemonAbilitiesColumns = this.pokemonAbilities.length;
      if(this.pokemonVarieties.length > 3){
        this.cardGridColumnsCount = 4;
      } else {
        this.cardVarietiesGridColumnsCount = this.pokemonVarieties.length;
      }
      if(this.evolutionSpeciesList.length > 3){
        this.cardGridColumnsCount = 4;
      } else if(this.evolutionSpeciesList.length <= 3){
        this.cardGridColumnsCount = this.evolutionSpeciesList.length;
      }
      this.pokemonAbilitiesRowSpan = 1;
    } else {
      if(innerWidth > 700){
        if(this.evolutionSpeciesList.length > 1){
          this.cardGridColumnsCount = 3;
        } else {
          this.cardGridColumnsCount = 1;
        }
        if(this.pokemonVarieties.length > 1){
          this.cardVarietiesGridColumnsCount = 3;
        } else {
          this.cardVarietiesGridColumnsCount = 1;
        }
        this.pokemonAbilitiesRowSpan = 1;
      } else {
        if(innerWidth > 400){
          if(this.evolutionSpeciesList.length > 1){
            this.cardGridColumnsCount = 2;
          } else {
            this.cardGridColumnsCount = 1;
          }
          if(this.pokemonVarieties.length > 1){
            this.cardVarietiesGridColumnsCount = 2;
          } else {
            this.cardVarietiesGridColumnsCount = 1;
          }
          this.pokemonDetailPanelColumnCount = 2;
          this.pokemonImageColSpan = 2;
          this.pokemonDetailsColSpan = 2;
          this.pokemonImageRowSpan = 3;
          this.pokemonDetailsRowSpan = 3;
          this.pokemonDetailsPanelHeight = 600;
          this.cardGridRowHeight = 375;
          if(this.pokemonAbilities.length > 1){
            this.pokemonAbilitiesColumns = 2;
          } else {
            this.pokemonAbilitiesColumns = 1;
          }
          this.pokemonAbilitiesRowSpan = 1;
        } else {
          this.cardGridColumnsCount = 1;
          this.cardVarietiesGridColumnsCount = 1;
          this.pokemonDetailPanelColumnCount = 1;
          this.pokemonImageColSpan = 2;
          this.pokemonDetailsColSpan = 2;
          this.pokemonImageRowSpan = 3;
          this.pokemonDetailsRowSpan = 3;
          this.pokemonDetailsPanelHeight = 600;
          this.cardGridRowHeight = 375;
          this.pokemonAbilitiesColumns = 1;
          this.pokemonAbilitiesRowSpan = 2;
        }
      }
    }
  }

  getImage(){
    if(this.pokemon?.sprites.other['official-artwork'].front_default === null || this.pokemon?.name.includes("zygarde")){
      this.pokemonImage = this.pokemon?.sprites.front_default
    } else {
      this.pokemonImage = this.pokemon?.sprites.other['official-artwork'].front_default
    }
  }

  getEvolutionChainUrl(pokemonSUrl: string){
    this.pokemonService.loadEvolutionChainUrl(pokemonSUrl).subscribe(eC => {
      this.evolutionChainUrl = eC.evolution_chain.url,
      eC.flavor_text_entries.forEach(fT => {
        if(fT.language.name == "en"){
          this.pokemonDescription = fT.flavor_text.replace("", " ");
        }
      }),
      this.getEvolutionChain(this.evolutionChainUrl),
      this.listAllVarieties(eC);
    });
  }

  getEvolutionChain(evolutionUrl: string){
    this.pokemonService.loadEvolutionChain(evolutionUrl).subscribe(e => {
      if(e.chain !== null){
        this.listAllEvolution(e.chain);
      }
    });
  }

  listAllVarieties(pS: PokemonSpecies){ 
    for (let i = 0; i < pS.varieties.length; i++) {
      this.pokemonService.loadPokemon(pS.varieties[i].pokemon.name).subscribe(pokemon => {
          this.pokemonVarieties.push(pS.varieties[i].pokemon);
          this.autoResizeElement(window.innerWidth);
          pS.varieties[i].pokemon.id = pokemon.id
          if(pokemon.sprites.other['official-artwork'].front_default === null || pokemon.name.includes("zygarde")){
            pS.varieties[i].pokemon.src = pokemon.sprites.front_default
          } else {
            pS.varieties[i].pokemon.src = pokemon.sprites.other['official-artwork'].front_default
          }
          pS.varieties[i].pokemon.types = pokemon.types
          this.autoResizeElement(window.innerWidth);
      })
    };
  }

  listAllEvolution(e: Chain){
    this.columnLength = this.evolutionSpeciesList.length;

    this.pokemonService.loadPokemon(e.species.name).subscribe(pokemon => {
      if(e.species.id !== null){
        this.evolutionSpeciesList.push(e.species);
        this.autoResizeElement(window.innerWidth);
        e.species.id = pokemon.id
        if(pokemon.sprites.other['official-artwork'].front_default === null){
          e.species.src = pokemon.sprites.front_default
        } else {
          e.species.src = pokemon.sprites.other['official-artwork'].front_default
        }
        e.species.types = pokemon.types
      } 
    });
    if(e.evolves_to !== undefined){
      for (let i = 0; i < e.evolves_to.length; i++) {
        this.listAllEvolution(e.evolves_to[i]);
      };
    }
  }
}
