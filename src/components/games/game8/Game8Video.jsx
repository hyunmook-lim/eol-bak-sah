import { useNavigate } from 'react-router-dom'
import './Game8Video.css'

function Game8Video() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="game8-video-container">
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
          <h1 className="game-title">초성 퀴즈</h1>
          <p className="game-description">
            주어진 초성으로 단어를 맞춰보는 두뇌 회전 게임입니다!
          </p>
          
          <div className="game-area">
            <div className="game-instructions">
              <h3>게임 방법</h3>
              <ul>
                <li>출제자가 단어의 초성만 알려줍니다 (예: ㅅㄱㅅㅎ)</li>
                <li>참가자들이 초성에 맞는 단어를 맞춰봅니다</li>
                <li>카테고리를 정해서 진행할 수도 있습니다 (음식, 동물, 영화 등)</li>
                <li>가장 먼저 정답을 말한 사람이 점수를 얻습니다</li>
                <li>다음 문제는 정답자가 출제합니다</li>
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

export default Game8Video