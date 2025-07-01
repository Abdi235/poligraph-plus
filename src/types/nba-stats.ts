// src/types/nba-stats.ts

export interface NBAPlayer {
  id: number;
  firstname: string;
  lastname: string;
}

export interface NBATeamInfo {
  id: number;
  name: string;
  nickname: string;
  code: string;
  logo: string | null; // Logo can sometimes be null or missing
}

export interface NBAGameInfo {
  id: number;
}

export interface NBAPlayerStatsItem {
  player: NBAPlayer;
  team: NBATeamInfo;
  game: NBAGameInfo;
  points: number | null;
  pos: string | null;
  min: string | null;
  fgm: number | null;
  fga: number | null;
  fgp: string | null; // Percentage, comes as string e.g., "66.7"
  ftm: number | null;
  fta: number | null;
  ftp: string | null; // Percentage
  tpm: number | null;
  tpa: number | null;
  tpp: string | null; // Percentage
  offReb: number | null;
  defReb: number | null;
  totReb: number | null;
  assists: number | null;
  pFouls: number | null;
  steals: number | null;
  turnovers: number | null;
  blocks: number | null;
  plusMinus: string | null; // e.g. "6", "-20"
  comment: string | null; // e.g., "DND - Injury / Illness"
}

export interface NBAPlayerStatsAPIResponse {
  get: string;
  parameters: {
    game: string;
  };
  errors: any[]; // Or a more specific error type if known
  results: number;
  response: NBAPlayerStatsItem[];
}
