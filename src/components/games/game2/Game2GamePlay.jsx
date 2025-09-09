import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game2GamePlay.css'
import findingPenguin from '../../../assets/images/finding-penguin.png'
import tissue from '../../../assets/images/tissue.png'

function Game2GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = location.state?.questions || []
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [roundStarted, setRoundStarted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isWiping, setIsWiping] = useState(false)
  const [brushSize, setBrushSize] = useState(25)
  const canvasRef = useRef(null)
  const [maskDataUrl, setMaskDataUrl] = useState(null)

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/2/build')
    }
  }, [questions, navigate])

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
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
      setRoundStarted(false)
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
      setRoundStarted(false)
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
      </header>ㅈ
      
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
              className={`photo-display-container ${roundStarted ? 'hide-cursor' : ''}`}
              onMouseMove={roundStarted ? handleMouseMove : undefined}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {currentQuestion && (
                <img 
                  src={currentQuestion.imageUrl} 
                  alt={`문제 ${currentQuestionIndex + 1}`}
                  className="question-image"
                />
              )}
              
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
                    src={findingPenguin} 
                    alt="Finding Penguin" 
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
                    src={tissue}
                    alt="Tissue"
                    className="tissue-cursor"
                    style={{
                      left: mousePosition.x - brushSize,
                      top: mousePosition.y - brushSize,
                      width: brushSize * 2,
                      height: brushSize * 2
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
                  <img src={tissue} alt="Tissue" className="brush-icon" />
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
                  <button className="show-answer-btn" onClick={handleShowAnswer}>
                    {showAnswer ? currentQuestion?.answer : '정답 확인'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game2GamePlay