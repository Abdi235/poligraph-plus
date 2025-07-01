import UpdatesFeed from "@/components/UpdatesFeed";
import LiveGameScores from "@/components/LiveGameScores";
import NewsFeed from "@/components/NewsFeed";
import NBAPlayerStatsTable from "@/components/NBAPlayerStatsTable"; // Import the new component
import { NBAPlayerStatsItem } from "@/types/nba-stats"; // Import the type for mock data

// Mock data for NBAPlayerStatsTable (subset, real data would be fetched)
// This is the same mock data used inside NBAPlayerStatsTable.tsx for now.
// In a real scenario with client-side fetching in page.tsx, you'd fetch here.
// Or, if NBAPlayerStatsTable fetches its own data, this import might not be needed here.
const mockNbaStatsForPage: NBAPlayerStatsItem[] = [
  {
    player: { id: 734, firstname: "Dwayne", lastname: "Bacon" },
    team: { id: 26, name: "Orlando Magic", nickname: "Magic", code: "ORL", logo: "https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png" },
    game: { id: 8133 },
    points: 14, pos: "SF", min: "21:56", fgm: 6, fga: 9, fgp: "66.7", ftm: 1, fta: 1, ftp: "100", tpm: 1, tpa: 3, tpp: "33.3",
    offReb: 0, defReb: 2, totReb: 2, assists: 1, pFouls: 1, steals: 2, turnovers: 1, blocks: 0, plusMinus: "6", comment: null
  },
  {
    player: { id: 1868, firstname: "De'Andre", lastname: "Hunter" },
    team: { id: 1, name: "Atlanta Hawks", nickname: "Hawks", code: "ATL", logo: "https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png" },
    game: { id: 8133 },
    points: 18, pos: "SF", min: "26:07", fgm: 5, fga: 10, fgp: "50.0", ftm: 6, fta: 8, ftp: "75.0", tpm: 2, tpa: 5, tpp: "40.0",
    offReb: 1, defReb: 2, totReb: 3, assists: 0, pFouls: 3, steals: 0, turnovers: 1, blocks: 1, plusMinus: "-9", comment: null
  },
  // Add a DNP player to test that case from page level if needed
  {
    player: { id: 12, firstname: "Al-Farouq", lastname: "Aminu" },
    team: { id: 26, name: "Orlando Magic", nickname: "Magic", code: "ORL", logo: "https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png" },
    game: { id: 8133 },
    points: null, pos: null, min: null, fgm: null, fga: null, fgp: null, ftm: null, fta: null, ftp: null, tpm: null, tpa: null, tpp: null,
    offReb: null, defReb: null, totReb: null, assists: null, pFouls: null, steals: null, turnovers: null, blocks: null, plusMinus: null, comment: "DND - Injury / Illness"
  }
];


export default function Home() {
  const gameIdForStats = 8133; // Example Game ID

  return (
    <div className="space-y-8"> {/* Increased spacing between sections */}
      <header className="bg-white shadow p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to PoliGraph Plus</h1>
        <p className="text-gray-600 mt-1">Your central hub for the latest updates, live sports, and breaking news.</p>
      </header>

      {/* Main content grid - Feeds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-1">
          <UpdatesFeed />
        </section>
        <section className="md:col-span-1">
          <LiveGameScores />
        </section>
        <section className="md:col-span-1">
          <NewsFeed />
        </section>
      </div>

      {/* NBA Player Stats Section */}
      <section className="mt-8"> {/* Added margin top for separation */}
        {/*
          The NBAPlayerStatsTable component is currently set up to use its own internal mock data
          if no 'stats' prop is passed, OR it can use its conceptual useEffect to fetch.
          For this step, we'll explicitly pass the gameId.
          If we wanted this page to fetch and then pass data, we'd uncomment the data fetching logic here
          (or use Next.js server components/route handlers for server-side fetching).
        */}
        <NBAPlayerStatsTable gameId={gameIdForStats} stats={mockNbaStatsForPage} />
        {/*
          Alternatively, if NBAPlayerStatsTable is fetching its own data based on gameId:
          <NBAPlayerStatsTable gameId={gameIdForStats} />
        */}
      </section>

    </div>
  );
}
