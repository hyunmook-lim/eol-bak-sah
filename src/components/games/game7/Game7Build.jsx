import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game7Build.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game7Build() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cardPairs, setCardPairs] = useState(location.state?.pairs || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // 카드 쌍 생성 함수
  const createCardPair = (image = null) => {
    return {
      id: Date.now() + Math.random(),
      image: image
    }
  }

  const handleBackToVideo = () => {
    navigate('/game/7/video')
  }

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

  // 카드 쌍 삭제 함수
  const handleDeleteCardPair = (cardPairId) => {
    setCardPairs(cardPairs.filter(c => c.id !== cardPairId))
  }

  const handleComplete = () => {
    // 카드가 최소 3쌍 이상 있는지 체크
    if (cardPairs.length < 3) {
      alert('카드 쌍을 최소 3개 이상 추가해주세요.')
      return
    }

    // 이미지가 없는 카드가 있는지 체크
    const emptyCards = cardPairs.filter(c => !c.image)
    if (emptyCards.length > 0) {
      alert('모든 카드에 이미지를 추가해주세요.')
      return
    }

    // 게임 데이터 준비
    const gameData = {
      cardPairs: cardPairs.map((c, index) => ({
        id: c.id,
        number: index + 1,
        image: c.image
      }))
    }

    console.log('게임 데이터:', gameData)

    // 게임플레이 페이지로 이동하며 데이터 전달
    navigate('/game/7/gameplay', { state: gameData })
  }

  return (
    <LandscapeOnly>
    <div className="game7-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToVideo} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>메모리 카드 만들기</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>

      <div className="game-play-container">
        <div className="card-input-section">
          <div className="section-header">
            <div className="section-left">
              <h2>1. 사진 추가</h2>
              <div className="card-counter">
                <span className="current-count">{cardPairs.length}</span>
                <span className="separator"> /</span>
                <span className="total-count">16</span>
              </div>
            </div>
            <div className="section-description">
              <div className="description-left">
                <p>최소 3장</p>
                <p>최대 16장</p>
              </div>
              <div className="description-right">
                <p>게임카드는 정사각형으로 생성됩니다.</p>
                <p>저장한 사진의 2배수로 게임카드가 자동생성됩니다.  예) 사진 5장 저장 시, 카드 10장 생성</p>
              </div>
            </div>
          </div>
          <div className="divider"></div>

          <div className="main-drop-zone">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files)
                files.forEach(file => {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const newCardPair = createCardPair(event.target.result)
                    setCardPairs(prev => [...prev, newCardPair])
                  }
                  reader.readAsDataURL(file)
                })
                e.target.value = ''
              }}
            />
            <div className="main-drop-text">
              이 곳을 클릭하거나 파일을 드롭하여 사진을 추가하세요.
            </div>
          </div>

          <div className="cards-grid">
            {cardPairs.map((cardPair) => (
              <div key={cardPair.id} className="card-item">
                <img src={cardPair.image} alt="카드 이미지" />
                <button
                  className="delete-card-btn"
                  onClick={() => handleDeleteCardPair(cardPair.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="divider"></div>

          <div className="completion-section">
            <button
              className="complete-btn"
              onClick={handleComplete}
            >
              완료
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelExit}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>홈으로 돌아가시겠습니까?</h3>
              <p>작업 중인 내용이 저장되지 않을 수 있습니다.</p>
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
    </LandscapeOnly>
  )
}

export default Game7Build
