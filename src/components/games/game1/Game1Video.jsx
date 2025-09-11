import { useNavigate } from 'react-router-dom'
import './Game1Video.css'

function Game1Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game1-video-container">
      <header className="game-title-header">
        <button onClick={handleBackToHome} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>게임 방법</h1>
        <button onClick={() => navigate('/game/1/build')} className="header-skip-btn">
          건너뛰기 <div className="arrow-right"></div>
        </button>
      </header>
      
      <div className="video-container">
        <div className="video-wrapper">
          <div className="video-placeholder">
            <p>게임 방법 동영상이 여기에 들어갑니다</p>
            <div className="video-icon">📹</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game1Video