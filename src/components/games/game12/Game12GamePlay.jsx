import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HiLightBulb, HiPhotograph } from 'react-icons/hi'
import './Game12GamePlay.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game12GamePlay({ globalSoundEnabled = true }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const questions = useMemo(() => location.state?.questions || [], [location.state?.questions])
  const puzzleSize = useMemo(() => location.state?.puzzleSize || 4, [location.state?.puzzleSize])
  const passedEdges = useMemo(() => location.state?.puzzleEdges || [], [location.state?.puzzleEdges])
  
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  // State for drag and drop pieces
  const [pieces, setPieces] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [wrongPieceId, setWrongPieceId] = useState(null)
  const [correctPieceId, setCorrectPieceId] = useState(null)
  const [showAnswerPreview, setShowAnswerPreview] = useState(false)
  const [showHintGuides, setShowHintGuides] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  // Puzzle clipping logic using SVG clipPath
  const puzzlePaths = useMemo(() => {
    const paths = [];
    const tabSize = 0.15; // Tab size relative to tile width/height (0-1 range)
    const span = 1 + 2 * tabSize;
    const mapT = (v) => (v + tabSize) / span;

    const M = (x, y) => `M ${mapT(x)} ${mapT(y)}`;
    const L = (x, y) => `L ${mapT(x)} ${mapT(y)}`;
    const C = (x1, y1, x2, y2, x, y) => `C ${mapT(x1)} ${mapT(y1)}, ${mapT(x2)} ${mapT(y2)}, ${mapT(x)} ${mapT(y)}`;
    
    const edges = passedEdges.length === puzzleSize ? passedEdges : Array.from({ length: puzzleSize }, () => 
      Array.from({ length: puzzleSize }, () => ({
        right: Math.random() < 0.5 ? 1 : -1,
        bottom: Math.random() < 0.5 ? 1 : -1
      }))
    );

    const getTilePath = (row, col) => {
      let d = M(0, 0);
      if (row === 0) d += L(1, 0);
      else {
        const type = edges[row - 1][col].bottom;
        d += L(0.5 - tabSize, 0);
        d += C(0.5 - tabSize, -type * tabSize, 0.5 + tabSize, -type * tabSize, 0.5 + tabSize, 0);
        d += L(1, 0);
      }
      if (col === puzzleSize - 1) d += L(1, 1);
      else {
        const type = edges[row][col].right;
        d += L(1, 0.5 - tabSize);
        d += C(1 + type * tabSize, 0.5 - tabSize, 1 + type * tabSize, 0.5 + tabSize, 1, 0.5 + tabSize);
        d += L(1, 1);
      }
      if (row === puzzleSize - 1) d += L(0, 1);
      else {
        const type = edges[row][col].bottom;
        d += L(0.5 + tabSize, 1);
        d += C(0.5 + tabSize, 1 - type * tabSize, 0.5 - tabSize, 1 - type * tabSize, 0.5 - tabSize, 1);
        d += L(0, 1);
      }
      if (col === 0) d += L(0, 0);
      else {
        const type = edges[row][col - 1].right;
        d += L(0, 0.5 + tabSize);
        d += C(type * tabSize, 0.5 + tabSize, type * tabSize, 0.5 - tabSize, 0, 0.5 - tabSize);
        d += L(0, 0);
      }
      return d;
    };

    for (let row = 0; row < puzzleSize; row++) {
      for (let col = 0; col < puzzleSize; col++) {
        paths.push(getTilePath(row, col));
      }
    }
    return paths;
  }, [puzzleSize, passedEdges]);

  // Initialize pieces
  useEffect(() => {
    const initialPieces = [];
    for (let i = 0; i < puzzleSize * puzzleSize; i++) {
      initialPieces.push({
        id: `piece-${i}`,
        originalIndex: i,
        location: 'pool', // 'pool' or `board-${index}`
      });
    }
    // Shuffle pieces
    setPieces(initialPieces.sort(() => Math.random() - 0.5));
    setGameCompleted(false);
  }, [currentQuestionIndex, puzzleSize])

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/12/build')
    }
  }, [questions, navigate])

  // Check if puzzle is completed
  useEffect(() => {
    if (pieces.length > 0 && pieces.every(p => p.location === `board-${p.originalIndex}`)) {
      if (!gameCompleted) {
        setGameCompleted(true);
        if (globalSoundEnabled) {
          const audio = new Audio('/sounds/answer-correct.wav')
          audio.play().catch(e => console.error('Failed to play audio:', e))
        }
      }
    }
  }, [pieces, gameCompleted, globalSoundEnabled])

  const handleBackToBuild = () => setShowBackConfirmModal(true)
  const handleConfirmBackToBuild = () => {
    setShowBackConfirmModal(false)
    navigate('/game/12/build', { state: { questions, puzzleSize, puzzleEdges: passedEdges } })
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1)
    else navigate('/game/12/finish', { state: { gamePath: '/game/12' } })
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1)
  }

  const handleDragStart = (e, pieceId) => {
    e.dataTransfer.setData('pieceId', pieceId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image scaled to the actual board slot size
    const slotEl = document.querySelector('.puzzle-slot');
    if (slotEl) {
      const rect = slotEl.getBoundingClientRect();
      const dragGhost = e.currentTarget.cloneNode(true);
      
      const span = 1.3; // matches the scale ratio
      dragGhost.style.width = `${rect.width * span}px`;
      dragGhost.style.height = `${rect.height * span}px`;
      dragGhost.style.position = 'absolute';
      dragGhost.style.top = '-9999px';
      dragGhost.style.left = '-9999px';
      // Reset any transformations the cloned node might have had
      dragGhost.style.transform = 'none';
      
      document.body.appendChild(dragGhost);
      
      // Center the drag cursor on the piece
      const offsetX = (rect.width * span) / 2;
      const offsetY = (rect.height * span) / 2;
      
      e.dataTransfer.setDragImage(dragGhost, offsetX, offsetY);
      
      // Cleanup after browser takes snapshot
      setTimeout(() => {
        if (document.body.contains(dragGhost)) {
          document.body.removeChild(dragGhost);
        }
      }, 0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLocation) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('pieceId');
    if (!pieceId || gameCompleted) return;

    setPieces(prevPieces => {
      const newPieces = [...prevPieces];
      const draggedPieceIndex = newPieces.findIndex(p => p.id === pieceId);
      
      if (draggedPieceIndex === -1) return prevPieces;

      // If target is a board slot, check for correctness
      if (targetLocation.startsWith('board-')) {
        const slotIndex = parseInt(targetLocation.split('-')[1]);
        const draggedPiece = newPieces[draggedPieceIndex];
        
        // Validation: Must match the original index
        if (draggedPiece.originalIndex !== slotIndex) {
          // Play wrong sound
          if (globalSoundEnabled) {
            const audio = new Audio('/sounds/puzzle-wrong.wav');
            audio.play().catch(e => console.error('Failed to play wrong sound:', e));
          }
          
          // Trigger shake effect
          setWrongPieceId(pieceId);
          setTimeout(() => setWrongPieceId(null), 500);
          
          // Return to pool (or stay where it was if it was already on board elsewhere)
          newPieces[draggedPieceIndex].location = 'pool';
          return newPieces;
        }

        // Correct Placement!
        if (globalSoundEnabled) {
          const audio = new Audio('/sounds/puzzle-correct.mp3');
          audio.play().catch(e => console.error('Failed to play correct sound:', e));
        }
        
        setCorrectPieceId(pieceId);
        setTimeout(() => setCorrectPieceId(null), 800);

        const occupantIndex = newPieces.findIndex(p => p.location === targetLocation);
        
        if (occupantIndex !== -1) {
          // Swap locations
          const tempLocation = newPieces[draggedPieceIndex].location;
          newPieces[occupantIndex].location = tempLocation;
        }
      }

      newPieces[draggedPieceIndex].location = targetLocation;
      return newPieces;
    });
  };

  const handleRandomReveal = () => {
    setPieces(prevPieces => {
      const newPieces = [...prevPieces];
      // Find a piece that is not in its correct position
      const unsortedPieces = newPieces.filter(p => p.location !== `board-${p.originalIndex}`);
      
      if (unsortedPieces.length === 0) return prevPieces;

      // Pick random unsorted piece
      const pieceToMove = unsortedPieces[Math.floor(Math.random() * unsortedPieces.length)];
      const targetLocation = `board-${pieceToMove.originalIndex}`;
      
      // If target location is occupied, move its occupant to the pool
      const occupant = newPieces.find(p => p.location === targetLocation);
      if (occupant) {
        occupant.location = 'pool';
      }

      pieceToMove.location = targetLocation;
      return newPieces;
    });
  };

  if (questions.length === 0) return null

  const imageRatio = currentQuestion?.ratio || 16 / 9;
  
  const gridStyle = {
    aspectRatio: `${imageRatio}`,
    width: `min(100cqw, 100cqh * ${imageRatio})`,
    height: `min(100cqh, 100cqw / ${imageRatio})`,
  };

  // Generate Piece JSX
  const renderPiece = (piece) => {
    const row = Math.floor(piece.originalIndex / puzzleSize)
    const col = piece.originalIndex % puzzleSize
    
    const scale = 1.3;
    const tabOffset = 0.15;
    
    // The paths are mapped to a coordinate system of [0, 1] internally but span over 
    // the actual SVG viewBox [0, 1]. However, since the tabs protrude by `tabOffset`,
    // the actual visual bounds of the drawn piece go from `-tabOffset` to `1 + tabOffset`.
    // We adjust the SVG `viewBox` to encompass this entire bounds so the tabs are never clipped.


    return (
      <div 
        key={piece.id}
        className={`puzzle-piece-container ${piece.location === 'pool' ? 'in-pool' : ''} ${gameCompleted ? 'completed' : ''} ${wrongPieceId === piece.id ? 'shake-error' : ''} ${correctPieceId === piece.id ? 'correct-pulse' : ''}`}
        draggable={!gameCompleted}
        onDragStart={(e) => handleDragStart(e, piece.id)}
        style={{
          margin: '-0.5px', // helps interlocking fit visually
          ...(piece.location !== 'pool' 
              ? { top: '-15%', left: '-15%', width: '130%', height: '130%', position: 'absolute' } 
              : { position: 'relative', aspectRatio: imageRatio })
        }}
      >
        <svg 
          viewBox="0 0 1 1" 
          preserveAspectRatio="none" 
          style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none', overflow: 'visible' }}
        >
          <defs>
            <pattern 
              id={`puzzle-img-${piece.id}`} 
              patternUnits="userSpaceOnUse" 
              width={`${puzzleSize / scale}`} 
              height={`${puzzleSize / scale}`} 
              x={`${(tabOffset - col) / scale}`} 
              y={`${(tabOffset - row) / scale}`}
            >
              <image 
                href={currentQuestion.imageUrl}
                width={`${puzzleSize / scale}`}
                height={`${puzzleSize / scale}`}
                preserveAspectRatio="none"
              />
            </pattern>
          </defs>
          <path 
            d={puzzlePaths[piece.originalIndex]} 
            fill={`url(#puzzle-img-${piece.id})`} 
            filter="url(#puzzle-bevel-filter)"
          />
          {/* Subtle outer stroke for depth */}
          <path 
            d={puzzlePaths[piece.originalIndex]} 
            fill="none" 
            stroke="rgba(0,0,0,0.2)" 
            strokeWidth="0.006" 
          />
          {/* Inner highlight stroke */}
          <path 
            d={puzzlePaths[piece.originalIndex]} 
            fill="none" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="0.003" 
          />
        </svg>
      </div>
    );
  };

  // Internal component to draw irregular paths only for internal edges (avoiding board borders)
  const InternalBoardGuides = () => {
    const segments = useMemo(() => {
      if (!passedEdges || passedEdges.length !== puzzleSize) return [];
      
      const lines = [];
      const step = 100 / puzzleSize;
      const tabSize = 0.15 * step;

      // Horizontal edges (Internal only: skips the very bottom border)
      for (let row = 0; row < puzzleSize - 1; row++) {
        for (let col = 0; col < puzzleSize; col++) {
          const type = passedEdges[row][col].bottom;
          const xStart = col * step;
          const y = (row + 1) * step;
          
          let path = `M ${xStart} ${y}`;
          path += ` L ${xStart + step * 0.5 - tabSize} ${y}`;
          path += ` C ${xStart + step * 0.5 - tabSize} ${y - type * tabSize}, ${xStart + step * 0.5 + tabSize} ${y - type * tabSize}, ${xStart + step * 0.5 + tabSize} ${y}`;
          path += ` L ${xStart + step} ${y}`;
          lines.push(path);
        }
      }
      
      // Vertical edges (Internal only: skips the very right border)
      for (let row = 0; row < puzzleSize; row++) {
        for (let col = 0; col < puzzleSize - 1; col++) {
          const type = passedEdges[row][col].right;
          const x = (col + 1) * step;
          const yStart = row * step;
          
          let path = `M ${x} ${yStart}`;
          path += ` L ${x} ${yStart + step * 0.5 - tabSize}`;
          path += ` C ${x + type * tabSize} ${yStart + step * 0.5 - tabSize}, ${x + type * tabSize} ${yStart + step * 0.5 + tabSize}, ${x} ${yStart + step * 0.5 + tabSize}`;
          path += ` L ${x} ${yStart + step}`;
          lines.push(path);
        }
      }
      return lines;
    }, []);

    return (
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        style={{ 
          position: 'absolute', 
          top: 0, left: 0, 
          width: '100%', height: '100%', 
          pointerEvents: 'none',
          gridColumn: `1 / span ${puzzleSize}`,
          gridRow: `1 / span ${puzzleSize}`,
          zIndex: 0
        }}
      >
        {segments.map((d, i) => (
          <path 
            key={i} 
            d={d} 
            fill="none" 
            stroke="rgba(1, 39, 91, 0.15)" 
            strokeWidth="0.5" 
            strokeDasharray="1.5, 1.5"
          />
        ))}
      </svg>
    );
  };

  return (
    <LandscapeOnly>
      <div className="game12-gameplay-container">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            {puzzlePaths.map((d, i) => (
              <clipPath key={i} id={`puzzle-clip-${i}`} clipPathUnits="objectBoundingBox">
                <path d={d} />
              </clipPath>
            ))}
            
            {/* 3D Bevel Filter */}
            <filter id="puzzle-bevel-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.01" result="blur"/>
              <feSpecularLighting in="blur" surfaceScale="0.02" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="specOut">
                <feDistantLight azimuth="225" elevation="45"/>
              </feSpecularLighting>
              <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
              <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litGraphic"/>
            </filter>
          </defs>
        </svg>

        <header className="game-title-header">
          <button onClick={handleBackToBuild} className="header-back-btn">
            <div className="arrow-left"></div>
          </button>
          <h1>퍼즐 게임</h1>
          <button onClick={handleBackToHome} className="header-close-btn">
            X
          </button>
        </header>

        <div className="gameplay-container">
          {!gameStarted ? (
            <div className="game-start-section">
              <h2>퍼즐 게임</h2>
              <p>총 {questions.length}개의 문제, {puzzleSize}x{puzzleSize} 퍼즐이 준비되었습니다.</p>
              <button className="start-game-btn" onClick={handleStartGame}>
                게임 시작
              </button>
            </div>
          ) : (
            <div className="game-play-section">
              <div className={`puzzle-layout ${gameCompleted ? 'game-completed' : ''}`}>
                {/* Left Side: Puzzle Board */}
                <div className={`puzzle-board-area ${!gameCompleted && showAnswerPreview ? 'with-info' : ''}`}>
                  
                  {/* Info Pane (Top-Left logically, Left visually) */}
                  <div className={`puzzle-info-pane ${!gameCompleted && showAnswerPreview ? 'visible' : ''}`}>
                    {!gameCompleted && (
                      <div className={`puzzle-answer-preview ${showAnswerPreview ? 'visible' : ''}`} style={{ width: '180px' }}>
                        <img src={currentQuestion.imageUrl} alt="Answer Preview" />
                      </div>
                    )}
                  </div>

                  {/* Puzzle Board Container */}
                  <div className="puzzle-board-container" style={{ flex: 1, minWidth: 0, height: '100%', position: 'relative' }}>
                    <div 
                      className={`puzzle-grid ${gameCompleted ? 'completed' : ''}`}
                      style={{
                        ...gridStyle,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${puzzleSize}, 1fr)`,
                        gridTemplateRows: `repeat(${puzzleSize}, 1fr)`,
                        margin: 'auto',
                        position: 'relative',
                        maxHeight: '100%'
                      }}
                    >
                      {!gameCompleted && (
                        <div className={`puzzle-hint-bg ${showHintGuides ? 'visible' : ''}`} 
                             style={{ backgroundImage: `url(${currentQuestion.imageUrl})` }} />
                      )}
                      {!gameCompleted && <InternalBoardGuides />}
                      {[...Array(puzzleSize * puzzleSize)].map((_, i) => (
                        <div 
                          key={`slot-${i}`}
                          className="puzzle-slot"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, `board-${i}`)}
                        >
                          {pieces.filter(p => p.location === `board-${i}`).map(renderPiece)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {gameCompleted && (
                    <>
                      <div className="game-completed-overlay">
                        <div className="answer-display">
                          <p className="answer-text">{currentQuestion.answer}</p>
                        </div>
                      </div>
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
                            <button className="next-arrow-btn" onClick={() => navigate('/game/12/finish', { state: { gamePath: '/game/12' } })}>
                              <span className="arrow-icon">→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Side: Pieces Pool */}
                <div className={`puzzle-pieces-area ${gameCompleted ? 'hidden-pool' : ''}`}>
                  <div className="pieces-pool-header">퍼즐 조각</div>
                  <div 
                    className="pieces-pool"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'pool')}
                    style={{
                      gridTemplateColumns: puzzleSize === 2 ? 'repeat(1, 1fr)' : puzzleSize >= 6 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
                    }}
                  >
                    {pieces.filter(p => p.location === 'pool').map(renderPiece)}
                  </div>
                </div>
              </div>

              <div className="game-utilities">
                <div className="utility-left-section">
                  {!gameCompleted ? (
                    <div className="utility-toggles">
                      <div className="toggle-item">
                        <div className="toggle-icon"><HiPhotograph /></div>
                        <div 
                          className={`toggle-switch ${showAnswerPreview ? 'on' : ''}`}
                          onClick={() => setShowAnswerPreview(!showAnswerPreview)}
                        >
                          <div className={`toggle-slider ${showAnswerPreview ? 'active' : ''}`} />
                        </div>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-icon"><HiLightBulb /></div>
                        <div 
                          className={`toggle-switch ${showHintGuides ? 'on' : ''}`}
                          onClick={() => setShowHintGuides(!showHintGuides)}
                        >
                          <div className={`toggle-slider ${showHintGuides ? 'active' : ''}`} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="utility-toggles-placeholder" />
                  )}
                </div>

                <div className="utility-center-section">
                  <div className="round-counter">
                    <span className="current-round">{currentQuestionIndex + 1}</span> / {questions.length}
                  </div>
                </div>

                <div className="utility-right-section">
                  <div className="utility-actions">
                    {!gameCompleted ? (
                      <button className="random-reveal-btn" onClick={handleRandomReveal}>
                        작은 도움 받기
                      </button>
                    ) : (
                      <div className="reveal-placeholder"></div>
                    )}
                  </div>
                </div>
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
                <h3>게임 만들기로 돌아가시겠습니까?</h3>
                <p>진행중인 게임은 저장되지 않습니다.</p>
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

export default Game12GamePlay
