// src/app/api/nba/player-stats/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NBAPlayerStatsAPIResponse, NBAPlayerStatsItem } from '@/types/nba-stats';

// This is a partial mock data derived from the sample you provided.
// In a real scenario, this data would come from the live NBA API.
const allMockStats: NBAPlayerStatsItem[] = [
  // Orlando Magic Players from Game 8133
  {
    player: { id: 734, firstname: "Dwayne", lastname: "Bacon" },
    team: { id: 26, name: "Orlando Magic", nickname: "Magic", code: "ORL", logo: "https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png" },
    game: { id: 8133 },
    points: 14, pos: "SF", min: "21:56", fgm: 6, fga: 9, fgp: "66.7", ftm: 1, fta: 1, ftp: "100", tpm: 1, tpa: 3, tpp: "33.3",
    offReb: 0, defReb: 2, totReb: 2, assists: 1, pFouls: 1, steals: 2, turnovers: 1, blocks: 0, plusMinus: "6", comment: null
  },
  {
    player: { id: 195, firstname: "Aaron", lastname: "Gordon" },
    team: { id: 26, name: "Orlando Magic", nickname: "Magic", code: "ORL", logo: "https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png" },
    game: { id: 8133 },
    points: 12, pos: "PF", min: "16:19", fgm: 4, fga: 7, fgp: "57.1", ftm: 3, fta: 3, ftp: "100", tpm: 1, tpa: 2, tpp: "50.0",
    offReb: 1, defReb: 2, totReb: 3, assists: 6, pFouls: 0, steals: 0, turnovers: 0, blocks: 0, plusMinus: "11", comment: null
  },
  // Atlanta Hawks Players from Game 8133
  {
    player: { id: 1868, firstname: "De'Andre", lastname: "Hunter" },
    team: { id: 1, name: "Atlanta Hawks", nickname: "Hawks", code: "ATL", logo: "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png" },
    game: { id: 8133 },
    points: 18, pos: "SF", min: "26:07", fgm: 5, fga: 10, fgp: "50.0", ftm: 6, fta: 8, ftp: "75.0", tpm: 2, tpa: 5, tpp: "40.0",
    offReb: 1, defReb: 2, totReb: 3, assists: 0, pFouls: 3, steals: 0, turnovers: 1, blocks: 1, plusMinus: "-9", comment: null
  },
  {
    player: { id: 761, firstname: "John", lastname: "Collins" },
    team: { id: 1, name: "Atlanta Hawks", nickname: "Hawks", code: "ATL", logo: "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png" },
    game: { id: 8133 },
    points: 14, pos: "PF", min: "22:09", fgm: 4, fga: 6, fgp: "66.7", ftm: 5, fta: 6, ftp: "83.3", tpm: 1, tpa: 1, tpp: "100",
    offReb: 4, defReb: 5, totReb: 9, assists: 1, pFouls: 4, steals: 2, turnovers: 4, blocks: 1, plusMinus: "-4", comment: null
  },
  // Add more players if needed for thorough testing, or use the full list from the original JSON.
  // For brevity, only a few are included here.
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('game');

  if (!gameId) {
    return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
  }

  // **IMPORTANT: Secure API Key Handling & Real API Call**
  // In a real application, you would:
  // 1. Retrieve your RAPIDAPI_KEY from environment variables (e.g., process.env.RAPIDAPI_KEY).
  //    NEVER hardcode it.
  // 2. Construct the URL for the external NBA API.
  // 3. Make the fetch request using your API key in the headers.
  //
  // Example (conceptual, DO NOT run this directly with a hardcoded key):
  // const apiKey = process.env.X_RAPIDAPI_KEY;
  // if (!apiKey) {
  //   return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  // }
  // const externalApiUrl = `https://api-nba-v1.p.rapidapi.com/players/statistics?game=${gameId}`;
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
  //     'x-rapidapi-key': apiKey
  //   }
  // };
  // try {
  //   const externalResponse = await fetch(externalApiUrl, options);
  //   if (!externalResponse.ok) {
  //     const errorData = await externalResponse.text();
  //     console.error("External API Error:", errorData);
  //     throw new Error(`External API failed with status: ${externalResponse.status}`);
  //   }
  //   const data: NBAPlayerStatsAPIResponse = await externalResponse.json();
  //   return NextResponse.json(data);
  // } catch (error) {
  //   console.error('Failed to fetch from external NBA API:', error);
  //   return NextResponse.json({ error: 'Failed to fetch data from NBA API.' }, { status: 503 });
  // }

  // For this conceptual step, we'll return mock data based on the gameId.
  // We'll filter our `allMockStats` to simulate fetching for a specific game.
  // Since our mock data is small and all for game 8133, this will be simple.
  const gameSpecificStats = allMockStats.filter(stat => stat.game.id.toString() === gameId);

  if (gameSpecificStats.length === 0 && gameId === "8133") {
    // If gameId is 8133 but filter somehow failed, return all mock data for 8133 as a fallback
     const mockApiResponse: NBAPlayerStatsAPIResponse = {
      get: "players/statistics",
      parameters: { game: gameId },
      errors: [],
      results: allMockStats.length, // should be gameSpecificStats.length if filtered correctly
      response: allMockStats, // or gameSpecificStats
    };
    return NextResponse.json(mockApiResponse);
  } else if (gameSpecificStats.length > 0) {
     const mockApiResponse: NBAPlayerStatsAPIResponse = {
      get: "players/statistics",
      parameters: { game: gameId },
      errors: [],
      results: gameSpecificStats.length,
      response: gameSpecificStats,
    };
    return NextResponse.json(mockApiResponse);
  }


  // Fallback for any other gameId to simulate no data found or different game
  const emptyResponse: NBAPlayerStatsAPIResponse = {
    get: "players/statistics",
    parameters: { game: gameId },
    errors: [],
    results: 0,
    response: [],
  };
  return NextResponse.json(emptyResponse);
}
