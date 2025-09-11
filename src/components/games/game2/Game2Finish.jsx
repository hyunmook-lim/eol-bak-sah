import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Game2Finish.css'
import gameFinished from '../../../assets/images/game-finished.png'

function Game2Finish() {
  const navigate = useNavigate()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleBackToHome = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  const handleCancelExit = () => {
    setShowConfirmModal(false)
  }

  return (
    <div className="game2-finish-container">
      <header className="finish-header">
        <div></div>
        <h1>창문닦기 게임</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>
      
      <div className="finish-content">
        <div className="finish-image">
          <img src={gameFinished} alt="게임 완료" />
        </div>
        
        <div className="finish-buttons">
          <button className="replay-game-btn" onClick={() => navigate('/game/2/build')}>
            다시 하기
          </button>
          <button className="back-home-btn" onClick={handleBackToHome}>
            홈으로 돌아가기
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelExit}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>홈으로 돌아가시겠습니까?</h3>
              <p>게임이 종료됩니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmExit}>
                확인
              </button>
              <button className="cancel-btn" onClick={handleCancelExit}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game2Finish