import { useNavigate } from 'react-router-dom'
import './Game7Video.css'

function Game7Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game7-video-container">
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
          <h1 className="game-title">스무고개 인물편</h1>
          <p className="game-description">
            유명한 인물을 생각하고 다른 사람들이 질문으로 맞춰보는 게임입니다!
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>한 사람이 유명한 인물(연예인, 역사인물 등)을 생각합니다</li>
                <li>다른 참가자들이 yes/no로 답할 수 있는 질문을 합니다</li>
                <li>"살아있는 사람인가요?", "한국 사람인가요?" 등의 질문</li>
                <li>20개의 질문 안에 정답을 맞춰야 합니다</li>
                <li>정답을 맞춘 사람이 다음 출제자가 됩니다</li>
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

export default Game7Video