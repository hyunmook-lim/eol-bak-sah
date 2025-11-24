import { useNavigate, useParams } from 'react-router-dom'
import { useState, useRef } from 'react'
import './GameVideo.css'

function GameVideo({ gameVideos }) {
  const navigate = useNavigate()
  const { gameNumber } = useParams()
  const videoRef = useRef(null)
  const [showOverlay, setShowOverlay] = useState(false)

  // 게임 번호에 해당하는 비디오 URL 가져오기
  const videoUrl = gameVideos?.[gameNumber]

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
                  autoPlay
                  width="100%"
                  height="100%"
                  onEnded={handleVideoEnded}
                >
                  <source src={videoUrl} type="video/mp4" />
                  게임 방법 동영상을 재생할 수 없습니다.
                </video>
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

export default GameVideo