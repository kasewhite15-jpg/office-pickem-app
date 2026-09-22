import React, { useState } from 'react';
import { 
  Trophy, ChevronUp, ChevronDown, Save, Check, 
  Gamepad2, Dumbbell, Shield, Sparkles, ArrowRight, ArrowLeft
} from 'lucide-react';

// Sample available game lobbies on your platform
const GAME_LOBBIES = [
  {
    id: 'nfl-confidence',
    title: 'NFL Weekly Confidence Pool',
    sport: 'Football',
    type: 'Confidence (1-10)',
    gamesCount: 10,
    status: 'Active • Week 1',
    description: 'Rank 10 games from most confident (10 pts) to least confident (1 pt). Highest cumulative score wins.',
    badge: 'Popular',
    enabled: true
  },
  {
    id: 'nba-spread',
    title: 'NBA Against the Spread',
    sport: 'Basketball',
    type: 'Spread Pick Em',
    gamesCount: 8,
    status: 'Opening Soon',
    description: 'Pick game winners against daily point spreads to earn leaderboard points.',
    badge: 'Coming Soon',
    enabled: false
  },
  {
    id: 'pga-tour',
    title: 'PGA Golf Showdown',
    sport: 'Golf',
    type: 'Tiered Selection',
    gamesCount: 6,
    status: 'Opening Soon',
    description: 'Select one golfer per tier. Earn points based on real-time tournament leaderboard positioning.',
    badge: 'Coming Soon',
    enabled: false
  }
];

const INITIAL_CONFIDENCE_GAMES = [
  { id: 1, home: 'Kansas City Chiefs', away: 'Baltimore Ravens', spread: 'KC -3.0', status: 'final', homeScore: 27, awayScore: 20, winner: 'Kansas City Chiefs', time: 'Thu 8:20 PM' },
  { id: 2, home: 'Philadelphia Eagles', away: 'Green Bay Packers', spread: 'PHI -2.5', status: 'final', homeScore: 34, awayScore: 29, winner: 'Philadelphia Eagles', time: 'Fri 8:15 PM' },
  { id: 3, home: 'Atlanta Falcons', away: 'Pittsburgh Steelers', spread: 'ATL -3.5', status: 'live', homeScore: 10, awayScore: 12, quarter: 'Q3 04:15', time: 'Sun 1:00 PM' },
  { id: 4, home: 'Buffalo Bills', away: 'Arizona Cardinals', spread: 'BUF -6.5', status: 'scheduled', homeScore: 0, awayScore: 0, time: 'Sun 1:00 PM' },
  { id: 5, home: 'Chicago Bears', away: 'Tennessee Titans', spread: 'CHI -3.5', status: 'scheduled', homeScore: 0, awayScore: 0, time: 'Sun 1:00 PM' },
  { id: 6, home: 'Cincinnati Bengals', away: 'New England Patriots', spread: 'CIN -8.5', status: 'scheduled', homeScore: 0, awayScore: 0, time: 'Sun 1:00 PM' },
  { id: 7, home: 'Miami Dolphins', away: 'Jacksonville Jaguars', spread: 'MIA -3.5', status: 'scheduled', homeScore: 0, awayScore: 0, time: 'Sun 1:00 PM' },
  { id: 8, home: 'Seattle Seahawks', away: 'Denver Broncos', spread: 'SEA -6.0', status: 'scheduled', homeScore: 0, awayScore: 0, time: 'Sun 4:05 PM' },
  { id: 9, home: 'Cleveland Browns', away: 'Dallas Cowboys', spread: 'CLE -2.5', status: 'scheduled', homeScore: 0, awayScore: 0, time: 'Sun 4:25 PM' },
  { id: 10, home: 'San Francisco 49ers', away: 'New York Jets', spread: 'SF -4.5', status: 'scheduled', homeScore: 0, awayScore: 0, time: 'Mon 8:15 PM' },
];

