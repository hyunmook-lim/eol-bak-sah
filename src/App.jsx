import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import GamePage from './components/GamePage'
import Game1Video from './components/games/game1/Game1Video'
import Game1Build from './components/games/game1/Game1Build'
import Game1GamePlay from './components/games/game1/Game1GamePlay'
import Game1Finish from './components/games/game1/Game1Finish'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:gameId/video" element={<GamePage />} />
      <Route path="/game/1/video" element={<Game1Video />} />
      <Route path="/game/1/build" element={<Game1Build />} />
      <Route path="/game/1/gameplay" element={<Game1GamePlay />} />
      <Route path="/game/1/finish" element={<Game1Finish />} />
    </Routes>
  )
}

export default App
