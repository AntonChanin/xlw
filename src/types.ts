export type Role = 'advanturist' | 'navigator' | 'observer' | 'hacker' | 'trickster' | 'bull' | 'gunsmith' | 'pilot' | 'listener';
export type LiveState = 'alive' | 'coma' | 'invalid' | 'dead';

export type Img = {
    src: string;
    desc: string;
}

type UI = {
    main: Img;
    sub: Img[];
}

export type CardType = {
    name: string;
    ui: UI;
    action: {
        main():void;
        [key: string]: () => void;
    }
}

export type Expirience = {
    value: number,
    level: number,
    quests: Map<string, string>,
    role: string[],
}

export enum Gaits {
    VenusOrb = 'Venus orbit',
    MoonOrb = 'Moon orbit',
    MarsOrb = 'Mars orbit',
    VestaOrb = 'Vesta orbit',
    CeresOrb = 'Ceres orbit',
    CalistoOrb = 'Calisto orbit',
    TitanOrb = 'Titan orbit',
    TritonOrb = 'Triton orbit',
}
export enum Fractions {
    UNPM = 'UNPM',
    FMF = 'FMF',
    Syndicate = 'Syndicate',
    AFM = 'AFM',
    Ummah = 'Ummah',
}

/**
 * ATONATH ours universe. ciberpunck tech POW scaled tech of this universe origin
 * CETONATH universe pairing tech origin INT scaled tech of this universe origin
 * MATONATH universe biopanck tech AG scaled tech of this universe origin
 * DEAD SPACE experemental poligon of CETONATH for pairing tech, presumably once of this enum is real origin of pairing tech
 * ORIGIN DEAD SPACE unsuccessfull versions of of Solar system
 */
export enum Universes {
    ATONATH = 'ATONATH',
    CETONATH = 'CETONATH',
    MATONATH = 'MATONATH',
    DEAD_SPACE = 'DEAD SPACE',
    ORIGIN_DEAD_SPACE = 'ORIGIN DEAD SPACE',
}