import { useNavigate, useParams } from 'react-router-dom'
import './GameVideo.css'

function GameVideo({ gameVideos }) {
  const navigate = useNavigate()
  const { gameNumber } = useParams()

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
              <video controls width="100%" height="100%">
                <source src={videoUrl} type="video/mp4" />
                게임 방법 동영상을 재생할 수 없습니다.
              </video>
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