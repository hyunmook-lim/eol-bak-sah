import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game8Build.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game8Build() {
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState(location.state?.questions || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleBackToVideo = () => {
    navigate('/game/8/video')
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

    const availableSlots = 16 - questions.length
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

    const availableSlots = 16 - questions.length
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
      navigate('/game/8/build2', { state: { questions } })
    }
  }

  return (
    <LandscapeOnly>
    <div className="game8-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToVideo} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>게임 만들기</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
                <span className="total-count">16</span>
              </div>
            </div>
            <p className="section-description">최대 16장</p>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
            {questions.length === 0 ? (
              <span className="completion-warning">
                * 문제를 1문제 이상 추가해주세요
              </span>
            ) : questions.some(q => !q.answer.trim()) ? (
              <span className="completion-warning">
                * 모든 문제의 정답을 입력해주세요
              </span>
            ) : null}
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
    </LandscapeOnly>
  )
}

export default Game8Build
