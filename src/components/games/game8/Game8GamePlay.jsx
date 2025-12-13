import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game8GamePlay.css'
import LandscapeOnly from '../../common/LandscapeOnly'
const findingPenguinImg = '/images/finding-penguin.png'

function Game8GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = useMemo(() => location.state?.questions || [], [location.state?.questions])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(0) // 0: 20x, 1: 15x, 2: 10x, 3: 8x, 4: 6x, 5: 4x, 6: 2x, 7: 1x (원본)
  const [showResult, setShowResult] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showStartGuide, setShowStartGuide] = useState(false)
  const [fadeOutGuide, setFadeOutGuide] = useState(false)
  const canvasRef = useRef(null)

  const zoomLevels = useMemo(() => [20, 15, 10, 8, 6, 4, 2, 1], [])

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

  // Canvas에 이미지 그리기
  useEffect(() => {
    if (!gameStarted || !currentQuestion || !imageLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = currentQuestion.imageUrl

    img.onload = () => {
      // 선택 영역의 중심점
      const centerX = currentQuestion.startX + currentQuestion.startWidth / 2
      const centerY = currentQuestion.startY + currentQuestion.startHeight / 2

      // 현재 줌 레벨
      const currentZoom = zoomLevels[zoomLevel]

      // 줌 레벨에 따라 보여줄 영역 크기 계산
      const viewWidth = (currentQuestion.startWidth * 20) / currentZoom
      const viewHeight = (currentQuestion.startHeight * 20) / currentZoom

      // 보여줄 영역의 시작점 (중심점 기준)
      let sourceX = centerX - viewWidth / 2
      let sourceY = centerY - viewHeight / 2

      // 이미지 경계를 벗어나지 않도록 조정
      sourceX = Math.max(0, Math.min(sourceX, img.naturalWidth - viewWidth))
      sourceY = Math.max(0, Math.min(sourceY, img.naturalHeight - viewHeight))

      // 캔버스 크기 설정 (컨테이너에 맞춤)
      const container = canvas.parentElement
      const containerRect = container.getBoundingClientRect()

      // 원본 비율 유지하면서 컨테이너에 맞춤
      const aspectRatio = currentQuestion.startWidth / currentQuestion.startHeight
      let canvasWidth, canvasHeight

      if (containerRect.width / containerRect.height > aspectRatio) {
        canvasHeight = containerRect.height
        canvasWidth = canvasHeight * aspectRatio
      } else {
        canvasWidth = containerRect.width
        canvasHeight = canvasWidth / aspectRatio
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        viewWidth,
        viewHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      )
    }
  }, [gameStarted, currentQuestion, imageLoaded, zoomLevel, zoomLevels])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  if (questions.length === 0) {
    return null
  }

  const handleBackToBuild = () => {
    setShowBackConfirmModal(true)
  }

  const handleConfirmBackToBuild = () => {
    setShowBackConfirmModal(false)
    navigate('/game/8/build', { state: { questions } })
  }

  const handleCancelBackToBuild = () => {
    setShowBackConfirmModal(false)
  }

  return (
    <LandscapeOnly>
    <div className="game8-gameplay-container">
      <header className="game-title-header">
        <button onClick={handleBackToBuild} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>돋보기 게임</h1>
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
                  <>
                    <img
                      src={currentQuestion.imageUrl}
                      alt={`문제 ${currentQuestionIndex + 1}`}
                      style={{ display: 'none' }}
                      onLoad={handleImageLoad}
                    />
                    <canvas
                      ref={canvasRef}
                      className="question-image"
                      onClick={handleImageClick}
                      style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in',
                        cursor: zoomLevel < zoomLevels.length - 1 && !showResult ? 'pointer' : 'default'
                      }}
                    />
                  </>
                )}
                {showStartGuide && (
                  <div className={`start-guide-overlay ${fadeOutGuide ? 'fade-out' : ''}`}>
                    <div className="start-guide-message">
                      사진을 클릭하면 이미지가 점점 드러나요!
                    </div>
                  </div>
                )}
                {showResult && (
                  <div className="answer-display">
                    <p className="answer-text">{currentQuestion?.answer}</p>
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

                <button
                  className="reveal-answer-btn"
                  onClick={handleSubmitAnswer}
                  style={{ visibility: showResult ? 'hidden' : 'visible' }}
                >
                  정답 확인하기
                </button>
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

      {showBackConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelBackToBuild}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>게임 만들기로 돌아가시겠습니까?</h3>
              <p>진행중인 게임은 저장되지 않습니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmBackToBuild}>
                확인
              </button>
              <button className="cancel-btn" onClick={handleCancelBackToBuild}>
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

export default Game8GamePlay