export default function App() {
  const [selectedGameId, setSelectedGameId] = useState(null); // null = Homepage Hub
  const [activeTab, setActiveTab] = useState('picks');
  const [tiebreaker, setTiebreaker] = useState('45');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [games] = useState(INITIAL_CONFIDENCE_GAMES);
  const [picks, setPicks] = useState({
    1: { team: 'Kansas City Chiefs', confidence: 10 },
    2: { team: 'Philadelphia Eagles', confidence: 9 },
    3: { team: 'Atlanta Falcons', confidence: 8 },
    4: { team: 'Buffalo Bills', confidence: 7 },
    5: { team: 'Chicago Bears', confidence: 6 },
    6: { team: 'Cincinnati Bengals', confidence: 5 },
    7: { team: 'Miami Dolphins', confidence: 4 },
    8: { team: 'Seattle Seahawks', confidence: 3 },
    9: { team: 'Cleveland Browns', confidence: 2 },
    10: { team: 'San Francisco 49ers', confidence: 1 },
  });

  const handleSelectTeam = (gameId, team) => {
    setPicks(prev => ({
      ...prev,
      [gameId]: { ...(prev[gameId] || { confidence: 1 }), team }
    }));
  };

  const handleSwapConfidence = (gameId, direction) => {
    const currentConf = picks[gameId]?.confidence;
    if (!currentConf) return;
    const targetConf = direction === 'up' ? currentConf + 1 : currentConf - 1;
    if (targetConf < 1 || targetConf > 10) return;

    const targetGameId = Object.keys(picks).find(id => picks[id]?.confidence === targetConf);

    setPicks(prev => {
      const updated = { ...prev };
      updated[gameId] = { ...updated[gameId], confidence: targetConf };
      if (targetGameId) {
        updated[targetGameId] = { ...updated[targetGameId], confidence: currentConf };
      }
      return updated;
    });
  };

  const calculatePoints = () => {
    let earned = 0;
    let maxPossible = 55;
    games.forEach(g => {
      const userPick = picks[g.id];
      if (g.status === 'final' && userPick) {
        if (userPick.team === g.winner) {
          earned += userPick.confidence;
        } else {
          maxPossible -= userPick.confidence;
        }
      }
    });
    return { earned, maxPossible };
  };

  const { earned, maxPossible } = calculatePoints();

  const handleSavePicks = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div 
            onClick={() => setSelectedGameId(null)} 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
          >
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">Pick 'Em Arena</h1>
              <p className="text-xs text-slate-400">Multi-Sport Pick 'Em Games</p>
            </div>
          </div>

          {selectedGameId && (
            <button
              onClick={() => setSelectedGameId(null)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              All Games
            </button>
          )}
        </div>
      </header>

      {/* Main View Switcher */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {!selectedGameId ? (
          /* HOMEPAGE GAME LOBBY SELECTION */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white">Select a Pick 'Em Game</h2>
              <p className="text-sm text-slate-400 mt-1">Choose a game lobby below to enter your pick sheet and view live standings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAME_LOBBIES.map((lobby) => (
                <div 
                  key={lobby.id}
                  className={`bg-slate-900/80 border rounded-2xl p-6 flex flex-col justify-between transition ${
                    lobby.enabled 
                      ? 'border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90' 
                      : 'border-slate-800/50 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {lobby.sport}
                      </span>
                      <span className="text-xs text-slate-400">{lobby.badge}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{lobby.title}</h3>
                    <p className="text-xs font-semibold text-slate-400 mb-3">{lobby.type} • {lobby.gamesCount} Matches</p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">{lobby.description}</p>
                  </div>

                  <button
                    disabled={!lobby.enabled}
                    onClick={() => setSelectedGameId(lobby.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${
                      lobby.enabled 
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {lobby.enabled ? 'Play Game' : 'Coming Soon'}
                    {lobby.enabled && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* NFL CONFIDENCE GAME VIEW */
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">NFL Weekly Confidence Pool</h2>
                <p className="text-xs text-slate-400 mt-0.5">Week 1 • 10 Games • Max 55 Points</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('picks')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'picks' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  My Pick Sheet
                </button>
                <button
                  onClick={() => setActiveTab('standings')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'standings' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  Leaderboard
                </button>
              </div>
            </div>

            {activeTab === 'picks' ? (
              <div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Points Earned</div>
                      <div className="text-2xl font-black text-emerald-400">{earned} <span className="text-xs text-slate-500 font-normal">/ 55</span></div>
                    </div>
                    <div className="h-8 w-px bg-slate-800" />
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Max Remaining</div>
                      <div className="text-2xl font-black text-slate-200">{maxPossible} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">MNF Score:</span>
                      <input
                        type="number"
                        value={tiebreaker}
                        onChange={(e) => setTiebreaker(e.target.value)}
                        className="w-16 bg-slate-950 border border-slate-800 text-emerald-400 text-center font-bold py-1 px-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      onClick={handleSavePicks}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
                    >
                      {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {savedSuccess ? 'Saved!' : 'Save Picks'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {games.map((game) => {
                    const userPick = picks[game.id] || { team: null, confidence: 1 };
                    const isWinner = game.status === 'final' && userPick.team === game.winner;
                    const isLoser = game.status === 'final' && userPick.team !== game.winner;

                    return (
                      <div 
                        key={game.id}
                        className={`bg-slate-900/80 border rounded-2xl p-4 transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${
                          isWinner ? 'border-emerald-500/40 bg-emerald-950/10' : 
                          isLoser ? 'border-rose-500/30 bg-rose-950/10' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 min-w-[60px]">
                            <span className="text-lg font-black text-emerald-400">{userPick.confidence}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500">Pts</span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleSwapConfidence(game.id, 'up')}
                              disabled={userPick.confidence === 10}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSwapConfidence(game.id, 'down')}
                              disabled={userPick.confidence === 1}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 font-semibold">{game.time}</span>
                              {game.status === 'final' && <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded">FINAL</span>}
                              {game.status === 'live' && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30 animate-pulse">LIVE</span>}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">Spread: {game.spread}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                          <button
                            onClick={() => game.status !== 'final' && handleSelectTeam(game.id, game.away)}
                            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
                              userPick.team === game.away
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {game.away} {game.status !== 'scheduled' && <span className="ml-1 opacity-75">({game.awayScore})</span>}
                          </button>

                          <span className="text-xs font-bold text-slate-600">@</span>

                          <button
                            onClick={() => game.status !== 'final' && handleSelectTeam(game.id, game.home)}
                            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
                              userPick.team === game.home
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {game.home} {game.status !== 'scheduled' && <span className="ml-1 opacity-75">({game.homeScore})</span>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  Weekly Leaderboard
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Rank</th>
                        <th className="pb-3 font-semibold">Player</th>
                        <th className="pb-3 font-semibold text-center">Correct</th>
                        <th className="pb-3 font-semibold text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="text-white">
                        <td className="py-3 font-bold text-emerald-400">#1</td>
                        <td className="py-3 font-semibold flex items-center gap-2">
                          You
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">YOU</span>
                        </td>
                        <td className="py-3 text-center">2 / 2</td>
                        <td className="py-3 text-right font-black text-emerald-400">{earned} pts</td>
                      </tr>
                      <tr className="text-slate-300">
                        <td className="py-3 font-semibold text-slate-500">#2</td>
                        <td className="py-3">Sarah M.</td>
                        <td className="py-3 text-center">2 / 2</td>
                        <td className="py-3 text-right font-bold">17 pts</td>
                      </tr>
                      <tr className="text-slate-300">
                        <td className="py-3 font-semibold text-slate-500">#3</td>
                        <td className="py-3">Dave K.</td>
                        <td className="py-3 text-center">1 / 2</td>
                        <td className="py-3 text-right font-bold">10 pts</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
