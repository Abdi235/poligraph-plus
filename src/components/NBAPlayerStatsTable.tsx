// src/components/NBAPlayerStatsTable.tsx
import React from 'react';
import Image from 'next/image'; // Import next/image
import { NBAPlayerStatsItem } from '@/types/nba-stats';

interface NBAPlayerStatsTableProps {
  stats: NBAPlayerStatsItem[];
  gameId?: string | number; // Optional gameId to display as context
}

// Mock Data based on the provided sample
const mockStatsData: NBAPlayerStatsItem[] = [
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
  {
    player: { id: 534, firstname: "Nikola", lastname: "Vucevic" },
    team: { id: 26, name: "Orlando Magic", nickname: "Magic", code: "ORL", logo: "https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png" },
    game: { id: 8133 },
    points: 18, pos: "C", min: "25:20", fgm: 8, fga: 14, fgp: "57.1", ftm: 0, fta: 1, ftp: "0.0", tpm: 2, tpa: 7, tpp: "28.6",
    offReb: 1, defReb: 10, totReb: 11, assists: 4, pFouls: 2, steals: 1, turnovers: 1, blocks: 1, plusMinus: "25", comment: null
  },
  {
    player: { id: 12, firstname: "Al-Farouq", lastname: "Aminu" },
    team: { id: 26, name: "Orlando Magic", nickname: "Magic", code: "ORL", logo: "https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png" },
    game: { id: 8133 },
    points: null, pos: null, min: null, fgm: null, fga: null, fgp: null, ftm: null, fta: null, ftp: null, tpm: null, tpa: null, tpp: null,
    offReb: null, defReb: null, totReb: null, assists: null, pFouls: null, steals: null, turnovers: null, blocks: null, plusMinus: null, comment: "DND - Injury / Illness"
  },
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
];


const NBAPlayerStatsTable: React.FC<NBAPlayerStatsTableProps> = ({ stats = mockStatsData, gameId }) => {
  // Group stats by team
  const statsByTeam: Record<string, NBAPlayerStatsItem[]> = stats.reduce((acc, stat) => {
    const teamName = stat.team.name || 'Unknown Team';
    if (!acc[teamName]) {
      acc[teamName] = [];
    }
    acc[teamName].push(stat);
    return acc;
  }, {} as Record<string, NBAPlayerStatsItem[]>);

  const renderTableForTeam = (teamName: string, teamStats: NBAPlayerStatsItem[]) => (
    <div key={teamName} className="mb-8">
      <div className="flex items-center mb-3">
        {teamStats[0]?.team.logo && (
          <Image
            src={teamStats[0].team.logo}
            alt={`${teamName} logo`}
            width={32} // Corresponds to h-8 w-8
            height={32}
            className="mr-3 object-contain"
          />
        )}
        <h3 className="text-xl font-semibold text-slate-700">{teamName}</h3>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-slate-100">
            <tr>
              {['Player', 'POS', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'TO', '+/-'].map(header => (
                <th key={header} className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {teamStats.map((stat) => (
              <tr key={stat.player.id} className={`${stat.comment ? 'bg-slate-50 opacity-70' : 'hover:bg-slate-50'}`}>
                <td className="px-3 py-2 font-medium text-slate-800 max-w-xs"> {/* Removed whitespace-nowrap, added max-w-xs for potential wrapping */}
                  {stat.player.firstname} {stat.player.lastname}
                  {stat.comment && <span className="block text-xs text-red-500 italic mt-0.5">{stat.comment}</span>} {/* Added mt-0.5 */}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.pos || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.min || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600 font-semibold">{stat.points ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.totReb ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.assists ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.steals ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.blocks ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.fgm ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.fga ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.fgp ? `${stat.fgp}%` : '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.tpm ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.tpa ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.tpp ? `${stat.tpp}%` : '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.ftm ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.fta ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.ftp ? `${stat.ftp}%` : '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.turnovers ?? '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap text-slate-600">{stat.plusMinus || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
        NBA Player Statistics
      </h2>
      {gameId && <p className="text-sm text-slate-500 mb-4">Displaying stats for Game ID: {gameId}</p>}

      {Object.entries(statsByTeam).map(([teamName, teamData]) => renderTableForTeam(teamName, teamData))}

      {/*
      // Conceptual useEffect for data fetching
      // const [loading, setLoading] = useState(true);
      // const [error, setError] = useState<string | null>(null);
      // const [actualStats, setActualStats] = useState<NBAPlayerStatsItem[]>([]);

      // useEffect(() => {
      //   if (!gameId) {
      //     // If using mock data or no gameId is passed, no need to fetch
      //     // Or handle this case as needed, e.g. load default mock data
      //     setActualStats(mockStatsData); // Example: load mock data if no gameId
      //     setLoading(false);
      //     return;
      //   }

      //   const fetchStats = async () => {
      //     setLoading(true);
      //     setError(null);
      //     try {
      //       // IMPORTANT: In a real app, the API key should NOT be exposed here.
      //       // This call should go to YOUR backend, which then calls the NBA API.
      //       // const response = await fetch(`/api/nba/player-stats?game=${gameId}`);
      //       // if (!response.ok) {
      //       //   throw new Error(`HTTP error! status: ${response.status}`);
      //       // }
      //       // const data: NBAPlayerStatsAPIResponse = await response.json();
      //       // setActualStats(data.response);

      //       // For demonstration, using mock data after a delay
      //       setTimeout(() => {
      //         const gameData = mockStatsData.filter(stat => stat.game.id === Number(gameId));
      //         setActualStats(gameData.length > 0 ? gameData : mockStatsData); // Fallback to all mock if specific game not found in mock
      //         setLoading(false);
      //       }, 1000);
      //     } catch (e: any) {
      //       setError(e.message);
      //       setLoading(false);
      //     }
      //   };

      //   fetchStats();
      // }, [gameId]); // Re-fetch if gameId changes

      // if (loading) return <p className="text-center text-slate-500 py-8">Loading player stats...</p>;
      // if (error) return <p className="text-center text-red-500 py-8">Error loading stats: {error}</p>;
      // if (!actualStats || actualStats.length === 0) return <p className="text-center text-slate-500 py-8">No player stats available for this game.</p>;

      // Then use 'actualStats' to build the tables.
      */}
    </div>
  );
};

export default NBAPlayerStatsTable;
