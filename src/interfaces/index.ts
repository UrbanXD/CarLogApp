export interface TeamInterface {
    id: string;
    name: string;
    logo: string;
}

export interface GoalsInterface {
    for: string;
    against: string;
}

export interface StandingInterface {
    team: TeamInterface;
    rank: string;
    played: string;
    win: string;
    draw: string;
    lose: string;
    goals: GoalsInterface;
    points: string;
}

export interface LeagueInterface {
    name: string;
    logo: string;
    season: string;
    standings: StandingInterface[];
}