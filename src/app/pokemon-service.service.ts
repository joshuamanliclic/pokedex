import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PokemonList, Pokemon } from './pokemonList';
import { PokemonResource } from './pokemonResource';
import { catchError, map , tap } from 'rxjs/operators';
import { PokemonSpecies } from './pokemonSpecies';
import { EvolutionChain } from './evolution-chain';
import { PokemonTypesList, PokemonType } from './pokemonTypesList';
import { ActivatedRoute , Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  pokeApiURL: string = "https://pokeapi.co/api/v2/";

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  loadMultiPokemons(limit: number, offset: number){
    return this.http.get<PokemonList>(this.pokeApiURL + 'pokemon?limit=' + limit + '&offset=' + offset);
  }

  loadPokemonResultURL(pokeResult: string){
    return this.http.get<PokemonResource>(pokeResult);
  }

  loadPokemon(pokemonName: string){
    return this.http.get<PokemonResource>(this.pokeApiURL + 'pokemon/' + pokemonName).pipe(
      catchError((err) => {
        return throwError(err);   
      })
    );
  }

  loadEvolutionChainUrl(pokemonUrl: string){
    return this.http.get<PokemonSpecies>(pokemonUrl);
  }

  loadEvolutionChain(evelutionChainUrl: string){
    return this.http.get<EvolutionChain>(evelutionChainUrl);
  }

  loadByPokemonType(pokeType: string){
    return this.http.get<PokemonType>(this.pokeApiURL + "type/" + pokeType + "/");
  }

  loadPokemonTypeList(){
    return this.http.get<PokemonTypesList>(this.pokeApiURL + "type/");
  }
}
