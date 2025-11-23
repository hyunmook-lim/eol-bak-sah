import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game2GamePlay.css'
const dirtyWindow = '/images/dirty-window.png'
const cleaningHand = '/images/cleaning-hand.png'
const spray = '/images/spray.png'
const bubble = '/images/bubble.png'

function Game2GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = useMemo(() => location.state?.questions || [], [location.state?.questions])
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [roundStarted, setRoundStarted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isWiping, setIsWiping] = useState(false)
  const [brushSize, setBrushSize] = useState(25)
  const canvasRef = useRef(null)
  const [maskDataUrl, setMaskDataUrl] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [imageAspectRatio, setImageAspectRatio] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/2/build')
    }
  }, [questions, navigate])

  useEffect(() => {
    // 문제가 변경될 때 이미지 비율 리셋
    setImageAspectRatio(null)
  }, [currentQuestionIndex])

  const handleImageLoad = (e) => {
    const img = e.target
    const aspectRatio = img.naturalWidth / img.naturalHeight
    setImageAspectRatio(aspectRatio)
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

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleStartRound = () => {
    setRoundStarted(true)
    setShowAnswer(false)
    initializeCanvas()
  }

  const initializeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    setMaskDataUrl(canvas.toDataURL())
  }

  const drawOnCanvas = (x, y, isStarting = false) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    
    if (isStarting) {
      ctx.beginPath()
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI)
      ctx.fill()
    } else {
      // 항상 원을 그려서 연속적인 브러시 효과 만들기
      ctx.beginPath()
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    setMaskDataUrl(canvas.toDataURL())
  }

  const handleMouseMove = (event) => {
    event.preventDefault()
    const container = event.currentTarget
    const rect = container.getBoundingClientRect()
    const newPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
    setMousePosition(newPosition)
    
    if (isWiping) {
      drawOnCanvas(newPosition.x, newPosition.y, false)
    }
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
    if (roundStarted) {
      setIsWiping(true)
      const container = event.currentTarget
      const rect = container.getBoundingClientRect()
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      
      drawOnCanvas(position.x, position.y, true)
    }
  }

  const handleMouseUp = () => {
    setIsWiping(false)
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
    // 전체 캔버스를 클리어해서 덮고 있는 그림을 모두 제거
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setMaskDataUrl(canvas.toDataURL())
    }
  }

  const handleReset = () => {
    setShowAnswer(false)
    // 캔버스를 다시 검은색으로 초기화
    initializeCanvas()
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setRoundStarted(true) // 다음 문제에서는 바로 게임 시작
      setShowAnswer(false)
      // 새 문제로 넘어갈 때 캔버스 초기화
      setTimeout(() => {
        initializeCanvas()
      }, 50)
    } else {
      navigate('/game/2/finish')
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setRoundStarted(true) // 이전 문제로 갈 때도 바로 게임 시작
      setShowAnswer(false)
      // 이전 문제로 갈 때 캔버스 초기화
      setTimeout(() => {
        initializeCanvas()
      }, 50)
    }
  }

  const handleGameEnd = () => {
    navigate('/game/2/finish')
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (questions.length === 0) {
    return null
  }

  return (
    <div className="game2-gameplay-container">
      <header className="game-title-header">
        <div></div>
        <h1>창문닦기 게임</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>
      
      <div className="gameplay-container">
        {!gameStarted ? (
          <div className="game-start-section">
            <h2>게임을 시작하시겠습니까?</h2>
            <p>총 {questions.length}개의 문제가 준비되었습니다.</p>
            <button className="start-game-btn" onClick={handleStartGame}>
              게임 시작
            </button>
          </div>
        ) : (
          <div className="game-play-section">
            <div
              ref={containerRef}
              className={`photo-display-container ${roundStarted ? 'hide-cursor' : ''}`}
              style={{ aspectRatio: imageAspectRatio || 'auto' }}
              onMouseMove={roundStarted ? handleMouseMove : undefined}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img src={spray} alt="Spray" className="spray-decoration" />
              <img src={bubble} alt="Bubble" className="bubble-decoration" />

              <div className="question-image-wrapper">
                {currentQuestion && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt={`문제 ${currentQuestionIndex + 1}`}
                    className="question-image"
                    onLoad={handleImageLoad}
                  />
                )}
              </div>
              
              <div className="photo-overlay">
                <canvas 
                  ref={canvasRef}
                  className="mask-canvas"
                  style={{ display: 'none' }}
                />
                <div
                  className="finding-penguin-layer"
                  style={{
                    maskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none'
                  }}
                >
                  <img
                    src={dirtyWindow}
                    alt="Dirty Window"
                    className="finding-penguin-fullscreen"
                  />
                </div>
                <div 
                  className="dark-overlay"
                  style={{
                    maskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none'
                  }}
                ></div>
                {!roundStarted && (
                  <>
                    <div className="overlay-background"></div>
                    <div className="overlay-content">
                      <button className="overlay-start-btn" onClick={handleStartRound}>
                        게임 시작
                      </button>
                    </div>
                  </>
                )}
                {roundStarted && (
                  <img
                    src={cleaningHand}
                    alt="Cleaning Hand"
                    className="tissue-cursor"
                    style={{
                      left: mousePosition.x - brushSize,
                      top: mousePosition.y - brushSize,
                      width: brushSize * 2,
                      height: 'auto'
                    }}
                  />
                )}
              </div>
            </div>
            
            {showAnswer && (
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
              
              {roundStarted && (
                <div className="brush-size-control">
                  <img src={cleaningHand} alt="Cleaning Hand" className="brush-icon" />
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="brush-slider"
                  />
                </div>
              )}
              
              {roundStarted && (
                <div className="round-buttons">
                  <button className="reset-btn" onClick={handleReset}>
                    초기화
                  </button>
                  {!showAnswer ? (
                    <button className="reveal-answer-btn" onClick={handleShowAnswer}>
                      정답 확인하기
                    </button>
                  ) : (
                    <div className="answer-display-section">
                      <span className="answer-label">정답:</span>
                      <div className="answer-display-text">
                        {currentQuestion?.answer}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
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

export default Game2GamePlay