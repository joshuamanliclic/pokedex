export interface PokemonResource {
    abilities: Array<Ability>, 
    base_experience: number,
    forms: Array<any>, 
    game_indices: Array<any>,
    height: number,
    held_items: Array<any>,
    id: number,
    is_default: boolean,
    location_area_encounters: string,
    moves: Array<any>, 
    name: string,
    order: number,
    past_types: Array<any>,
    species: {
        name: string,
        url: string,
    }
    sprites: {
        back_default: string,
        back_female: string,
        back_shiny: string,
        back_shiny_female: string,
        front_default: string,
        front_female: string,
        front_shiny: string,
        front_shiny_female: string,
        other: {
            dream_world: {
                front_default: string,
                front_female: string,
            }
            'official-artwork': {
                front_default: string,
            }
        }
    },
    stats: Array<Stats>,
    types: Array<PokemonTypes>,
    weight: number,
}

export interface Ability {
    ability: {
        name: string,
        url: string,
    }
    is_hidden: boolean,
    slot: number,
}

export interface Stats {
    base_stat: number,
    effort: number,
    stat: Stat,
}

export interface Stat {
    name: string,
    url: string,
}

export interface PokemonTypes {
    slot: number,
    type: {
        name: string,
        url: string,
    }
}