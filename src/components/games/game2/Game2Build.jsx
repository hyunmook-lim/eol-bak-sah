import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game2Build.css'

function Game2Build() {
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState(location.state?.questions || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleBackToVideo = () => {
    navigate('/game/2/video')
  }

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


  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) return
    
    const availableSlots = 20 - questions.length
    const filesToAdd = imageFiles.slice(0, availableSlots)
    
    const newQuestions = filesToAdd.map(file => ({
      id: Date.now() + Math.random(),
      image: file,
      imageUrl: URL.createObjectURL(file),
      answer: ''
    }))
    
    setQuestions([...questions, ...newQuestions])
    
    // 파일 input 초기화
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) return
    
    const availableSlots = 20 - questions.length
    const filesToAdd = imageFiles.slice(0, availableSlots)
    
    const newQuestions = filesToAdd.map(file => ({
      id: Date.now() + Math.random(),
      image: file,
      imageUrl: URL.createObjectURL(file),
      answer: ''
    }))
    
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
    if (questions.length > 0) {
      navigate('/game/2/gameplay', { state: { questions } })
    }
  }

  return (
    <div className="game2-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToVideo} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>게임 만들기</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>
      
      <div className="game-play-container">
        <div className="question-input-section">
          <div className="section-header">
            <div className="section-left">
              <h2>1. 사진 추가</h2>
              <div className="question-counter">
                <span className="current-count">{questions.length}</span>
                <span className="separator">/</span>
                <span className="total-count">20</span>
              </div>
            </div>
            <p className="section-description">최대 20장</p>
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
                  <img 
                    src={question.imageUrl} 
                    alt={`업로드된 이미지 ${index + 1}`}
                    className="uploaded-image"
                  />
                  <button 
                    className="delete-photo-btn"
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    X
                  </button>
                </div>
                <div className="answer-input-container">
                  <input
                    type="text"
                    className="answer-input"
                    placeholder="정답을 입력하세요 (최대 10글자)"
                    value={question.answer}
                    maxLength="10"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="completion-section">
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

      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelExit}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>홈으로 돌아가시겠습니까?</h3>
              <p>작업 중인 내용이 저장되지 않을 수 있습니다.</p>
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

export default Game2Build