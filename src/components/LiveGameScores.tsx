// src/components/LiveGameScores.tsx
import React from 'react';

interface Team {
  name: string;
  logo?: string; // URL to team logo
  tricode?: string; // e.g., LAL for Lakers
}
interface GameScore {
  id: string;
  sport: string;
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  status: string; // e.g., "Live", "Halftime", "Ended", "Scheduled"
  time?: string; // Optional time/period e.g., "Q4 02:30", "88'", "Set 3"
  venue?: string; // Optional venue
  league?: string; // Optional league e.g. "NBA", "Premier League"
}

const LiveGameScores = () => {
  const games: GameScore[] = [
    { id: 'g1', sport: 'Basketball', league: 'NBA', team1: { name: 'LA Lakers', tricode: 'LAL'}, team2: { name: 'GS Warriors', tricode: 'GSW'}, score1: 88, score2: 92, status: 'Live', time: 'Q4 02:30', venue: 'Crypto.com Arena' },
    { id: 'g2', sport: 'Soccer', league: 'La Liga', team1: { name: 'Real Madrid', tricode: 'RMA'}, team2: { name: 'FC Barcelona', tricode: 'FCB'}, score1: 1, score2: 1, status: 'Halftime', time: 'HT', venue: 'Santiago Bernabéu' },
    { id: 'g3', sport: 'Tennis', league: 'Grand Slam', team1: { name: 'Player A'}, team2: { name: 'Player B'}, score1: 2, score2: 1, status: 'Live', time: 'Set 3, Game 5', venue: 'Center Court' },
    { id: 'g4', sport: 'Hockey', league: 'NHL', team1: { name: 'NY Rangers', tricode: 'NYR'}, team2: { name: 'Boston Bruins', tricode: 'BOS'}, score1: 3, score2: 2, status: 'Ended', time: 'Final', venue: 'Madison Square Garden' },
    { id: 'g5', sport: 'Baseball', league: 'MLB', team1: { name: 'NY Yankees', tricode: 'NYY'}, team2: { name: 'Boston Red Sox', tricode: 'BOS'}, score1: 5, score2: 4, status: 'Live', time: 'Top 8th', venue: 'Yankee Stadium' },
    { id: 'g6', sport: 'Soccer', league: 'Premier League', team1: { name: 'Man City', tricode: 'MCI'}, team2: { name: 'Liverpool', tricode: 'LIV'}, score1: 0, score2: 0, status: 'Scheduled', time: 'Tomorrow 3 PM', venue: 'Etihad Stadium' },
  ];

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">Live Scores</h2>
      <div className="space-y-3.5 overflow-y-auto flex-grow pr-1">
        {games.map(game => (
          <div key={game.id} className="p-3.5 bg-slate-50 rounded-lg hover:shadow-md transition-shadow duration-200 border border-slate-200">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center space-x-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{game.sport}</p>
                {game.league && <p className="text-xs text-gray-500">{game.league}</p>}
              </div>
              <p className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                game.status === 'Live' ? 'bg-red-500 text-white animate-pulse' :
                game.status === 'Halftime' ? 'bg-yellow-400 text-gray-800' :
                game.status === 'Ended' ? 'bg-gray-400 text-gray-800' :
                game.status === 'Scheduled' ? 'bg-blue-400 text-white' :
                'bg-gray-300 text-gray-700' // Default
              }`}>
                {game.status}
              </p>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center my-2 gap-x-2"> {/* Adjusted grid for better team name spacing */}
              <div className="text-left">
                {/* Optional: Display team logo here */}
                <p className="text-sm font-medium text-slate-700 truncate" title={game.team1.name}>{game.team1.tricode || game.team1.name}</p>
              </div>
              <p className="text-xl font-bold text-slate-800 text-center">{game.score1} - {game.score2}</p>
              <div className="text-right">
                {/* Optional: Display team logo here */}
                <p className="text-sm font-medium text-slate-700 truncate" title={game.team2.name}>{game.team2.tricode || game.team2.name}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5">
                <span>{game.time || ''}</span>
                {game.venue && <span className="truncate" title={game.venue}>{game.venue}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveGameScores;
