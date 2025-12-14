import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game6GamePlay.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game6GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = useMemo(() => location.state?.questions || [], [location.state?.questions])

  console.log('Game6GamePlay - location.state:', location.state)
  console.log('Game6GamePlay - questions received:', questions)
  console.log('Game6GamePlay - questions length:', questions.length)

  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  const [userAnswer, setUserAnswer] = useState(null) // 사용자가 선택한 답변
  const [showResult, setShowResult] = useState(false) // 정답/오답 결과 표시 여부
  const [showAnswer, setShowAnswer] = useState(false) // 정답 이미지 표시 여부
  const [showExplanationModal, setShowExplanationModal] = useState(false) // 해설 모달 표시 여부

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/6/build')
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
  }

  const handleOpenExplanationModal = () => {
    setShowExplanationModal(true)
  }

  const handleCloseExplanationModal = () => {
    setShowExplanationModal(false)
  }

  const isCorrectAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex]
    return userAnswer === currentQuestion.answer
  }

  const handleCheckAnswer = () => {
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer(null)
      setShowResult(false)
      setShowAnswer(false)
    } else {
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
      setUserAnswer(null)
      setShowResult(false)
      setShowAnswer(false)
    }
  }

  const handleGameEnd = () => {
    navigate('/game/6/finish')
  }

  const handleOpenPreviewModal = () => {
    setShowPreviewModal(true)
  }

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false)
  }

  const handleExportToPDF = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OX 퀴즈 - 문제 목록</title>
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
          <h1>OX 퀴즈 - 문제 목록</h1>
          <div class="preview-questions-list">
            ${questions.map((question, index) => `
              <div class="preview-question-item ${index === currentQuestionIndex ? 'current' : ''}">
                <div class="preview-question-header">
                  <div class="preview-question-number-box">${index + 1}</div>
                  <div class="preview-question-content">
                    <span class="preview-question-text">${question.question}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()

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
    navigate('/game/6/build', { state: { questions } })
  }

  const handleCancelBackToBuild = () => {
    setShowBackConfirmModal(false)
  }

  return (
    <LandscapeOnly>
    <div className="game6-gameplay-container">
      <header className="game-title-header">
        <button onClick={handleBackToBuild} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>OX 게임</h1>
        <div className="header-right-buttons">
          {gameStarted && (
            <button onClick={handleOpenPreviewModal} className="header-menu-btn">
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
          <button onClick={handleBackToHome} className="header-close-btn">
            X
          </button>
        </div>
      </header>

      {!gameStarted ? (
        <div className="gameplay-container">
          <div className="game-start-section">
            <h2>게임을 시작하시겠습니까?</h2>
            <p>총 {questions.length}개의 문제가 준비되었습니다.</p>
            <button className="start-game-btn" onClick={handleStartGame}>
              게임 시작
            </button>
          </div>
        </div>
      ) : (
        <div className="gameplay-container">
          <div className="game-play-section">
            <div className="game-screen-container">
              {showAnswer ? (
                <div className="answer-image-container">
                  <img
                    src={questions[currentQuestionIndex].answer === 'O'
                      ? '/images/answer-is-o.png'
                      : '/images/answer-is-x.png'
                    }
                    alt={`정답은 ${questions[currentQuestionIndex].answer}입니다`}
                    className="answer-image"
                  />
                </div>
              ) : (
                <div className="question-display-container">
                  <div className="question-number">
                    {currentQuestionIndex + 1}번 문제
                  </div>

                  <div className="question-stack-wrapper">
                    <div className="penguin-decoration-wrapper">
                      <img src="/images/ox-penguin.png" alt="OX 펭귄" className="penguin-decoration" />
                    </div>
                    <div className="question-content-wrapper">
                      {questions[currentQuestionIndex].image && (
                        <div className="question-image">
                          <img src={questions[currentQuestionIndex].image} alt="문제 이미지" />
                        </div>
                      )}
                      <div className="question-text">

                        <div className="question-text-content">
                          {questions[currentQuestionIndex].question}
                        </div>
                      </div>
                    </div>
                  </div>

                  {showResult && (
                    <div className={`result-feedback ${isCorrectAnswer() ? 'correct' : 'incorrect'}`}>
                      <div className="result-icon">
                        {isCorrectAnswer() ? '✓' : '✗'}
                      </div>
                      <div className="result-text">
                        {isCorrectAnswer() ? '정답입니다!' : '오답입니다!'}
                      </div>
                      <div className="correct-answer">
                        정답: {questions[currentQuestionIndex].answer}
                      </div>
                      {questions[currentQuestionIndex].explanation && (
                        <div className="explanation">
                          <div className="explanation-label">해설:</div>
                          <div className="explanation-text">{questions[currentQuestionIndex].explanation}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

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
            </div>
            <div className="game-utilities">
              <div className="utility-left-section">
                {currentQuestionIndex > 0 && (
                  <button className="prev-question-btn" onClick={handlePreviousQuestion}>
                    ← 이전 문제
                  </button>
                )}
              </div>

              <div className="utility-center-section">
                <div className="round-counter">
                  <span className="current-round">{currentQuestionIndex + 1}</span> / {questions.length}
                </div>
                {showAnswer ? (
                  <div className="answer-action-buttons">
                    <button className="retry-btn" onClick={() => setShowAnswer(false)}>
                      다시하기
                    </button>
                    {questions[currentQuestionIndex].explanation && (
                      <button className="explanation-btn" onClick={handleOpenExplanationModal}>
                        해설 보기
                      </button>
                    )}
                  </div>
                ) : (
                  <button className="check-answer-btn" onClick={handleCheckAnswer}>
                    정답 확인
                  </button>
                )}
              </div>

              <div className="utility-right-section">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button className="next-question-btn" onClick={handleNextQuestion}>
                    다음 문제 →
                  </button>
                ) : (
                  <button className="game-complete-btn" onClick={handleGameEnd}>
                    게임 완료
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="preview-modal-overlay" onClick={handleClosePreviewModal}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h2>문제 미리보기</h2>
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
                        <span className="preview-question-text">{question.question}</span>
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

      {showExplanationModal && (
        <div className="explanation-modal-overlay" onClick={handleCloseExplanationModal}>
          <div className="explanation-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="explanation-modal-header">
              <h3>해설</h3>
            </div>
            <div className="explanation-modal-body">
              <p>{questions[currentQuestionIndex].explanation}</p>
            </div>
            <div className="explanation-modal-footer">
              <button className="explanation-close-btn" onClick={handleCloseExplanationModal}>
                닫기
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

export default Game6GamePlay