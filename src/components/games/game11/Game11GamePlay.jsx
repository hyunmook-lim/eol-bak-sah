import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HiVolumeUp, HiVolumeOff, HiLightBulb } from 'react-icons/hi'
import './Game11GamePlay.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game11GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const playerCount = location.state?.playerCount || 4
  const players = useMemo(() => location.state?.players || [], [location.state?.players])
  const results = useMemo(() => location.state?.results || [], [location.state?.results])
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  
  const [ladder, setLadder] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  // tracked paths array per player (completed)
  const [tracedPaths, setTracedPaths] = useState({})
  
  // currently animating player point array
  const [activePlayer, setActivePlayer] = useState(null)
  const [animatingPoints, setAnimatingPoints] = useState([])
  const [showAllComplete, setShowAllComplete] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  
  // Dynamic pixel dimensions tracker removed. We will use relative coordinates (x: 0~playerCount, y: 0~100)
  const LADDER_ROWS = 12

  // 10 distinct pastel colors for paths
  // 10 distinct, slightly darker/more vibrant colors for paths
  const PATH_COLORS = [
    '#FF8595', // Deeper Pink
    '#FFB347', // Deeper Orange
    '#F4D03F', // Deeper Yellow
    '#7DCEA0', // Deeper Green
    '#5DADE2', // Deeper Blue
    '#AF7AC5', // Deeper Purple
    '#48C9B0', // Deeper Teal
    '#E59866', // Deeper Peach
    '#EC7063', // Deeper Red
    '#F1C40F'  // Solid Gold
  ];

  const getPathColor = (index) => PATH_COLORS[index % PATH_COLORS.length];

  useEffect(() => {
    if (!players.length || !results.length) {
      navigate('/game/11/build')
      return;
    }

    // Generate Ladder
    const newLadder = Array(LADDER_ROWS).fill(null).map(() => Array(playerCount - 1).fill(false))
    for (let r = 0; r < LADDER_ROWS; r++) {
      for (let c = 0; c < playerCount - 1; c++) {
        // Prevent adjacent horizontal lines
        if (c === 0 || !newLadder[r][c - 1]) {
          newLadder[r][c] = Math.random() < 0.4
        }
      }
    }
    setLadder(newLadder)
  }, [players, results, playerCount, navigate])

  const startLadder = (playerIndex) => {
    if (tracedPaths[playerIndex] || activePlayer !== null) return;
    
    // Play sound
    if (isSoundOn) {
      const audio = new Audio('/sounds/button-click.wav')
      audio.play().catch(e => console.error('Audio play failed', e))
    }

    setActivePlayer(playerIndex)

    let currentCol = playerIndex
    const pathPoints = []

    // X ranges from 0 to playerCount. Center of column is col + 0.5
    const getX = (col) => col + 0.5
    // Y ranges from 0 to 100.
    const getY = (row) => row === 0 ? 0 : row === LADDER_ROWS + 1 ? 100 : (100 / (LADDER_ROWS + 1)) * row
    
    // Start point
    pathPoints.push({ x: getX(currentCol), y: getY(0) })

    for (let r = 0; r < LADDER_ROWS; r++) {
      pathPoints.push({ x: getX(currentCol), y: getY(r + 1) })
      if (currentCol < playerCount - 1 && ladder[r][currentCol]) {
        currentCol++
        pathPoints.push({ x: getX(currentCol), y: getY(r + 1) })
      } else if (currentCol > 0 && ladder[r][currentCol - 1]) {
        currentCol--
        pathPoints.push({ x: getX(currentCol), y: getY(r + 1) })
      }
    }
    // Final descent
    pathPoints.push({ x: getX(currentCol), y: getY(LADDER_ROWS + 1) })

    // Animate smoothly using requestAnimationFrame
    const segments = []
    let totalDistance = 0
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const p1 = pathPoints[i]
      const p2 = pathPoints[i+1]
      // Distance estimation for animation pacing (approximated since X and Y are different scales visually)
      const dist = Math.abs(p2.x - p1.x) * 10 + Math.abs(p2.y - p1.y) // weight X more to balance speed
      segments.push({ p1, p2, dist })
      totalDistance += dist
    }

    // Slowed down animation per user request
    const duration = 5000 // Updated duration
    let startTime = null

    // Play falling sound as the animation starts
    let fallingAudio = null;
    try {
      if (isSoundOn) {
        fallingAudio = new Audio('/sounds/falling.mp3')
        fallingAudio.loop = true // Optional: Loop if the sound is shorter than 5s
        fallingAudio.play().catch(e => console.error('Failed to play falling audio:', e))
      }
    } catch (err) {
      console.error('Falling audio init failed:', err)
    }

    const animatePath = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentDistance = progress * totalDistance

      let remaining = currentDistance
      const currentPathPoints = [segments[0].p1]

      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]
        if (remaining >= seg.dist) {
          currentPathPoints.push(seg.p2)
          remaining -= seg.dist
        } else {
          if (remaining > 0) {
            const ratio = remaining / seg.dist
            const interpX = seg.p1.x + (seg.p2.x - seg.p1.x) * ratio
            const interpY = seg.p1.y + (seg.p2.y - seg.p1.y) * ratio
            currentPathPoints.push({ x: interpX, y: interpY })
          }
          break
        }
      }

      setAnimatingPoints(currentPathPoints)

      if (progress < 1) {
        requestAnimationFrame(animatePath)
      } else {
        // Stop falling audio
        if (fallingAudio) {
          fallingAudio.pause()
          fallingAudio.currentTime = 0
        }

        // Play reveal sound when path is fully drawn
        try {
          if (isSoundOn) {
            const audio = new Audio('/sounds/reveal.mp3')
            audio.play().catch(e => console.error('Failed to play audio:', e))
          }
        } catch (err) {
          console.error('Audio initialization failed:', err)
        }
        
        const finalPathD = pathPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
        setTracedPaths(prev => {
          const nextPaths = {
            ...prev,
            [playerIndex]: { path: finalPathD, resultIndex: currentCol, color: getPathColor(playerIndex) }
          }
          if (Object.keys(nextPaths).length === playerCount) {
            setShowAllComplete(true)
          }
          return nextPaths
        })
        setActivePlayer(null)
        setAnimatingPoints([])
        
        if (isSoundOn) {
          const answerSound = new Audio('/assets/sounds/answer-correct.wav')
          answerSound.play().catch(e => console.log('Audio error:', e))
        }
      }
    }
    requestAnimationFrame(animatePath)
  }

  const handleShowAllResult = () => {
    const newTracedPaths = { ...tracedPaths }
    const getX = (col) => col + 0.5
    const getY = (row) => row === 0 ? 0 : row === LADDER_ROWS + 1 ? 100 : (100 / (LADDER_ROWS + 1)) * row

    for (let p = 0; p < playerCount; p++) {
      if (!newTracedPaths[p]) {
        let currentCol = p
        const pathPoints = []
        pathPoints.push({ x: getX(currentCol), y: getY(0) })
        for (let r = 0; r < LADDER_ROWS; r++) {
          pathPoints.push({ x: getX(currentCol), y: getY(r + 1) })
          if (currentCol < playerCount - 1 && ladder[r][currentCol]) {
            currentCol++
            pathPoints.push({ x: getX(currentCol), y: getY(r + 1) })
          } else if (currentCol > 0 && ladder[r][currentCol - 1]) {
            currentCol--
            pathPoints.push({ x: getX(currentCol), y: getY(r + 1) })
          }
        }
        pathPoints.push({ x: getX(currentCol), y: getY(LADDER_ROWS + 1) })
        const d = pathPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
        newTracedPaths[p] = { path: d, resultIndex: currentCol, color: getPathColor(p), instant: true }
      }
    }
    setTracedPaths(newTracedPaths)
    setShowAllComplete(true)
    setShowResults(true)
  }

  const handleToggleResults = () => {
    setShowResults(prev => !prev)
  }

  const handleBackToBuild = () => setShowBackConfirmModal(true)
  const handleConfirmBackToBuild = () => {
    setShowBackConfirmModal(false)
    navigate('/game/11/build', { state: { playerCount, players, results } })
  }
  const handleCancelBackToBuild = () => setShowBackConfirmModal(false)
  
  const handleBackToHome = () => setShowConfirmModal(true)
  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 800, behavior: 'smooth' }), 50)
  }
  const handleCancelExit = () => setShowConfirmModal(false)

  if (!players.length || !ladder.length) return null

  return (
    <LandscapeOnly>
      <div className="game11-gameplay-container">
        <header className="game-title-header">
          <button onClick={handleBackToBuild} className="header-back-btn">
            <div className="arrow-left"></div>
          </button>
          <h1>사다리타기 게임</h1>
          <button onClick={handleBackToHome} className="header-close-btn">X</button>
        </header>

        <div className="gameplay-content">
          {!gameStarted ? (
            <div className="game-start-modal">
              <h2>사다리타기 준비 완료!</h2>
              <p>총 {playerCount}개의 사다리가 생성되었습니다.</p>
              <button className="start-game-btn" onClick={() => setGameStarted(true)}>
                사다리타기 시작
              </button>
            </div>
          ) : (
            <div className="ladder-board-wrapper" style={{ height: 'calc(100vh - 200px)' }}>
              
              {/* Top Players Row */}
              <div style={{ display: 'flex', width: '100%', marginBottom: '10px' }}>
                {players.map((player, index) => (
                  <div key={`player-${index}`} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div 
                      className={`player-box ${activePlayer === index ? 'active' : ''} ${tracedPaths[index] ? 'completed' : ''}`}
                      onClick={() => startLadder(index)}
                      style={{ cursor: tracedPaths[index] ? 'default' : 'pointer' }}
                    >
                      {player}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ladder SVG */}
              <div style={{ flex: 1, width: '100%', position: 'relative' }}>
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox={`0 0 ${playerCount} 100`} 
                  preserveAspectRatio="none" 
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  {/* Vertical Lines */}
                  {Array.from({ length: playerCount }).map((_, col) => (
                    <line 
                      key={`v-${col}`} 
                      x1={col + 0.5} y1="0" x2={col + 0.5} y2="100" 
                      stroke="#adb5bd" strokeLinecap="round" strokeWidth="4" 
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}

                  {/* Horizontal Lines */}
                  {ladder.map((rowArr, rowIndex) => 
                    rowArr.map((hasRung, colIndex) => {
                      if (!hasRung) return null
                      const y = (100 / (LADDER_ROWS + 1)) * (rowIndex + 1)
                      return (
                        <line 
                          key={`h-${rowIndex}-${colIndex}`} 
                          x1={colIndex + 0.5} y1={y} x2={colIndex + 1.5} y2={y} 
                          stroke="#adb5bd" strokeLinecap="round" strokeWidth="4" 
                          vectorEffect="non-scaling-stroke"
                        />
                      )
                    })
                  )}

                  {/* Traced Paths (Hidden while someone is actively playing) */}
                  {activePlayer === null && Object.entries(tracedPaths).map(([playerId, data]) => {
                    return (
                      <path 
                        key={`path-${playerId}`}
                        d={data.path}
                        fill="none"
                        stroke={data.color}
                        strokeWidth="8"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className={`traced-path ${data.instant ? 'instant' : ''}`}
                      />
                    )
                  })}

                  {/* Active Animating Path */}
                  {activePlayer !== null && animatingPoints.length > 0 && (
                     <path 
                       key="active-path"
                       d={animatingPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                       fill="none"
                       stroke={getPathColor(activePlayer)}
                       strokeWidth="8"
                       strokeLinejoin="round"
                       strokeLinecap="round"
                       vectorEffect="non-scaling-stroke"
                       className="animating-path JS-drawn"
                     />
                  )}
                </svg>

                {/* Tracer Penguin Overlay */}
                {activePlayer !== null && animatingPoints.length > 0 && (() => {
                  const lastPt = animatingPoints[animatingPoints.length - 1];
                  return (
                    <img 
                      src="/images/penguin-face.png"
                      alt="Tracer"
                      style={{
                        position: 'absolute',
                        left: `${(lastPt.x / playerCount) * 100}%`,
                        top: `${lastPt.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '50px',
                        height: 'auto',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }}
                    />
                  );
                })()}
              </div>

              {/* Bottom Results Row */}
              <div style={{ display: 'flex', width: '100%', marginTop: '10px' }}>
                {results.map((result, index) => {
                  const matchedPlayer = Object.entries(tracedPaths).find(([, data]) => data.resultIndex === index)
                  const isFinished = !!matchedPlayer
                  
                  return (
                    <div key={`result-${index}`} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <div 
                        className={`result-box ${isFinished ? 'revealed' : ''}`}
                        style={isFinished ? { borderColor: matchedPlayer[1].color, color: matchedPlayer[1].color } : {}}
                      >
                        {isFinished ? result : (showResults ? result : '?')}
                        {isFinished && (
                          <div className="matched-player-tag" style={{ backgroundColor: matchedPlayer[1].color }}>
                            {players[matchedPlayer[0]]}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {gameStarted && (
            <div className="game-utilities">
              {/* Left Toggles Section */}
              <div className="utility-toggles" style={{ display: 'flex', gap: '30px', marginRight: 'auto' }}>
                <div className="toggle-item">
                  <span className="toggle-icon">
                    {isSoundOn ? <HiVolumeUp /> : <HiVolumeOff />}
                  </span>
                  <div className="toggle-switch" onClick={() => setIsSoundOn(!isSoundOn)}>
                    <div className={`toggle-slider ${isSoundOn ? 'active' : ''}`}></div>
                  </div>
                </div>

                <div className="toggle-item">
                  <span className="toggle-icon">
                    <HiLightBulb />
                  </span>
                  <div 
                    className={`toggle-switch ${showAllComplete || activePlayer !== null ? 'disabled' : ''}`}
                    onClick={() => {
                      if (!showAllComplete && activePlayer === null) {
                        handleToggleResults()
                      }
                    }}
                  >
                    <div className={`toggle-slider ${showResults ? 'active' : ''}`}></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="utility-actions">
                {!showAllComplete ? (
                  <button className="check-answer-btn" onClick={handleShowAllResult} disabled={activePlayer !== null}>
                    전체 결과 보기
                  </button>
                ) : (
                  <button className="game-complete-btn" onClick={() => navigate('/game/11/finish', { state: { gamePath: '/game/11' } })}>
                    게임 종료
                  </button>
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
                <h3>만들기로 돌아가시겠습니까?</h3>
                <p>현재 진행 상황이 초기화됩니다.</p>
              </div>
              <div className="confirm-modal-buttons">
                <button className="confirm-btn" onClick={handleConfirmBackToBuild}>확인</button>
                <button className="cancel-btn" onClick={handleCancelBackToBuild}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LandscapeOnly>
  )
}

export default Game11GamePlay
