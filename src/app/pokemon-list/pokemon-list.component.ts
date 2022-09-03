import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { ActivatedRoute , Router } from '@angular/router';

import { PokemonService } from '../pokemon-service.service';
import { PokemonList, Pokemon } from '../pokemonList';
import { PokemonResource, PokemonTypes } from '../pokemonResource';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
})
export class PokemonListComponent implements OnInit {
  allPokemons: Pokemon[] = [];
  pokemonsList: Pokemon[] = [];
  pokemonType: PokemonTypes [] = [];

  totalLength: number = 0;
  offset: number = 0;
  totalPokemonsPerPageDefaultValue: number = 20;
  totalPokemonsPerPage: number = this.totalPokemonsPerPageDefaultValue;
  startOfPage: number = 1;
  pageNumber: number = this.startOfPage;

  isSearching: boolean = false;
  isLoading: boolean = false;
  pokemonNotFound: boolean = false;
  isSearchingByType: boolean = false;
  pokemonAllTypes: string[] = [];
  currentType: string = "";

  cardGridColumnsCount: number = 4;
  searchTypeGridColumnCount: number = 6;
  cardGridRowHeight: number = 400;

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute,
    private router: Router,) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.autoResizeElement(window.innerWidth);
    }, 1000);
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const pokemonTypeFromRoute = String(routeParams.get('type'));
    
    this.getPokemonTypesList();
    this.pageNumber = this.startOfPage;

    if(pokemonTypeFromRoute != "null"){
      this.loadByType(pokemonTypeFromRoute, this.startOfPage);
    } 
    else if(pokemonTypeFromRoute == "null"){
      this.loadPage(this.startOfPage);
    }
  }

  onResize(event: any) {
    this.autoResizeElement(event.target.innerWidth);
  }

  autoResizeElement(innerWidth: number){
    if(innerWidth <= 928) {
      if(innerWidth <= 700) {
        if(innerWidth <= 465){
          this.cardGridColumnsCount = 1;
          this.searchTypeGridColumnCount = 2;
          this.cardGridRowHeight = 375;
        } else {
          this.cardGridColumnsCount = 2;
          this.searchTypeGridColumnCount = 3;
          this.cardGridRowHeight = 375;
        } 
      } else {
        this.cardGridColumnsCount = 3;
      }
    } else {
      this.cardGridColumnsCount = 4;
      this.searchTypeGridColumnCount = 6;
      this.cardGridRowHeight = 400;
    }
  }

  getPokemonTypesList(){
    this.pokemonService.loadPokemonTypeList().subscribe(tL => tL.results.forEach(t => {
      if((t.name !== "unknown") && (t.name !== "shadow")){
        this.pokemonAllTypes.push(t.name)
      }
    }));
  }

  reloadPage(){
    location.reload();
  }

  resetPage(){
    this.loadPage(this.startOfPage);
  }

  nextPage(pageNumber: number){
    if(this.isSearching){
      if(this.isSearchingByType){
        this.loadTypePage(pageNumber);
      } else {
        this.loadSearchedPokemons(pageNumber);
      }
    } else {
      this.loadPage(pageNumber);
    }
  }

  getPokemonListLength(){
    this.allPokemons = [];
    this.totalPokemonsPerPage = this.totalPokemonsPerPageDefaultValue;
    this.pokemonService.loadMultiPokemons(this.offset, this.offset).subscribe(pokemon => {
      this.totalLength = 898,
      this.pokemonService.loadMultiPokemons(this.totalLength, this.offset).subscribe(pokemon => {
        pokemon.results.forEach(p => this.allPokemons.push(p))
      })
    });
  }

  loadPage(pageOffset: number){
    this.pokemonNotFound = false;
    this.isSearchingByType = false;
    this.isSearching = false;
    this.currentType = "";
    this.pokemonsList.length = 0;
    this.getPokemonListLength();
    this.getOtherPokemons(this.totalPokemonsPerPage, (pageOffset - 1) * this.totalPokemonsPerPage);
  }

  getOtherPokemons(limit: number, offset: number): void {
    this.pokemonService.loadMultiPokemons(limit, offset).subscribe(pokemon => {
      this.pokemonsList = pokemon.results,
      this.pokemonsList.forEach(pokeResult => this.pokemonService.loadPokemonResultURL(pokeResult.url).subscribe(pokemon => {
        if(pokemon.sprites.other['official-artwork'].front_default === null || pokemon.name.includes("zygarde")){
          pokeResult.src = pokemon.sprites.front_default
        } else {
          pokeResult.src = pokemon.sprites.other['official-artwork'].front_default
        }
        pokeResult.id = pokemon.id,
        pokeResult.types = pokemon.types
      })),
      this.isSearching = false,
      this.isLoading = false
    });
  }

  searchPokemon(pokemonName: string) {
    this.isSearchingByType = false;
    this.pokemonNotFound = false;
    this.isLoading = true;
    if(pokemonName == ""){
      this.pokemonsList.length = 0;
      this.loadPage(this.startOfPage);
      this.isLoading = false;
    } else {
      this.isSearching = true;
      this.pokemonsList = [];

      this.allPokemons.forEach(p => {
        if(p.name.includes(pokemonName)){
          this.pokemonsList.push(p);
        }
      })

      if(this.pokemonsList.length <= 0){
        this.pokemonNotFound = true;
        this.isSearching = false;
        this.isLoading = false;
      } else {
        this.totalLength = this.pokemonsList.length;
        this.loadSearchedPokemons(this.startOfPage);
      }
    }
    this.pageNumber = this.startOfPage;
  }

  loadSearchedPokemons(offset: number){
    this.pokemonsList.slice(offset - 1, this.totalPokemonsPerPage * offset).forEach(p => {
      this.pokemonService.loadPokemon(p.name.toLowerCase()).subscribe(
      (response) => {
        if(response.sprites.other['official-artwork'].front_default === null || p.name.includes("zygarde")){
          p.src = response.sprites.front_default;
        } else {
          p.src = response.sprites.other['official-artwork'].front_default;
        }
        p.id = response.id,
        p.types = response.types,
        this.isLoading = false
      },
      (error) => {                           
        this.isSearching = false;
        this.isLoading = false;
        this.pokemonNotFound = true;
      })
    })
  }

  loadByType(pokeType: string, typeOffset: number){
    this.pokemonNotFound = false;
    this.currentType = pokeType;
    this.isSearchingByType = true;
    this.isSearching = true;
    this.isLoading = true;
    this.pageNumber = this.startOfPage;
    this.pokemonService.loadByPokemonType(pokeType).subscribe(p => {
      this.totalLength = p.pokemon.length,
      this.loadTypePage(typeOffset);
    }); 
  }

  loadTypePage(pageOffset: number){
    this.pokemonsList = [];
    this.loadPokemonsByType((pageOffset - 1) * this.totalPokemonsPerPage);
  }

  loadPokemonsByType(typeOffset: number){
    this.pokemonService.loadByPokemonType(this.currentType).subscribe(p => {
      p.pokemon.slice(typeOffset, this.totalPokemonsPerPage + typeOffset).forEach(pokeResult => {
        this.pokemonService.loadPokemonResultURL(pokeResult.pokemon.url).subscribe(pokemon => {
          this.pokemonsList.push(pokeResult.pokemon)
          if(pokemon.sprites.other['official-artwork'].front_default === null || pokemon.name.includes("zygarde")){
            pokeResult.pokemon.src = pokemon.sprites.front_default
          } else {
            pokeResult.pokemon.src = pokemon.sprites.other['official-artwork'].front_default
          }
          pokeResult.pokemon.id = pokemon.id,
          pokeResult.pokemon.types = pokemon.types
          this.isLoading = false;
        })
      })
    }); 
  }
}
