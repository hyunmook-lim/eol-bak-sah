import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game2Build.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game2Build() {
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState(location.state?.questions || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [lowQualityWarning, setLowQualityWarning] = useState(null)

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

  const checkImageQuality = (file) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const width = img.width
        const height = img.height
        const minDimension = 400 // 최소 권장 해상도

        if (width < minDimension || height < minDimension) {
          resolve({
            isLowQuality: true,
            width,
            height,
            fileName: file.name
          })
        } else {
          resolve({ isLowQuality: false })
        }
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) return

    const availableSlots = 20 - questions.length
    const filesToAdd = imageFiles.slice(0, availableSlots)

    // 화질 체크
    const qualityChecks = await Promise.all(
      filesToAdd.map(file => checkImageQuality(file))
    )

    const lowQualityFiles = qualityChecks
      .filter(check => check.isLowQuality)
      .map(check => check.fileName)

    if (lowQualityFiles.length > 0) {
      setLowQualityWarning(`화질이 낮은 사진이 ${lowQualityFiles.length}개 있습니다. 더 선명한 사진을 사용하는 것을 권장합니다.`)
      setTimeout(() => setLowQualityWarning(null), 5000)
    }

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

  const handleDrop = async (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) return

    const availableSlots = 20 - questions.length
    const filesToAdd = imageFiles.slice(0, availableSlots)

    // 화질 체크
    const qualityChecks = await Promise.all(
      filesToAdd.map(file => checkImageQuality(file))
    )

    const lowQualityFiles = qualityChecks
      .filter(check => check.isLowQuality)
      .map(check => check.fileName)

    if (lowQualityFiles.length > 0) {
      setLowQualityWarning(`화질이 낮은 사진이 ${lowQualityFiles.length}개 있습니다. 더 선명한 사진을 사용하는 것을 권장합니다.`)
      setTimeout(() => setLowQualityWarning(null), 5000)
    }

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
    <LandscapeOnly>
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

      {lowQualityWarning && (
        <div className="low-quality-warning">
          ⚠️ {lowQualityWarning}
        </div>
      )}

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
    </LandscapeOnly>
  )
}

export default Game2Build