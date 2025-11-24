import { useState, useEffect, useRef } from 'react'
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
import GlobalUtilityBar from './components/common/GlobalUtilityBar'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isMusicEnabled, setIsMusicEnabled] = useState(true)
  const isSoundEnabledRef = useRef(isSoundEnabled)
  const audioRef = useRef(null)

  useEffect(() => {
    isSoundEnabledRef.current = isSoundEnabled
  }, [isSoundEnabled])

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev)
  }

  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev)
  }

  // 배경음악 초기화 및 자동재생
  useEffect(() => {
    // Audio 인스턴스 생성
    const audio = new Audio('/sounds/background-music.mp3')
    audio.loop = true
    audio.volume = 0.1
    audioRef.current = audio

    // 자동재생 시도 함수
    const attemptPlay = async () => {
      try {
        await audio.play()
        console.log('Music started')
      } catch {
        console.log('Autoplay blocked, will start on first interaction')
      }
    }

    // 사용자 인터랙션 핸들러
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
        // 한 번만 실행되도록 이벤트 제거
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('keydown', handleFirstInteraction)
      }
    }

    // 자동재생 시도
    attemptPlay()

    // 자동재생 실패 대비 이벤트 리스너 등록
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    }
  }, [])

  // 음악 ON/OFF 처리
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isMusicEnabled) {
      audio.muted = false
      // 멈춰있으면 재생
      if (audio.paused) {
        audio.play().catch(() => console.log('Cannot play music'))
      }
    } else {
      audio.muted = true
    }
  }, [isMusicEnabled])

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

    // 전역 클릭 사운드 설정
    const clickSound = new Audio('/sounds/click.wav')
    clickSound.preload = 'auto'

    const handleGlobalClick = (e) => {
      if (!isSoundEnabledRef.current) return

      // 클릭된 요소가 버튼이거나, 버튼의 자식 요소인지 확인
      const target = e.target.closest('button, a, [role="button"], .clickable')

      if (target) {
        // 소리 재생 (cloneNode를 사용하여 빠르게 연속 클릭 시에도 소리가 겹쳐서 나도록 함)
        const soundClone = clickSound.cloneNode()
        soundClone.play().catch(err => console.log('Audio play failed:', err))
      }
    }

    window.addEventListener('click', handleGlobalClick)

    return () => {
      window.removeEventListener('load', handleLoad)
      window.removeEventListener('click', handleGlobalClick)
    }
  }, [])

  // 게임별 비디오 URL 매핑
  const gameVideos = {
    1: '/videos/game1video.mp4',
    2: '/videos/game2video.mp4',
    3: '/videos/game3video.mp4',
    4: '/videos/game4video.mp4',
    5: '/videos/game5video.mp4',
    6: '/videos/game6video.mp4',
    7: '/videos/game7video.mp4',
    8: '/videos/game8video.mp4',
    9: '/videos/game9video.mp4'
  }

  return (
    <>
      {isLoading && <Loading />}
      <GlobalUtilityBar
        isSoundEnabled={isSoundEnabled}
        toggleSound={toggleSound}
        isMusicEnabled={isMusicEnabled}
        toggleMusic={toggleMusic}
      />
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
