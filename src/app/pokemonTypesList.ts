import { Pokemon } from "./pokemonList";

export interface PokemonTypesList {
    count: number, 
    next: string, 
    previous: string, 
    results: Array<Types>
}

export interface Types {
    name: string,
    url: string,
}

export interface PokemonType {
    damage_relations: any,
    game_indices: Array<any>,
    generation: any,
    id: number,
    move_damage_class: Array<any>,
    name: string,
    names: Array<any>,
    pokemon: Array<PokemonSlot>
}

export interface PokemonSlot {
    pokemon: Pokemon,
    slot: number,
}