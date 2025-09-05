import { useNavigate } from 'react-router-dom'
import './Game1Finish.css'
import gameFinished from '../../../assets/images/game-finished.png'

function Game1Finish() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game1-finish-container">
      <header className="finish-header">
        <div></div>
        <h1>슝 글자 게임 완료!</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>
      
      <div className="finish-content">
        <div className="finish-image">
          <img src={gameFinished} alt="게임 완료" />
        </div>
        
        <div className="finish-buttons">
          <button className="replay-game-btn" onClick={() => navigate('/game/1/build')}>
            다시 하기
          </button>
          <button className="back-home-btn" onClick={handleBackToHome}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Game1Finish