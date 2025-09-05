import { useNavigate } from 'react-router-dom'
import './Game3Video.css'

function Game3Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game3-video-container">
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
          <h1 className="game-title">인간 동물원</h1>
          <p className="game-description">
            각자가 좋아하는 동물의 특징을 몸짓으로 표현하고 맞춰보는 게임입니다!
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>각자 자신이 좋아하는 동물을 하나 정합니다</li>
                <li>그 동물의 특징적인 행동을 몸짓으로 표현합니다</li>
                <li>말은 하지 않고 몸짓과 소리만으로 표현해야 합니다</li>
                <li>다른 참가자들이 어떤 동물인지 맞춰봅니다</li>
                <li>가장 창의적인 표현을 한 사람이 승리!</li>
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

export default Game3Video