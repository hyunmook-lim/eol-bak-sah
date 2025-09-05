import { useNavigate } from 'react-router-dom'
import './Game2Video.css'

function Game2Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game2-video-container">
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
          <h1 className="game-title">두 가지 진실과 한 가지 거짓</h1>
          <p className="game-description">
            자신에 대한 세 가지 이야기 중 하나는 거짓말! 다른 사람들이 맞춰보는 게임입니다.
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>각자 자신에 대한 세 가지 이야기를 준비합니다</li>
                <li>이 중 두 가지는 진실, 한 가지는 거짓말이어야 합니다</li>
                <li>순서대로 자신의 세 가지 이야기를 발표합니다</li>
                <li>다른 참가자들이 어떤 것이 거짓말인지 맞춰봅니다</li>
                <li>가장 많은 사람을 속인 사람이 승리!</li>
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

export default Game2Video