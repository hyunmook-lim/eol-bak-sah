import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game5GamePlay.css'
import questionMark from '../../../assets/images/question-mark.png'
import questionIce from '../../../assets/images/question-ice.png'

function Game5GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = useMemo(() => location.state?.questions || [], [location.state?.questions])
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [roundStarted, setRoundStarted] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isRearranging, setIsRearranging] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintOpacity, setHintOpacity] = useState(1)
  const [clickedCharIndices, setClickedCharIndices] = useState([])
  const [hintShown, setHintShown] = useState(false)

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/5/build')
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

  // 초성 추출 함수
  const getInitialConsonant = (char) => {
    const code = char.charCodeAt(0) - 44032
    if (code < 0 || code > 11171) return char // 한글이 아닌 경우 원본 반환
    
    const initialConsonants = [
      'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
      'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ]
    
    const initialIndex = Math.floor(code / 588)
    return initialConsonants[initialIndex]
  }

  const handleStartGame = () => {
    setGameStarted(true)
    if (!hintShown) {
      setShowHint(true)
      setHintOpacity(1)
      setHintShown(true)
      
      // 3초 후 힌트 투명도 0으로
      setTimeout(() => {
        setHintOpacity(0)
      }, 3000)
    }
  }


  const handleStartRound = () => {
    setRoundStarted(true)
  }

  const handleReplay = () => {
    setShowAnswer(false)
    setClickedCharIndices([])
  }

  const handleShowAnswer = () => {
    setIsRearranging(true)
    setShowAnswer(true)
    
    setTimeout(() => {
      setIsRearranging(false)
    }, 800)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setRoundStarted(false)
      setIsRearranging(false)
      setShowAnswer(false)
      setClickedCharIndices([])
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
      setRoundStarted(false)
      setIsRearranging(false)
      setShowAnswer(false)
      setClickedCharIndices([])
    }
  }

  const handleGameEnd = () => {
    navigate('/game/5/finish')
  }

  const handleCharClick = (index) => {
    if (!roundStarted || showAnswer) return
    
    setClickedCharIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index]
      }
    })
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
          <h1>초성 게임 - 정답 목록</h1>
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
    
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <div className="game5-gameplay-container">
      <header className="game-title-header">
        <div></div>
        <h1>초성 게임</h1>
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
                {showHint && (
                  <div className="hint-container" style={{opacity: hintOpacity}}>
                    <p>클릭하면 한 글자씩 정답을 볼 수 있어요!</p>
                  </div>
                )}
                {(() => {
                  const chars = questions[currentQuestionIndex] ? questions[currentQuestionIndex].split('') : []
                  
                  if (chars.length <= 4) {
                    return (
                      <div className="question-ice-blocks">
                        {chars.map((char, index) => (
                          <div 
                            key={index} 
                            className={`question-ice-item ${isRearranging ? 'rearranging' : ''} ${showAnswer ? 'answer-revealed' : ''} ${roundStarted ? 'clickable' : ''}`}
                            onClick={() => handleCharClick(index)}
                          >
                            <img src={questionIce} alt="Question Ice" className="question-ice" />
                            {!roundStarted ? (
                              <img src={questionMark} alt="Question Mark" className="question-mark-overlay" />
                            ) : (
                              <span className="question-char-overlay">
                                {showAnswer || clickedCharIndices.includes(index) ? char : getInitialConsonant(char)}
                              </span>
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
                            <div 
                              key={index} 
                              className={`question-ice-item ${isRearranging ? 'rearranging' : ''} ${showAnswer ? 'answer-revealed' : ''} ${roundStarted ? 'clickable' : ''}`}
                              onClick={() => handleCharClick(index)}
                            >
                              <img src={questionIce} alt="Question Ice" className="question-ice" />
                              {!roundStarted ? (
                                <img src={questionMark} alt="Question Mark" className="question-mark-overlay" />
                              ) : (
                                <span className="question-char-overlay">
                                  {showAnswer || clickedCharIndices.includes(index) ? char : getInitialConsonant(char)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="question-ice-blocks">
                          {secondRow.map((char, index) => (
                            <div 
                              key={index + firstRow.length} 
                              className={`question-ice-item ${isRearranging ? 'rearranging' : ''} ${showAnswer ? 'answer-revealed' : ''} ${roundStarted ? 'clickable' : ''}`}
                              onClick={() => handleCharClick(index + firstRow.length)}
                            >
                              <img src={questionIce} alt="Question Ice" className="question-ice" />
                              {!roundStarted ? (
                                <img src={questionMark} alt="Question Mark" className="question-mark-overlay" />
                              ) : (
                                <span className="question-char-overlay">
                                  {showAnswer || clickedCharIndices.includes(index + firstRow.length) ? char : getInitialConsonant(char)}
                                </span>
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
    </div>
  )
}

export default Game5GamePlay