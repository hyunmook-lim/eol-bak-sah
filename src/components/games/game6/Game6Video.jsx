import { useNavigate } from 'react-router-dom'
import './Game6Video.css'

function Game6Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game6-video-container">
      <header className="game-title-header">
        <button onClick={handleBackToHome} className="header-back-btn">
          &lt;
        </button>
        <h1>게임 방법</h1>
        <button className="header-skip-btn">
          건너뛰기 &gt;
        </button>
      </header>
      
      <div className="game-container">
        <div className="game-content">
          <h1 className="game-title">감정 표현 게임</h1>
          <p className="game-description">
            다양한 감정을 표정과 몸짓으로 표현하고 맞춰보는 재미있는 게임입니다!
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>감정 카드를 하나씩 뽑습니다 (기쁨, 슬픔, 화남, 놀람 등)</li>
                <li>뽑은 감정을 말 없이 표정과 몸짓으로만 표현합니다</li>
                <li>다른 참가자들이 어떤 감정인지 맞춰봅니다</li>
                <li>맞춘 사람과 표현한 사람 모두 점수를 얻습니다</li>
                <li>가장 많은 점수를 얻은 사람이 승리!</li>
              </ul>
            </div>
            
            <div className="game-controls">
              <button className="play-btn">게임 시작하기</button>
              <button className="rules-btn">상세 규칙 보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game6Video