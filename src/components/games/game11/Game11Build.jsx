import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import localforage from 'localforage'
import './Game11Build.css'
import LandscapeOnly from '../../common/LandscapeOnly'
import SaveCompleteModal from '../../common/SaveCompleteModal'

function Game11Build() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [playerCount, setPlayerCount] = useState(location.state?.playerCount || 4)
  const [players, setPlayers] = useState(location.state?.players || Array(4).fill(''))
  const [results, setResults] = useState(location.state?.results || Array(4).fill(''))
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  // Sync arrays if player count changes manually (mostly to avoid out-of-bounds)
  useEffect(() => {
    setPlayers(prev => {
      const newArr = [...prev]
      if (newArr.length < playerCount) return [...newArr, ...Array(playerCount - newArr.length).fill('')]
      return newArr.slice(0, playerCount)
    })
    setResults(prev => {
      const newArr = [...prev]
      if (newArr.length < playerCount) return [...newArr, ...Array(playerCount - newArr.length).fill('')]
      return newArr.slice(0, playerCount)
    })
  }, [playerCount])

  const handleBackToVideo = () => navigate('/game/11/video')
  const handleBackToHome = () => setShowConfirmModal(true)
  
  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 800, behavior: 'smooth' }), 50)
  }
  const handleCancelExit = () => setShowConfirmModal(false)

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  const handleResultChange = (index, value) => {
    const newResults = [...results]
    newResults[index] = value
    setResults(newResults)
  }

  const handleFillAllResults = (text) => {
    setResults(prevResults => prevResults.map(r => r.trim() === '' ? text : r))
  }

  const handleComplete = () => {
    const isReady = players.every(p => p.trim()) && results.every(r => r.trim())
    if (isReady) {
      navigate('/game/11/gameplay', { state: { playerCount, players, results } })
    }
  }

  const handleSaveDraft = async () => {
    try {
      const isAnyInputFilled = players.some(p => p.trim()) || results.some(r => r.trim())
      if (!isAnyInputFilled) {
        alert('저장할 데이터가 없습니다. 최소 1개 이상 입력해주세요.')
        return
      }

      const existingDrafts = await localforage.getItem('game11_drafts') || []
      
      const newDraft = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        playerCount,
        players,
        results
      }

      const updatedDrafts = [newDraft, ...existingDrafts].slice(0, 10)
      await localforage.setItem('game11_drafts', updatedDrafts)
      setShowSaveModal(true)
    } catch (error) {
      console.error('Save draft failed:', error)
      alert('임시저장 중 오류가 발생했습니다.')
    }
  }

  const isFormComplete = players.length > 0 && players.every(p => p.trim()) && results.every(r => r.trim())

  return (
    <LandscapeOnly>
    <div className="game11-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToVideo} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>사다리타기 게임 만들기</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>
      
      <div className="game-play-container">
        <div className="question-input-section">
          {/* Player Count Selection */}
          <div className="section-header">
            <div className="section-left">
              <h2>1. 사람 수 선택</h2>
            </div>
            <p className="section-description">사다리타기에 참여할 사람 수를 선택하세요.</p>
          </div>
          <div className="divider"></div>
          
          <div className="player-count-selection">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                className={`count-btn ${playerCount === num ? 'active' : ''}`}
                onClick={() => setPlayerCount(num)}
              >
                {num}명
              </button>
            ))}
          </div>

          <div className="section-header" style={{ marginTop: '40px' }}>
            <div className="section-left">
              <h2>2. 사람 및 결과 입력</h2>
            </div>
            <ul className="section-description-list">
              <li>상단에는 사람 이름을, 하단에는 결과를 입력해주세요</li>
              <li>모든 칸을 빈칸없이 채워주세요</li>
            </ul>
          </div>
          <div className="divider"></div>

          <div className="quick-fill-section">
            <button className="quick-fill-btn fail" onClick={() => handleFillAllResults('꽝')}>
              빈칸을 '꽝'으로 채우기
            </button>
            <button className="quick-fill-btn pass" onClick={() => handleFillAllResults('통과')}>
              빈칸을 '통과'로 채우기
            </button>
          </div>

          <div className="inputs-grid-wrapper">
            <div className="inputs-grid" style={{ gridTemplateColumns: `repeat(${playerCount}, 1fr)` }}>
              {/* Top Row: Players */}
              {players.map((player, index) => (
                <div key={`player-${index}`} className="input-box">
                  <div className="input-label player-label">사람 {index + 1}</div>
                  <input
                    type="text"
                    value={player}
                    maxLength="8"
                    placeholder="이름 입력"
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                  />
                </div>
              ))}

              {/* Middle Divider representing ladder area visually (optional but good UI) */}
              <div className="ladder-visual-placeholder" style={{ gridColumn: `1 / span ${playerCount}` }}>
                {/* Visual connecting lines */}
                {Array.from({ length: playerCount }).map((_, i) => (
                  <div key={`line-${i}`} className="vertical-line" style={{ left: `calc(${(i + 0.5) * (100 / playerCount)}%)` }}></div>
                ))}
              </div>

              {/* Bottom Row: Results */}
              {results.map((result, index) => (
                <div key={`result-${index}`} className="input-box">
                  <input
                    type="text"
                    value={result}
                    maxLength="8"
                    placeholder="결과/벌칙"
                    onChange={(e) => handleResultChange(index, e.target.value)}
                    className="result-input"
                  />
                  <div className="input-label result-label">결과 {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="completion-section">
            {!isFormComplete && (
              <span className="completion-warning">
                * 모든 사람과 결과를 입력해주세요.
              </span>
            )}
            <div className="action-buttons-group">
              <button 
                className="save-draft-btn"
                onClick={handleSaveDraft}
              >
                임시저장
              </button>
              <button 
                className="complete-btn"
                onClick={handleComplete}
                disabled={!isFormComplete}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelExit}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>홈으로 돌아가시겠습니까?</h3>
              <p>작업 중인 내용이 저장되지 않을 수 있습니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmExit}>확인</button>
              <button className="cancel-btn" onClick={handleCancelExit}>취소</button>
            </div>
          </div>
        </div>
      )}

      <SaveCompleteModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
      />
    </div>
    </LandscapeOnly>
  )
}

export default Game11Build
