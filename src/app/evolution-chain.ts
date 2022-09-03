import { Pokemon } from "./pokemonList";

export interface EvolutionChain {
    baby_trigger_item: any,
    chain: Chain,
    id: number,
}

export interface Chain {
    evolution_details: any[],
    evolves_to: Array<Chain>,
    is_baby: boolean,
    species: Pokemon,
}