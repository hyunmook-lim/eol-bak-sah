import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game1GamePlay.css'
import runningPenguin from '../../../assets/images/running-penguin.png'
import questionMark from '../../../assets/images/question-mark.png'

function Game1GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = location.state?.questions || []
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [roundStarted, setRoundStarted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/1/play')
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
    setIsAnimating(true)
    setRoundStarted(true)
    setShowAnswer(false)
    
    // 속도에 따른 애니메이션 시간 계산 (속도가 높을수록 빠르게)
    const animationDuration = (6 - speed) * 1000 // x1: 5초, x5: 1초
    
    setTimeout(() => {
      setIsAnimating(false)
    }, animationDuration)
  }

  const handleReplay = () => {
    setIsAnimating(true)
    setShowAnswer(false)
    
    const animationDuration = (6 - speed) * 1000
    
    setTimeout(() => {
      setIsAnimating(false)
    }, animationDuration)
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
    setIsAnimating(false)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setRoundStarted(false)
      setIsAnimating(false)
      setShowAnswer(false)
    } else {
      // 게임 종료
      alert('게임이 끝났습니다!')
      navigate('/')
      setTimeout(() => {
        window.scrollTo({ top: 800, behavior: 'smooth' })
      }, 50)
    }
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <div className="game1-gameplay-container">
      <header className="game-title-header">
        <div></div>
        <h1>슝 글자 게임 (단어)</h1>
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
            <div className="game-screen-container">
              <div className={`character-container ${isAnimating ? 'animating' : ''} ${showAnswer ? 'show-answer' : ''} ${!roundStarted ? 'pre-round' : ''}`} style={{'--animation-duration': `${(6 - speed)}s`}}>
                <div className="question-box">
                  {showAnswer ? questions[currentQuestionIndex] : <img src={questionMark} alt="Question Mark" className="question-mark" />}
                </div>
                <div className="penguin-character">
                  <img src={runningPenguin} alt="Running Penguin" />
                </div>
              </div>
              
              {showAnswer && (
                <button className="next-arrow-btn" onClick={handleNextQuestion}>
                  <span className="arrow-icon">→</span>
                </button>
              )}
            </div>
            <div className="game-utilities">
              <div className="round-counter">
                <span className="current-round">{currentQuestionIndex + 1}</span> / {questions.length}
              </div>
              
              <div className="speed-selector">
                <span className="speed-label">속도:</span>
                <div className="speed-buttons">
                  {[1, 2, 3, 4, 5].map((speedValue) => (
                    <button
                      key={speedValue}
                      className={`speed-btn ${speed === speedValue ? 'active' : ''}`}
                      onClick={() => setSpeed(speedValue)}
                    >
                      x{speedValue}
                    </button>
                  ))}
                </div>
              </div>
              
              {!roundStarted ? (
                <button className="next-question-btn" onClick={handleStartRound}>
                  라운드 시작
                </button>
              ) : (
                <div className="round-buttons">
                  <button className="replay-btn" onClick={handleReplay}>
                    다시보기
                  </button>
                  <button className="answer-btn" onClick={handleShowAnswer}>
                    정답확인
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

export default Game1GamePlay