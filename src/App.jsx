import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import GameVideo from './components/games/GameVideo'
import GameFinish from './components/games/GameFinish'
import Game1Build from './components/games/game1/Game1Build'
import Game1GamePlay from './components/games/game1/Game1GamePlay'
import Game2Build from './components/games/game2/Game2Build'
import Game2GamePlay from './components/games/game2/Game2GamePlay'
import Game3Build from './components/games/game3/Game3Build'
import Game3GamePlay from './components/games/game3/Game3GamePlay'
import Game4Build from './components/games/game4/Game4Build'
import Game4GamePlay from './components/games/game4/Game4GamePlay'
import Game5Build from './components/games/game5/Game5Build'
import Game5GamePlay from './components/games/game5/Game5GamePlay'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:gameNumber/video" element={<GameVideo />} />
      <Route path="/game/:gameNumber/finish" element={<GameFinish />} />
      <Route path="/game/1/build" element={<Game1Build />} />
      <Route path="/game/1/gameplay" element={<Game1GamePlay />} />
      <Route path="/game/2/build" element={<Game2Build />} />
      <Route path="/game/2/gameplay" element={<Game2GamePlay />} />
      <Route path="/game/3/build" element={<Game3Build />} />
      <Route path="/game/3/gameplay" element={<Game3GamePlay />} />
      <Route path="/game/4/build" element={<Game4Build />} />
      <Route path="/game/4/gameplay" element={<Game4GamePlay />} />
      <Route path="/game/5/build" element={<Game5Build />} />
      <Route path="/game/5/gameplay" element={<Game5GamePlay />} />
    </Routes>
  )
}

export default App
