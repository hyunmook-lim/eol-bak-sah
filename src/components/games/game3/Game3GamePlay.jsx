import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game3GamePlay.css'
import LandscapeOnly from '../../common/LandscapeOnly'
const runningPenguin = '/images/running-penguin.png'
const questionMark = '/images/question-mark.png'
const questionIce = '/images/question-ice.png'

function Game3GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = useMemo(() => location.state?.questions || [], [location.state?.questions])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [roundStarted, setRoundStarted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  const [currentCharIndex, setCurrentCharIndex] = useState(-1)
  const [isCharacterAnimating, setIsCharacterAnimating] = useState(false)
  const [animationTimers, setAnimationTimers] = useState([])

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/3/build')
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

  // 게임 시작 시 및 문제 변경 시 자동으로 라운드 시작
  useEffect(() => {
    if (gameStarted) {
      handleStartRound()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, currentQuestionIndex])

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleStartRound = () => {
    // 기존 타이머들이 있으면 모두 제거
    animationTimers.forEach(timer => clearTimeout(timer))
    setAnimationTimers([])

    setRoundStarted(true)
    setShowAnswer(false)
    setCurrentCharIndex(-1)
    setIsCharacterAnimating(true)

    // 각 글자별로 애니메이션 시작
    animateCharacters()
  }

  const animateCharacters = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const characters = currentQuestion.split('')
    console.log('Starting animation for:', currentQuestion, 'characters:', characters)

    let charIndex = 0
    const timers = []

    const animateNextChar = () => {
      if (charIndex < characters.length) {
        console.log('Showing character:', characters[charIndex], 'at index:', charIndex)
        setCurrentCharIndex(charIndex)
        setIsAnimating(true)

        // 속도에 따른 애니메이션 시간 계산
        const animationDuration = (6 - speed) * 1000
        console.log('Animation duration:', animationDuration)

        const timer1 = setTimeout(() => {
          // 애니메이션 끝나고 캐릭터를 왼쪽으로 이동
          setIsAnimating(false)
          charIndex++

          // 다음 글자가 있으면 계속, 없으면 끝
          if (charIndex < characters.length) {
            const timer2 = setTimeout(() => {
              animateNextChar()
            }, 500) // 글자 간 간격
            timers.push(timer2)
          } else {
            console.log('Animation completed')
            // 모든 글자 애니메이션이 끝나면 애니메이션 상태만 해제
            setIsCharacterAnimating(false)
          }
        }, animationDuration)
        timers.push(timer1)
      }
    }

    animateNextChar()
    setAnimationTimers(timers)
  }

  const handleReplay = () => {
    // 기존 타이머들이 있으면 모두 제거
    animationTimers.forEach(timer => clearTimeout(timer))
    setAnimationTimers([])

    setShowAnswer(false)
    setCurrentCharIndex(-1)
    setIsCharacterAnimating(true)

    // 각 글자별로 애니메이션 시작
    animateCharacters()
  }

  const handleShowAnswer = () => {
    // 모든 애니메이션 타이머 중지
    animationTimers.forEach(timer => clearTimeout(timer))
    setAnimationTimers([])

    setShowAnswer(true)
    // 캐릭터는 왼쪽에 그대로 두고 애니메이션만 중지
    setIsCharacterAnimating(false)
    setIsAnimating(false)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setRoundStarted(false)
      setIsAnimating(false)
      setShowAnswer(false)
      setCurrentCharIndex(-1)
      setIsCharacterAnimating(false)
    } else {
      // 게임 종료
      alert('게임이 끝났습니다!')
      navigate('/')
      setTimeout(() => {
        window.scrollTo({ top: 800, behavior: 'smooth' })
      }, 50)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setRoundStarted(false)
      setIsAnimating(false)
      setShowAnswer(false)
      setCurrentCharIndex(-1)
      setIsCharacterAnimating(false)
    }
  }

  const handleGameEnd = () => {
    navigate('/game/3/finish')
  }

  const handleOpenPreviewModal = () => {
    setShowPreviewModal(true)
  }

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false)
  }

  const handleExportToPDF = () => {
    // 새 창에서 PDF 출력 다이얼로그 열기
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>초성 퀴즈 게임 - 정답 목록</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            h1 {
              background-color: #01275b;
              color: white;
              margin: 0 0 30px 0;
              font-size: 1.5rem;
              font-weight: 700;
              padding: 20px 30px;
              text-align: center;
            }
            .preview-questions-list {
              display: flex;
              flex-direction: column;
              gap: 15px;
              padding: 0 20px;
            }
            .preview-question-item {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            .preview-question-item.current {
              background-color: #fef9f0;
              border: 2px solid #f5ae43;
              border-radius: 8px;
              padding: 10px;
            }
            .preview-question-header {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .preview-question-number-box {
              background-color: white;
              color: #333;
              border: 2px solid #333;
              font-size: 1.2rem;
              font-weight: 700;
              flex-shrink: 0;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
            }
            .preview-question-item.current .preview-question-number-box {
              background-color: #f5ae43;
              color: white;
              border-color: #f5ae43;
            }
            .preview-question-content {
              background-color: #f0f0f0;
              border-radius: 8px;
              padding: 12px 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              flex: 1;
            }
            .preview-question-item.current .preview-question-content {
              background-color: #fef9f0;
              border: 2px solid #f5ae43;
            }
            .preview-question-text {
              color: #333;
              font-size: 1rem;
              font-weight: 500;
              text-align: center;
              flex: 1;
            }
            .preview-question-item.current .preview-question-text {
              color: #01275b;
              font-weight: 600;
            }
            @media print {
              body { padding: 10px; }
              .preview-question-item { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>슝 글자 게임 (글자) - 정답 목록</h1>
          <div class="preview-questions-list">
            ${questions.map((question, index) => `
              <div class="preview-question-item ${index === currentQuestionIndex ? 'current' : ''}">
                <div class="preview-question-header">
                  <div class="preview-question-number-box">${index + 1}</div>
                  <div class="preview-question-content">
                    <span class="preview-question-text">${question}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()

    // 문서 로드 후 인쇄 다이얼로그 열기
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  if (questions.length === 0) {
    return null
  }

  const handleBackToBuild = () => {
    setShowBackConfirmModal(true)
  }

  const handleConfirmBackToBuild = () => {
    setShowBackConfirmModal(false)
    navigate('/game/3/build', { state: { questions } })
  }

  const handleCancelBackToBuild = () => {
    setShowBackConfirmModal(false)
  }

  return (
    <LandscapeOnly>
    <div className="game3-gameplay-container">
      <header className="game-title-header">
        <button onClick={handleBackToBuild} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>슝 글자 게임 (글자)</h1>
        <div className="header-right-buttons">
          <button onClick={handleOpenPreviewModal} className="header-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button onClick={handleBackToHome} className="header-close-btn">
            X
          </button>
        </div>
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
              <div className={`character-container ${isAnimating ? 'animating' : ''} ${showAnswer ? 'show-answer' : ''} ${!roundStarted ? 'pre-round' : ''}`} style={{ '--animation-duration': `${(6 - speed)}s` }}>
                <div className="question-box">
                  <div className="question-ice-container">
                    <img src={questionIce} alt="Question Ice" className="question-ice" />
                    {roundStarted && currentCharIndex >= 0 && !showAnswer ? (
                      <span className="question-text-overlay">
                        {questions[currentQuestionIndex].split('')[currentCharIndex]}
                      </span>
                    ) : !showAnswer ? (
                      <img src={questionMark} alt="Question Mark" className="question-mark-overlay" />
                    ) : null}
                  </div>
                </div>
                <div className="penguin-character">
                  <img src={runningPenguin} alt="Running Penguin" />
                </div>
              </div>

              {showAnswer && (
                <div className="answer-display-container">
                  {(() => {
                    const chars = questions[currentQuestionIndex].split('')
                    if (chars.length <= 4) {
                      return (
                        <div className="answer-ice-blocks">
                          {chars.map((char, index) => (
                            <div key={index} className="answer-ice-item">
                              <img src={questionIce} alt="Answer Ice" className="answer-ice" />
                              <span className="answer-char-overlay">{char}</span>
                            </div>
                          ))}
                        </div>
                      )
                    } else {
                      const firstRow = chars.slice(0, Math.ceil(chars.length / 2))
                      const secondRow = chars.slice(Math.ceil(chars.length / 2))
                      return (
                        <div className="answer-ice-rows">
                          <div className="answer-ice-blocks">
                            {firstRow.map((char, index) => (
                              <div key={index} className="answer-ice-item">
                                <img src={questionIce} alt="Answer Ice" className="answer-ice" />
                                <span className="answer-char-overlay">{char}</span>
                              </div>
                            ))}
                          </div>
                          <div className="answer-ice-blocks">
                            {secondRow.map((char, index) => (
                              <div key={index + firstRow.length} className="answer-ice-item">
                                <img src={questionIce} alt="Answer Ice" className="answer-ice" />
                                <span className="answer-char-overlay">{char}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                  })()}
                </div>
              )}

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

              <div className="round-buttons">
                <button className="replay-btn" onClick={handleReplay} disabled={isAnimating || isCharacterAnimating}>
                  다시보기
                </button>
                <button className="answer-btn" onClick={handleShowAnswer}>
                  정답확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPreviewModal && (
        <div className="preview-modal-overlay" onClick={handleClosePreviewModal}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h2>정답 미리보기</h2>
              <button className="modal-close-btn" onClick={handleClosePreviewModal}>
                X
              </button>
            </div>
            <div className="preview-modal-body">
              <div className="preview-questions-list">
                {questions.map((question, index) => (
                  <div key={index} className={`preview-question-item ${index === currentQuestionIndex ? 'current' : ''}`}>
                    <div className="preview-question-header">
                      <div className="preview-question-number-box">{index + 1}</div>
                      <div className="preview-question-content">
                        <span className="preview-question-text">{question}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="preview-modal-footer">
                <button className="pdf-export-btn" onClick={handleExportToPDF}>
                  📄 PDF로 출력
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default Game3GamePlay