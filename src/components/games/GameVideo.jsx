import { useNavigate, useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import LandscapeOnly from '../common/LandscapeOnly'
import './GameVideo.css'

const gameImages = {
  1: ['/images/running-penguin.png', '/images/question-mark.png', '/images/background.png'],
  2: ['/images/dirty-window.png', '/images/cleaning-hand.png', '/images/spray.png', '/images/bubble.png', '/images/background_cleaning_window.png'],
  3: ['/images/running-penguin.png', '/images/question-mark.png', '/images/question-ice.png', '/images/background.png'],
  4: ['/images/question-mark.png', '/images/question-ice.png', '/images/background.png'],
  5: ['/images/king-se-jong.png', '/images/background-first-char.png', '/images/first-char-plate.png'],
  6: ['/images/answer-is-o.png', '/images/answer-is-x.png', '/images/ox-penguin.png', '/images/background-ox-quiz.png'],
  7: ['/images/question-mark-3d.png', '/images/penguin-foot.png', '/images/background-flipped-card.png'],
  8: ['/images/background.png', '/images/finding-penguin.png'],
  9: ['/images/fight-penguin-blue.png', '/images/fight-penguin-red.png', '/images/vote-black.png', '/images/vote-red.png', '/images/crown.png', '/images/stage.png', '/images/background-vote.png', '/images/background-vote-result.png']
}


function GameVideoContent({ gameVideos }) {
  const navigate = useNavigate()
  const { gameNumber } = useParams()
  const videoRef = useRef(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showIntroMessage, setShowIntroMessage] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // 게임 번호에 해당하는 비디오 URL 가져오기
  const videoUrl = gameVideos?.[gameNumber]

  // 이미지 프리로딩
  useEffect(() => {
    const imagesToPreload = gameImages[gameNumber] || []
    imagesToPreload.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [gameNumber])


  // 2초 후 페이드아웃 시작, 페이드아웃 완료 후 메시지 제거 및 비디오 자동재생
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true)
      // 페이드아웃 애니메이션 완료 후 메시지 제거 및 비디오 재생
      setTimeout(() => {
        setShowIntroMessage(false)
        if (videoRef.current) {
          videoRef.current.play().catch(err => console.log('Auto-play prevented:', err))
        }
      }, 500) // CSS transition 시간과 동일
    }, 2000)

    return () => clearTimeout(fadeOutTimer)
  }, [])

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  const handleSkip = () => {
    navigate(`/game/${gameNumber}/build`)
  }

  const handleVideoEnded = () => {
    setShowOverlay(true)
  }

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setShowOverlay(false)
    }
  }

  return (
    <div className="game-video-container">
      <header className="game-title-header">
        <button onClick={handleBackToHome} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>게임 방법</h1>
        <button onClick={handleSkip} className="header-skip-btn">
          건너뛰기 <div className="arrow-right"></div>
        </button>
      </header>
      
      <div className="video-container">
        <div className="video-wrapper">
          <div className="video-placeholder">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  controls
                  width="100%"
                  height="100%"
                  onEnded={handleVideoEnded}
                >
                  <source src={videoUrl} type="video/mp4" />
                  게임 방법 동영상을 재생할 수 없습니다.
                </video>
                {showIntroMessage && (
                  <div className={`intro-message-overlay ${isFadingOut ? 'fade-out' : ''}`}>
                    <div className="intro-message">
                      <h2>게임 방법을 알려드릴게요!</h2>
                    </div>
                  </div>
                )}
                {showOverlay && (
                  <div className="video-overlay">
                    <div className="overlay-buttons">
                      <button onClick={handleReplay} className="overlay-btn replay-btn">
                        다시 보기
                      </button>
                      <button onClick={handleSkip} className="overlay-btn build-btn">
                        게임 만들기
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p>게임 방법 동영상이 여기에 들어갑니다</p>
                <div className="video-icon">📹</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GameVideo({ gameVideos }) {
  return (
    <LandscapeOnly mountOnlyInLandscape={true}>
      <GameVideoContent gameVideos={gameVideos} />
    </LandscapeOnly>
  )
}

export default GameVideo