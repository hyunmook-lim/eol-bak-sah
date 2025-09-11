import { useNavigate } from 'react-router-dom'
import './Game5Video.css'

function Game5Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game5-video-container">
      <header className="game-title-header">
        <button onClick={handleBackToHome} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>게임 방법</h1>
        <button className="header-skip-btn">
          건너뛰기 <div className="arrow-right"></div>
        </button>
      </header>
      
      <div className="game-container">
        <div className="game-content">
          <h1 className="game-title">공통점 찾기</h1>
          <p className="game-description">
            팀원들과 함께 모든 사람이 가진 공통점을 찾아보는 게임입니다!
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>3-4명씩 팀을 나눕니다</li>
                <li>팀원 모두가 가진 공통점을 찾아야 합니다</li>
                <li>취미, 경험, 선호도 등 어떤 것이든 상관없습니다</li>
                <li>5분 안에 가장 많은 공통점을 찾은 팀이 승리!</li>
                <li>발표할 때는 재미있는 에피소드도 함께 나눠보세요</li>
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

export default Game5Video