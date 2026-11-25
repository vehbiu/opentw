type EventType = "predefined" | "open" | "team" | "freestyle" | "season";

interface Team {
    id: string;
    name: string;
    shortName: string;
}

interface Wrestler {
    id: string;
    first_name: string;
    last_name: string;
    team: Team;
    record?: string;
    year?: string;
}

interface Match {
    mat: number;
    bout: number;
    status: "in_progress" | "on_deck" | "in_hole";
    weight_class: string;
    round: string;
    wrestler1: Wrestler;
    wrestler2: Wrestler;
}

/**
 * Represents a wrestling tournament from Trackwrestling
 */
interface Tournament {
    id: number;
    name: string;
    // event_type: number; // 1=Predefined, 2=Open, 3=Team, 4=Freestyle, 5=Season
    event_type: EventType;
    start_date?: Date;
    end_date?: Date;
    venue_name?: string;
    venue_city?: string;
    venue_state?: string;
    venue_zip?: string;
    logo_url?: string;
    event_flyer_url?: string;
    website_url?: string;
    venue_street?: string;
    registration_url?: string;
    /** "flowrestling" when TrackWrestling has handed the tournament over to FloWrestling. */
    source: TournamentSource;
    flowrestling_event_id?: string;
    flowrestling_url?: string;
}

type TournamentSource = "trackwrestling" | "flowrestling";


// @dataclass
// class Weight(BaseClass):
//     id: int
//     division_id: int
//     bracket_id: int
//     weight_class: str
//     participants: int

// @dataclass
// class Division(BaseClass):
//     division_id: int
//     weights: List[Weight]

// @dataclass
// class BracketData(BaseClass):
//     divisions: List[Division]
//     weights: List[Weight]

interface BracketPage {
    page_index: number;
    page_id: number;
    page_name: string;
    show_page: boolean;
    // pageIndex: number;
    // pageId: number;
    // pageName: string;
    // showPage: boolean;
}

interface Template {
    template_index: number;
    bracket_id: number;
    template_id: number;
    template_name: string;
    bracket_width: number;
    bracket_height: number;
    bracket_font: number;
    pages: BracketPage[];
    /** Freestyle tournaments only. */
    bracket_rows?: number | null;
    // templateIndex: number;
    // bracketId: number;
    // templateId: number;
    // templateName: string;
    // bracketWidth: number;
    // bracketHeight: number;
    // bracketFont: number;
    // pages: BracketPage[];
}

// FloWrestling ids are strings; TrackWrestling's are numbers.
type Id = number | string;

interface Division {
    division_index: number;
    division_id: Id;
    division_name: string;
}

interface Weight {
    weight_index: number;
    weight_id: Id;
    weight_name: string;
    bracket_id: Id;
    /** Open tournaments only. */
    division_id?: Id | null;
    // weightIndex: number;
    // weightId: string;
    // weightName: string;
    // bracketId: number;
}

interface BracketType {
    bracket_id: number;
    // defaultTemplateIndex?: number;
    default_template_index?: number;
}

interface BracketData {
    divisions: Division[];
    weights: Weight[];
    templates: Template[];
    bracket_types: BracketType[];
}

/** One side of a FloWrestling bracket bout: a wrestler, or a team in team brackets. */
interface BracketSide {
    id: string | null;
    name: string;
    team?: string | null;
    team_abbreviation?: string | null;
    seed?: number | null;
    score?: number | null;
    winner: boolean;
}

interface BracketBout {
    id: string;
    bout_number: string | null;
    round: string | null;
    mat: string | null;
    state: string | null;
    result: string | null;
    win_type: string | null;
    time: string | null;
    top: BracketSide | null;
    bottom: BracketSide | null;
    winner_to?: string | null;
    loser_to?: string | null;
    x?: number | null;
    y?: number | null;
}

interface Placement {
    place: number;
    name: string;
    team?: string | null;
    id?: string | null;
}

/** A whole bracket as data; FloWrestling tournaments only (TrackWrestling brackets are HTML). */
interface BracketSheet {
    id: string;
    name: string;
    participant_type: string | null;
    wrestler_count: number | null;
    bouts: BracketBout[];
    placements: Placement[];
}

export type {
    Team, Wrestler, Match, Tournament, TournamentSource, EventType, Id, Division, Weight, BracketType,
    BracketPage, Template, BracketData, BracketSide, BracketBout, Placement, BracketSheet,
};

