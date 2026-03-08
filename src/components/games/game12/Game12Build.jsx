import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import localforage from 'localforage'
import './Game12Build.css'
import LandscapeOnly from '../../common/LandscapeOnly'
import SaveCompleteModal from '../../common/SaveCompleteModal'

// Component to draw irregular puzzle lines based on shared edges
const PuzzleLines = ({ size, edges }) => {
  const segments = useMemo(() => {
    if (!edges || edges.length !== size) return [];
    
    const lines = [];
    const step = 100 / size;
    const tabSize = 0.15 * step; // Match gameplay tab size ratio

    // Horizontal edges (puzzle piece bottom edges)
    for (let row = 0; row < size - 1; row++) {
      for (let col = 0; col < size; col++) {
        const type = edges[row][col].bottom;
        const xStart = col * step;
        const y = (row + 1) * step;
        
        let path = `M ${xStart} ${y}`;
        path += ` L ${xStart + step * 0.5 - tabSize} ${y}`;
        path += ` C ${xStart + step * 0.5 - tabSize} ${y - type * tabSize}, ${xStart + step * 0.5 + tabSize} ${y - type * tabSize}, ${xStart + step * 0.5 + tabSize} ${y}`;
        path += ` L ${xStart + step} ${y}`;
        lines.push(path);
      }
    }
    
    // Vertical edges (puzzle piece right edges)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size - 1; col++) {
        const type = edges[row][col].right;
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
  }, [size, edges]);

  return (
    <svg 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none" 
      style={{ 
        position: 'absolute', 
        top: 0, left: 0, width: '100%', height: '100%', 
        pointerEvents: 'none',
        zIndex: 5,
        filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.8))'
      }}
    >
      {segments.map((d, i) => (
        <path 
          key={i} 
          d={d} 
          fill="none" 
          stroke="white" 
          strokeWidth="0.6" 
          strokeDasharray="1.5,1.5"
        />
      ))}
    </svg>
  );
};

