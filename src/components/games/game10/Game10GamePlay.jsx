import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import './Game10GamePlay.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game10GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Players containing name, truth1, truth2, lie, statements mapping
  const players = useMemo(() => location.state?.players || [], [location.state?.players])
  
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  
  // Keep shuffled statements for the current player to avoid reshuffling on every render
  const [shuffledCandidates, setShuffledCandidates] = useState([])
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  
  const [userAnswer, setUserAnswer] = useState(null) // ID of the selected statement
  const [showResult, setShowResult] = useState(false) 
  const [showResultModal, setShowResultModal] = useState(false)
  
  useEffect(() => {
    // Return to build if no players are provided
    if (players.length === 0) {
      navigate('/game/10/build')
    }
  }, [players, navigate])

  const handleBackToBuild = () => setShowBackConfirmModal(true)
  const handleConfirmBackToBuild = () => {
    setShowBackConfirmModal(false)
    navigate('/game/10/build', { state: { players } })
  }
  const handleCancelBackToBuild = () => setShowBackConfirmModal(false)

  const handleBackToHome = () => setShowConfirmModal(true)
  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 800, behavior: 'smooth' }), 50)
  }
  const handleCancelExit = () => setShowConfirmModal(false)

  const handleStartGame = () => setGameStarted(true)

  const currentPlayer = players[currentPlayerIndex]

  // Shuffle statements whenever the currentPlayer changes
  useEffect(() => {
    if (currentPlayer && currentPlayer.statements) {
      const shuffled = [...currentPlayer.statements].sort(() => Math.random() - 0.5)
      setShuffledCandidates(shuffled)
    }
  }, [currentPlayerIndex, currentPlayer])

  // statement is an object like { id: '...', text: '...', isLie: boolean }
  const handleSelectCandidate = (statementId) => {
    if (showResultModal) return // Prevent clicking after modal is shown
    
    // Play sound based on the answer
    const selected = currentPlayer.statements.find(c => c.id === statementId)
    const soundPath = selected?.isLie ? '/sounds/answer-correct.wav' : '/sounds/wrong.wav'
    const audio = new Audio(soundPath)
    audio.play().catch(e => console.error('Failed to play audio:', e))

    setUserAnswer(statementId)
    setShowResult(true)
    setShowResultModal(true)
  }


  const isCorrectAnswer = () => {
    if (!currentPlayer || !userAnswer) return false
    const selected = currentPlayer.statements.find(c => c.id === userAnswer)
    return selected?.isLie === true
  }

  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setUserAnswer(null)
      setShowResult(false)
    } else {
      navigate('/game/10/finish', { state: { gamePath: '/game/10' } })
    }
  }

  const handlePreviousPlayer = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1)
      setUserAnswer(null)
      setShowResult(false)
    }
  }

  if (players.length === 0) return null

  return (
    <LandscapeOnly>
      <div className="game10-gameplay-container">
        <header className="game-title-header">
          <button onClick={handleBackToBuild} className="header-back-btn">
            <div className="arrow-left"></div>
          </button>
          <h1>진진가 게임</h1>
          <button onClick={handleBackToHome} className="header-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        {!gameStarted ? (
          <div className="gameplay-container flex-center">
            <div className="game-start-section">
              <h2>진진가 게임을 시작하시겠습니까?</h2>
              <p>총 {players.length}명의 인원이 등록되었습니다.</p>
              <button className="start-game-btn" onClick={handleStartGame}>
                게임 시작
              </button>
            </div>
          </div>
        ) : (
          <div className="gameplay-container">
            <div className="game-play-section">
              <div className="game-screen-container">
                <div className="game-content-wrapper">
                  
                  {/* Top Section: Name and Instruction */}
                  <div className="game-top-section">
                    <div className="player-name-display">
                      <span className="player-index-badge">{currentPlayerIndex + 1}번째 주인공</span>
                      <h2 className="player-name-title">{currentPlayer.name}</h2>
                    </div>
                    
                    <div className="game-instruction">
                      다음 중 <strong>가짜</strong>를 찾아라!
                    </div>
                  </div>

                  {/* Middle Section: Row Cards */}
                  <div className="game-middle-section">
                    <div className="statements-column-list">
                      {shuffledCandidates.map((statement, idx) => {
                        const isSelected = userAnswer === statement.id
                        const isLie = statement.isLie

                        let statusClass = ""
                        if (isSelected) statusClass = "selected"
                        if (showResult) {
                          statusClass = "disabled"
                        }

                        return (
                          <div 
                            key={statement.id} 
                            className={`statement-row-card ${statusClass}`}
                            onClick={() => handleSelectCandidate(statement.id)}
                          >
                            <div className="card-number">{idx + 1}</div>
                            
                            {statement.image ? (
                              <div className="card-content-with-image">
                                <div className="card-text">{statement.text}</div>
                                <div className="card-image-wrapper">
                                  <img src={statement.image} alt="후보 이미지" className="statement-image" />
                                </div>
                              </div>
                            ) : (
                              <div className="card-text">{statement.text}</div>
                            )}
                            
                            {showResult && !showResultModal && (
                              <div className={`card-result-badge ${isLie ? 'lie' : 'truth'}`}>
                                {isLie ? '가짜!' : '진실'}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>


                </div>
              </div>
              
              <div className="game-utilities">
                <div className="utility-left-section">
                  {currentPlayerIndex > 0 && (
                    <button className="prev-question-btn" onClick={handlePreviousPlayer}>
                      ← 이전 문제
                    </button>
                  )}
                </div>

                <div className="utility-center-section">
                  <div className="round-counter">
                    <span className="current-round">{currentPlayerIndex + 1}</span> / {players.length} 명
                  </div>
                  
                </div>

                <div className="utility-right-section">
                  {currentPlayerIndex < players.length - 1 ? (
                    <button className="next-question-btn" onClick={handleNextPlayer}>
                      다음 문제 →
                    </button>
                  ) : (
                    <button className="game-complete-btn" onClick={() => navigate('/game/10/finish', { state: { gamePath: '/game/10' } })}>
                      게임 종료
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals... */}
        {showConfirmModal && (
          <div className="confirm-modal-overlay" onClick={handleCancelExit}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-modal-body">
                <h3>홈으로 돌아가시겠습니까?</h3>
                <p>게임이 종료됩니다.</p>
              </div>
              <div className="confirm-modal-buttons">
                <button className="confirm-btn" onClick={handleConfirmExit}>확인</button>
                <button className="cancel-btn" onClick={handleCancelExit}>취소</button>
              </div>
            </div>
          </div>
        )}

        {showBackConfirmModal && (
          <div className="confirm-modal-overlay" onClick={handleCancelBackToBuild}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-modal-body">
                <h3>게임 만들기로 돌아가시겠습니까?</h3>
                <p>진행중인 게임 정보는 유지되지만 다시 시작해야 합니다.</p>
              </div>
              <div className="confirm-modal-buttons">
                <button className="confirm-btn" onClick={handleConfirmBackToBuild}>확인</button>
                <button className="cancel-btn" onClick={handleCancelBackToBuild}>취소</button>
              </div>
            </div>
          </div>
        )}

        {showResultModal && (
          <div className="result-modal-overlay">
            <div className="result-modal-content">
              <div className="result-modal-header">
                <h2 className={`result-title ${isCorrectAnswer() ? 'correct' : 'incorrect'}`}>
                  {isCorrectAnswer() ? '정답입니다!' : '오답입니다.'}
                </h2>
              </div>
              <div className="result-modal-body">
                <p className="result-description">
                  <strong>{currentPlayer.name}</strong>의 거짓은 <br />
                  <span>{currentPlayer.statements.find(s => s.isLie)?.text}</span> 였습니다.
                </p>
                
                <div className="result-card-display">
                  {(() => {
                    const lieStatement = currentPlayer.statements.find(s => s.isLie);
                    const originalIndex = shuffledCandidates.findIndex(s => s.id === lieStatement.id) + 1;
                    return (
                      <div className="statement-row-card is-lie reveal">
                        <div className="card-number">{originalIndex}</div>
                        {lieStatement.image ? (
                          <div className="card-content-with-image">
                            <div className="card-text">{lieStatement.text}</div>
                            <div className="card-image-wrapper">
                              <img src={lieStatement.image} alt="거짓 이미지" className="statement-image" />
                            </div>
                          </div>
                        ) : (
                          <div className="card-text">{lieStatement.text}</div>
                        )}
                        <div className="card-result-badge lie">가짜!</div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="result-modal-footer">
                <button className="retry-btn-modal" onClick={() => { setShowResultModal(false); setShowResult(false); setUserAnswer(null); }}>
                  다시 고르기
                </button>
                {currentPlayerIndex < players.length - 1 ? (
                  <button className="confirm-btn-modal" onClick={() => { setShowResultModal(false); handleNextPlayer(); }}>
                    다음 문제
                  </button>
                ) : (
                  <button className="confirm-btn-modal" onClick={() => navigate('/game/10/finish', { state: { gamePath: '/game/10' } })}>
                    게임 종료
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </LandscapeOnly>
  )
}

export default Game10GamePlay
