import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game8GamePlay.css'
import findingPenguinImg from '../../../assets/images/finding-penguin.png'

function Game8GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = location.state?.questions || []

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(0) // 0: 20x, 1: 15x, 2: 10x, 3: 8x, 4: 6x, 5: 4x, 6: 2x, 7: 1x (원본)
  const [showResult, setShowResult] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showStartGuide, setShowStartGuide] = useState(false)
  const [fadeOutGuide, setFadeOutGuide] = useState(false)

  const zoomLevels = [20, 15, 10, 8, 6, 4, 2, 1]

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/8/build')
    }
  }, [questions, navigate])

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

  const handleStartGame = () => {
    setGameStarted(true)
    setShowStartGuide(true)
    setFadeOutGuide(false)

    // 2초 후 페이드아웃 시작
    setTimeout(() => {
      setFadeOutGuide(true)
    }, 2000)

    // 페이드아웃 애니메이션 완료 후 제거 (2초 + 0.5초)
    setTimeout(() => {
      setShowStartGuide(false)
      setFadeOutGuide(false)
    }, 2500)
  }

  const handleSubmitAnswer = () => {
    // 정답 표시 및 원본 이미지로 변경
    setShowResult(true)
    setZoomLevel(zoomLevels.length - 1) // 원본 이미지로 변경 (마지막 인덱스 = 1배)
  }

  const handleImageClick = () => {
    if (zoomLevel < zoomLevels.length - 1 && !showResult) {
      setZoomLevel(zoomLevel + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowResult(false)
      setZoomLevel(0) // 다음 문제로 넘어갈 때 줌 레벨 리셋
      setImageLoaded(false) // 이미지 로드 상태 리셋
    } else {
      navigate('/game/8/finish')
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowResult(false)
      setZoomLevel(0) // 이전 문제로 돌아갈 때 줌 레벨 리셋
      setImageLoaded(false) // 이미지 로드 상태 리셋
    }
  }

  const handleGameEnd = () => {
    navigate('/game/8/finish')
  }

  const currentQuestion = questions[currentQuestionIndex]

  // 이미지 줌 스타일 계산
  const getImageStyle = () => {
    if (!currentQuestion || !gameStarted) return { opacity: 0 }

    const currentZoom = zoomLevels[zoomLevel]

    // 이미지가 로드되기 전에는 숨김
    if (!imageLoaded) {
      return {
        opacity: 0,
        transform: `scale(${currentZoom})`
      }
    }

    // Build2에서 저장한 실제 이미지 좌표를 사용
    // startX, startY는 픽셀 좌표이고, startWidth, startHeight는 박스 크기
    // 선택 영역의 중심점을 계산
    const centerX = currentQuestion.startX + currentQuestion.startWidth / 2
    const centerY = currentQuestion.startY + currentQuestion.startHeight / 2

    // 이미지 요소를 찾아서 실제 크기 확인
    const imgElement = document.querySelector('.question-image')
    if (!imgElement || !imgElement.naturalWidth || !imgElement.naturalHeight) {
      return { opacity: 0 }
    }

    // 실제 이미지 크기 기준으로 퍼센트 계산
    const xPercent = (centerX / imgElement.naturalWidth) * 100
    const yPercent = (centerY / imgElement.naturalHeight) * 100

    return {
      opacity: 1,
      transform: `scale(${currentZoom})`,
      transformOrigin: `${xPercent}% ${yPercent}%`,
      transition: zoomLevel === 0 ? 'opacity 0.1s ease-in' : 'transform 0.5s ease-out, opacity 0.1s ease-in',
      cursor: zoomLevel < zoomLevels.length - 1 ? 'pointer' : 'default'
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    // 디버깅: 좌표 정보 확인
    if (currentQuestion) {
      console.log('Question data:', {
        startX: currentQuestion.startX,
        startY: currentQuestion.startY,
        startWidth: currentQuestion.startWidth,
        startHeight: currentQuestion.startHeight,
        answer: currentQuestion.answer
      })

      const imgElement = document.querySelector('.question-image')
      if (imgElement) {
        const centerX = currentQuestion.startX + currentQuestion.startWidth / 2
        const centerY = currentQuestion.startY + currentQuestion.startHeight / 2
        const xPercent = (centerX / imgElement.naturalWidth) * 100
        const yPercent = (centerY / imgElement.naturalHeight) * 100

        console.log('Image info:', {
          naturalWidth: imgElement.naturalWidth,
          naturalHeight: imgElement.naturalHeight,
          centerX,
          centerY,
          xPercent,
          yPercent
        })
      }
    }
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <div className="game8-gameplay-container">
      <header className="game-title-header">
        <div></div>
        <h1>이미지 맞추기 게임</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>

      <div className="gameplay-container">
        <div className="game-play-section">
            <div className="photo-display-container">
              {!gameStarted ? (
                <>
                  <img
                    src={findingPenguinImg}
                    alt="게임 시작"
                    className="question-image"
                  />
                  <div className="game-start-overlay">
                    <button className="game-start-button" onClick={handleStartGame}>
                      게임 시작
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {currentQuestion && (
                    <img
                      src={currentQuestion.imageUrl}
                      alt={`문제 ${currentQuestionIndex + 1}`}
                      className="question-image"
                      style={getImageStyle()}
                      onClick={handleImageClick}
                      onLoad={handleImageLoad}
                    />
                  )}
                  {showStartGuide && (
                    <div className={`start-guide-overlay ${fadeOutGuide ? 'fade-out' : ''}`}>
                      <div className="start-guide-message">
                        사진을 클릭하면 이미지가 점점 드러나요!
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {showResult && (
              <div className="navigation-buttons">
                {currentQuestionIndex > 0 && (
                  <div className="nav-button-container">
                    <div className="nav-tooltip">이전 문제</div>
                    <button className="prev-arrow-btn" onClick={handlePreviousQuestion}>
                      <span className="arrow-icon">←</span>
                    </button>
                  </div>
                )}
                {currentQuestionIndex < questions.length - 1 ? (
                  <div className="nav-button-container">
                    <div className="nav-tooltip">다음 문제</div>
                    <button className="next-arrow-btn" onClick={handleNextQuestion}>
                      <span className="arrow-icon">→</span>
                    </button>
                  </div>
                ) : (
                  <div className="nav-button-container">
                    <div className="nav-tooltip">엔딩보기</div>
                    <button className="next-arrow-btn" onClick={handleGameEnd}>
                      <span className="arrow-icon">→</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="game-utilities">
              <div className="round-counter">
                <span className="current-round">{currentQuestionIndex + 1}</span> / {questions.length}
              </div>

              {gameStarted && (
                <>
                  <div className="zoom-progress-bar">
                    <div
                      className="zoom-progress-fill"
                      style={{ width: `${((zoomLevel + 1) / zoomLevels.length) * 100}%` }}
                    ></div>
                  </div>

                  {!showResult ? (
                    <div className="answer-reveal-section">
                      <span className="answer-label">정답:</span>
                      <button className="reveal-answer-btn" onClick={handleSubmitAnswer}>
                        정답 확인하기
                      </button>
                    </div>
                  ) : (
                    <div className="answer-display-section">
                      <span className="answer-label">정답:</span>
                      <div className="answer-display">
                        {currentQuestion.answer}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
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

export default Game8GamePlay
