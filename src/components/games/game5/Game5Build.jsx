import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Game5Build.css'

function Game5Build() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleBackToVideo = () => {
    navigate('/game/5/video')
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

  const handleAddQuestion = () => {
    if (inputValue.trim() && inputValue.trim().length >= 2 && questions.length < 16) {
      setQuestions([...questions, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (questions.length > 0) {
      navigate('/game/5/gameplay', { state: { questions } })
    }
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newQuestions = [...questions]
    const draggedQuestion = newQuestions[draggedIndex]
    
    newQuestions.splice(draggedIndex, 1)
    
    const finalDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
    newQuestions.splice(finalDropIndex, 0, draggedQuestion)
    
    setQuestions(newQuestions)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="game5-build-container">
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
              <h2>1. 문제 입력</h2>
              <div className="question-counter">
                <span className="current-count">{questions.length}</span>
                <span className="separator">/</span>
                <span className="total-count">16</span>
              </div>
            </div>
            <p className="section-description">최대 16개 / 필요한 문제의 갯수만큼 문제를 입력한 뒤 완료버튼을 누르세요.</p>
          </div>
          <div className="divider"></div>
          
          <div className="question-input-form">
            <div className="input-container">
              <label className="input-label">문제 추가</label>
              <input 
                type="text" 
                className="question-input"
                maxLength="8"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
              />
              <button 
                className="add-question-btn"
                onClick={handleAddQuestion}
                disabled={!inputValue.trim() || inputValue.trim().length < 2 || questions.length >= 16}
              >
                OK
              </button>
            </div>
            <div className="input-instructions">
              <p>* <span style={{color: '#d7560e', fontWeight: 'bold'}}>정답을 입력하면 초성문제가 자동 생성됩니다.</span></p>
              <p>* 1문제 당 최대 8글자, 최대 16문제 입력 가능합니다.</p>
              <p>* 드래그하여 문제 순서를 변경할 수 있습니다.</p>
            </div>
          </div>
          
          <div className="questions-list">
            {questions.map((question, index) => (
              <div 
                key={index} 
                className={`question-item ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="question-header">
                  <div className="question-number-box">{index + 1}</div>
                  <div className="question-content">
                    <span className="question-text">{question}</span>
                    <button 
                      className="delete-question-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteQuestion(index)
                      }}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="divider"></div>
          
          <div className="completion-section">
            <button 
              className="complete-btn"
              onClick={handleComplete}
              disabled={questions.length === 0}
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

export default Game5Build