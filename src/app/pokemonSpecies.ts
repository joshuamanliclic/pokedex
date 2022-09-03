import { Pokemon } from "./pokemonList";

export interface PokemonSpecies {
    base_happines: number,
    capture_rate: number,
    color: Array<any>,
    egg_groups: Array<any>,
    evolution_chain: {
        url: string,
    }
    evolves_from_species: Array<any>,
    flavor_text_entries: Array<FlavorTextEntries>,
    form_descriptions: Array<any>,
    forms_switchable: boolean,
    gender_rate: number,
    genera: Array<any>,
    generation: Array<any>,
    growth_rate: Array<any>,
    habitat: Array<any>,
    has_gender_differences: boolean,
    hatch_counter: number,
    id: number,
    is_baby: boolean,
    is_legendary: boolean,
    is_mythical: boolean,
    name: string,
    names: Array<any>,
    order: number,
    pal_park_encounters: Array<any>,
    pokedex_numbers: Array<any>,
    shape: Array<any>,
    varieties: Array<Varieties>,
}

export interface Varieties {
    is_default: boolean,
    pokemon: Pokemon
}

export interface FlavorTextEntries {
    flavor_text: string;
    language: any;
    version: any;
}