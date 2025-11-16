import { useState, useEffect } from 'react'
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
import Game6Build from './components/games/game6/Game6Build'
import Game6GamePlay from './components/games/game6/Game6GamePlay'
import Game7Build from './components/games/game7/Game7Build'
import Game7Gameplay from './components/games/game7/Game7Gameplay'
import Game8Build from './components/games/game8/Game8Build'
import Game8Build2 from './components/games/game8/Game8Build2'
import Game8GamePlay from './components/games/game8/Game8GamePlay'
import Loading from './components/Loading'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지가 완전히 로드되면 로딩 상태를 false로 변경
    const handleLoad = () => {
      setIsLoading(false)
    }

    // 이미 로드가 완료되었으면 즉시 실행
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => window.removeEventListener('load', handleLoad)
  }, [])

  // 게임별 비디오 URL 매핑
  const gameVideos = {
    1: '/src/assets/video/game1video.mov',
    2: '/src/assets/video/game2video.mov',
    3: '/src/assets/video/game3video.mov',
    4: '/src/assets/video/game4video.mov',
    5: '/src/assets/video/game5video.mov',
    6: '/src/assets/video/game6video.mov',
    7: '/src/assets/video/game7video.mov',
    8: '/src/assets/video/game8video.mov',
    9: '/src/assets/video/game9video.mov'
  }

  return (
    <>
      {isLoading && <Loading />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/game/:gameNumber/video"
          element={<GameVideo gameVideos={gameVideos} />}
        />
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
        <Route path="/game/6/build" element={<Game6Build />} />
        <Route path="/game/6/gameplay" element={<Game6GamePlay />} />
        <Route path="/game/7/build" element={<Game7Build />} />
        <Route path="/game/7/gameplay" element={<Game7Gameplay />} />
        <Route path="/game/8/build" element={<Game8Build />} />
        <Route path="/game/8/build2" element={<Game8Build2 />} />
        <Route path="/game/8/gameplay" element={<Game8GamePlay />} />
      </Routes>
    </>
  )
}

export default App
