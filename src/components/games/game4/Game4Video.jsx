import { useNavigate } from 'react-router-dom'
import './Game4Video.css'

function Game4Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game4-video-container">
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
          <h1 className="game-title">이름 릴레이</h1>
          <p className="game-description">
            앞 사람의 이름 끝글자로 시작하는 단어를 말하는 릴레이 게임입니다!
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>첫 번째 사람이 자신의 이름을 말합니다</li>
                <li>다음 사람은 앞 사람 이름의 끝글자로 시작하는 단어를 말합니다</li>
                <li>그 다음 사람은 그 단어의 끝글자로 시작하는 새로운 단어를 말합니다</li>
                <li>이미 나온 단어는 다시 사용할 수 없습니다</li>
                <li>단어를 떠올리지 못하면 탈락!</li>
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

export default Game4Video