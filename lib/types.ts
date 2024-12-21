type EventType = "predefined" | "open" | "team" | "freestyle" | "season";

interface Team {
    id: string;
    name: string;
    short_name: string;
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
}


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
    // templateIndex: number;
    // bracketId: number;
    // templateId: number;
    // templateName: string;
    // bracketWidth: number;
    // bracketHeight: number;
    // bracketFont: number;
    // pages: BracketPage[];
}

interface Weight {
    weight_index: number;
    weight_id: number;
    weight_name: string;
    bracket_id: number;
    // weightIndex: number;
    // weightId: string;
    // weightName: string;
    // bracketId: number;
}

interface BracketType {
    bracketId: number;
    // defaultTemplateIndex?: number;
    default_template_index?: number;
}

interface BracketData {
    weights: Weight[];
    templates: Template[];
    bracket_types: BracketType[];
}

export type { Team, Wrestler, Match, Tournament, EventType, Weight, BracketType, BracketPage, Template, BracketData };