function Game12Build() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 저장된 데이터가 있으면 불러오기
  const [questions, setQuestions] = useState(() => {
    const initialState = location.state?.questions || [];
    // Handle property name mapping for robustness
    return initialState.map(q => ({
      ...q,
      imageUrl: q.imageUrl || q.image // Map 'image' back to 'imageUrl' if needed
    }));
  })
  const [puzzleSize, setPuzzleSize] = useState(location.state?.puzzleSize || 4) // 기본값 4x4
  const [puzzleEdges, setPuzzleEdges] = useState(location.state?.puzzleEdges || [])
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const handleBackToHome = () => setShowConfirmModal(true)
  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 800, behavior: 'smooth' }), 50)
  }
  const handleCancelExit = () => setShowConfirmModal(false)

  const handleBackToStart = () => setShowBackConfirmModal(true)
  const handleConfirmBackToStart = () => {
    setShowBackConfirmModal(false)
    navigate('/game/12/video')
  }
  const handleCancelBackToStart = () => setShowBackConfirmModal(false)

  // Generate stable puzzle edges when size changes
  useEffect(() => {
    if (puzzleEdges.length !== puzzleSize) {
      const newEdges = Array.from({ length: puzzleSize }, () => 
        Array.from({ length: puzzleSize }, () => ({
          right: Math.random() < 0.5 ? 1 : -1,
          bottom: Math.random() < 0.5 ? 1 : -1
        }))
      );
      setPuzzleEdges(newEdges);
    }
  }, [puzzleSize, puzzleEdges.length]);

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target.result;
        const img = new Image();
        img.onload = () => {
          resolve({ url, width: img.width, height: img.height, ratio: img.width / img.height });
        };
        img.src = url;
      };
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) return

    const availableSlots = 10 - questions.length
    const filesToAdd = imageFiles.slice(0, availableSlots)

    const newQuestions = await Promise.all(
      filesToAdd.map(async file => {
        const imageData = await readFileAsDataURL(file);
        return {
          id: Date.now() + Math.random(),
          image: file,
          imageUrl: imageData.url,
          ratio: imageData.ratio,
          answer: ''
        };
      })
    )

    setQuestions([...questions, ...newQuestions])

    // 파일 input 초기화
    event.target.value = ''
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) return

    const availableSlots = 10 - questions.length
    const filesToAdd = imageFiles.slice(0, availableSlots)

    const newQuestions = await Promise.all(
      filesToAdd.map(async file => {
        const imageData = await readFileAsDataURL(file);
        return {
          id: Date.now() + Math.random(),
          image: file,
          imageUrl: imageData.url,
          ratio: imageData.ratio,
          answer: ''
        };
      })
    )

    setQuestions([...questions, ...newQuestions])
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleClick = () => {
    document.getElementById('file-input').click()
  }

  const handleAnswerChange = (questionId, answer) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, answer } : q
    ))
  }

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (questions.length === 0) {
      alert('문제를 최소 1개 이상 추가해주세요.')
      return
    }

    const isIncomplete = questions.some(q => !q.answer.trim() || !q.imageUrl)
    if (isIncomplete) {
      alert('모든 문제의 이미지와 정답을 입력해주세요.')
      return
    }

    const gameData = {
      questions: questions.map((q, index) => ({
        id: q.id,
        number: index + 1,
        answer: q.answer.trim(),
        imageUrl: q.imageUrl,
        ratio: q.ratio
      })),
      puzzleSize: puzzleSize,
      puzzleEdges: puzzleEdges
    }

    navigate('/game/12/gameplay', { state: gameData })
  }

  const handleSaveDraft = async () => {
    try {
      if (questions.length === 0) {
        alert('저장할 데이터가 없습니다.')
        return
      }

      const existingDrafts = await localforage.getItem('game12_drafts') || []
      
      const newDraft = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        questions: questions,
        puzzleSize: puzzleSize,
        puzzleEdges: puzzleEdges
      }

      const updatedDrafts = [newDraft, ...existingDrafts].slice(0, 10)
      
      await localforage.setItem('game12_drafts', updatedDrafts)
      setShowSaveModal(true)
    } catch (error) {
      console.error('Save draft failed:', error)
      alert('임시저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <LandscapeOnly>
    <div className="game12-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToStart} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>퍼즐 만들기</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>

      <div className="game-play-container">
        <div className="question-input-section">
          {/* Section 1: Puzzle Size Selection */}
          <div className="section-header">
            <div className="section-left">
              <h2>1. 퍼즐 개수 선택</h2>
            </div>
            <p className="section-description">이미지를 덮을 퍼즐의 가로x세로 개수를 선택하세요.</p>
          </div>
          <div className="divider"></div>
          
          <div className="puzzle-size-selection">
            {[2, 3, 4, 5, 6, 7].map((size) => (
              <button
                key={size}
                className={`size-btn ${puzzleSize === size ? 'active' : ''}`}
                onClick={() => {
                  setPuzzleSize(size);
                  setPuzzleEdges([]); // Reset to trigger regen
                }}
              >
                {size} x {size}
              </button>
            ))}
          </div>

          {/* Section 2: Photo & Answer Input */}
          <div className="section-header" style={{ marginTop: '40px' }}>
            <div className="section-left">
              <h2>2. 사진 및 정답 추가</h2>
              <div className="question-counter">
                <span className="current-count">{questions.length}</span>
                <span className="separator">/</span>
                <span className="total-count">10</span>
              </div>
            </div>
            <p className="section-description">최대 10장 / 사진을 추가하고 정답을 입력해 주세요.</p>
          </div>
          <div className="divider"></div>

          <div
            className="photo-drop-zone"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p>이 곳을 클릭하거나 파일을 드롭하여 사진을 추가하세요.</p>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div className="photo-grid">
            {questions.map((question, index) => (
              <div key={question.id} className="photo-grid-item">
                <div className="photo-container">
                  <div className="image-aspect-wrapper" style={{ 
                    position: 'relative',
                    width: question.ratio > 1 ? '100%' : `${question.ratio * 100}%`,
                    height: question.ratio > 1 ? `${(1 / question.ratio) * 100}%` : '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={question.imageUrl}
                      alt={`업로드된 이미지 ${index + 1}`}
                      className="uploaded-image"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <PuzzleLines size={puzzleSize} edges={puzzleEdges} />
                  </div>
                  <button
                    className="delete-photo-btn"
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="answer-input-container">
                  <input
                    type="text"
                    className="answer-input"
                    placeholder="정답 입력 (최대 20글자)"
                    value={question.answer}
                    maxLength="20"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="completion-section">
            {questions.length === 0 ? (
              <span className="completion-warning">
                * 문제를 1문제 이상 추가해주세요
              </span>
            ) : questions.some(q => !q.answer.trim()) ? (
              <span className="completion-warning">
                * 모든 문제의 정답을 입력해주세요
              </span>
            ) : null}
            <div className="action-buttons-group">
              <button
                className="save-draft-btn"
                onClick={handleSaveDraft}
                disabled={questions.length === 0}
              >
                임시저장
              </button>
              <button
                className="complete-btn"
                onClick={handleComplete}
                disabled={questions.length === 0 || questions.some(q => !q.answer.trim())}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <SaveCompleteModal 
          isOpen={showSaveModal} 
          onClose={() => setShowSaveModal(false)} 
          onFinish={() => navigate('/game/12')}
        />
      )}

      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelExit}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>홈으로 돌아가시겠습니까?</h3>
              <p>만들기가 중단됩니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmExit}>확인</button>
              <button className="cancel-btn" onClick={handleCancelExit}>취소</button>
            </div>
          </div>
        </div>
      )}

      {showBackConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelBackToStart}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>시작 화면으로 돌아가시겠습니까?</h3>
              <p>준비 중인 내용이 초기화됩니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmBackToStart}>확인</button>
              <button className="cancel-btn" onClick={handleCancelBackToStart}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </LandscapeOnly>
  )
}

export default Game12Build
