import { useNavigate } from 'react-router-dom'
import './Game9Video.css'

function Game9Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game9-video-container">
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
          <h1 className="game-title">팀 미션 챌린지</h1>
          <p className="game-description">
            팀워크가 필요한 다양한 미션을 수행하는 협동 게임입니다!
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>팀을 나누고 각 팀에게 미션 카드를 줍니다</li>
                <li>미션 예: "팀원들과 함께 탑 쌓기", "릴레이로 그림 완성하기" 등</li>
                <li>각 미션마다 제한시간이 있습니다</li>
                <li>미션 성공 시 점수를 획득합니다</li>
                <li>모든 미션을 마친 후 가장 높은 점수를 얻은 팀이 승리!</li>
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

export default Game9Video