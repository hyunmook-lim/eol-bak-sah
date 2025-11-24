import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game4GamePlay.css'
const questionMark = '/images/question-mark.png'
const questionIce = '/images/question-ice.png'

function Game4GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = useMemo(() => location.state?.questions || [], [location.state?.questions])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [roundStarted, setRoundStarted] = useState(false)
  const [shuffledChars, setShuffledChars] = useState([])
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  const [isRearranging, setIsRearranging] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/4/play')
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

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const isArrayEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    return arr1.every((item, index) => item === arr2[index])
  }

  const shuffleUntilDifferent = (originalArray) => {
    let shuffled = shuffleArray(originalArray)
    let attempts = 0
    const maxAttempts = 10 // 무한 루프 방지

    // 원본과 같거나 글자가 1개 이하인 경우가 아닐 때까지 반복
    while (isArrayEqual(shuffled, originalArray) && attempts < maxAttempts && originalArray.length > 1) {
      shuffled = shuffleArray(originalArray)
      attempts++
    }

    return shuffled
  }

  const handleStartRound = () => {
    setRoundStarted(true)
    // 현재 문제의 글자들을 섞어서 저장 (정답과 다르게)
    const currentChars = questions[currentQuestionIndex].split('')
    const shuffled = shuffleUntilDifferent(currentChars)
    setShuffledChars(shuffled)
  }

  const handleReplay = () => {
    // 글자들을 다시 섞어서 표시 (정답과 다르게)
    const currentChars = questions[currentQuestionIndex].split('')
    const shuffled = shuffleUntilDifferent(currentChars)
    setShuffledChars(shuffled)
    setShowAnswer(false)
  }

  const handleShowAnswer = () => {
    // 애니메이션을 통해 원본 정답 순서로 글자들을 재배치
    const originalChars = questions[currentQuestionIndex].split('')

    // 애니메이션 클래스 추가
    setIsRearranging(true)
    setShowAnswer(true)

    // 잠시 후 정답 순서로 변경
    setTimeout(() => {
      setShuffledChars(originalChars)
      setTimeout(() => {
        setIsRearranging(false)
      }, 800) // 애니메이션 시간과 맞춤
    }, 100)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setRoundStarted(false)
      setShuffledChars([])
      setIsRearranging(false)
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

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setRoundStarted(false)
      setShuffledChars([])
      setIsRearranging(false)
      setShowAnswer(false)
    }
  }

  const handleGameEnd = () => {
    navigate('/game/4/finish')
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
          <title>슝 글자 게임 - 정답 목록</title>
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
          <h1>뒤죽박죽 글자게임 - 정답 목록</h1>
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
    navigate('/game/4/build', { state: { questions } })
  }

  const handleCancelBackToBuild = () => {
    setShowBackConfirmModal(false)
  }

  return (
    <div className="game4-gameplay-container">
      <header className="game-title-header">
        <button onClick={handleBackToBuild} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>뒤죽박죽 글자게임</h1>
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
              <div className="question-display-container">
                {(() => {
                  const chars = roundStarted && shuffledChars.length > 0
                    ? shuffledChars
                    : (questions[currentQuestionIndex] ? questions[currentQuestionIndex].split('') : [])

                  if (chars.length <= 4) {
                    return (
                      <div className="question-ice-blocks">
                        {chars.map((char, index) => (
                          <div key={index} className={`question-ice-item ${isRearranging ? 'rearranging' : ''} ${showAnswer ? 'answer-revealed' : ''}`}>
                            <img src={questionIce} alt="Question Ice" className="question-ice" />
                            {roundStarted ? (
                              <span className="question-char-overlay">{char}</span>
                            ) : (
                              <img src={questionMark} alt="Question Mark" className="question-mark-overlay" />
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  } else {
                    const firstRow = chars.slice(0, Math.ceil(chars.length / 2))
                    const secondRow = chars.slice(Math.ceil(chars.length / 2))
                    return (
                      <div className="question-ice-rows">
                        <div className="question-ice-blocks">
                          {firstRow.map((char, index) => (
                            <div key={index} className={`question-ice-item ${isRearranging ? 'rearranging' : ''} ${showAnswer ? 'answer-revealed' : ''}`}>
                              <img src={questionIce} alt="Question Ice" className="question-ice" />
                              {roundStarted ? (
                                <span className="question-char-overlay">{char}</span>
                              ) : (
                                <img src={questionMark} alt="Question Mark" className="question-mark-overlay" />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="question-ice-blocks">
                          {secondRow.map((char, index) => (
                            <div key={index + firstRow.length} className={`question-ice-item ${isRearranging ? 'rearranging' : ''} ${showAnswer ? 'answer-revealed' : ''}`}>
                              <img src={questionIce} alt="Question Ice" className="question-ice" />
                              {roundStarted ? (
                                <span className="question-char-overlay">{char}</span>
                              ) : (
                                <img src={questionMark} alt="Question Mark" className="question-mark-overlay" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                })()}
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
            </div>
            <div className="game-utilities">
              <div className="round-counter">
                <span className="current-round">{currentQuestionIndex + 1}</span> / {questions.length}
              </div>

              <div className="utility-right-section">
                {!roundStarted ? (
                  <button className="round-start-btn" onClick={handleStartRound}>
                    게임 시작
                  </button>
                ) : (
                  <div className="round-buttons">
                    <button className="replay-btn" onClick={handleReplay}>
                      다시하기
                    </button>
                    <button className="answer-btn" onClick={handleShowAnswer}>
                      정답확인
                    </button>
                  </div>
                )}
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
  )
}

export default Game4GamePlay