import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game3Build.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game3Build() {
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState(location.state?.questions || [])
  const [inputValue, setInputValue] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [inputWarning, setInputWarning] = useState('')

  const handleBackToVideo = () => {
    navigate('/game/3/video')
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

  const validateInput = (value) => {
    // 띄어쓰기 검사
    if (value.includes(' ')) {
      return '띄어쓰기는 사용할 수 없습니다.'
    }
    
    // 특수문자 검사 (한글, 영문, 숫자만 허용)
    const specialCharRegex = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/
    if (specialCharRegex.test(value)) {
      return '특수문자는 사용할 수 없습니다.'
    }
    
    return ''
  }

  const handleAddQuestion = () => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue || questions.length >= 16) return
    
    const warning = validateInput(trimmedValue)
    if (warning) {
      setInputWarning(warning)
      return
    }
    
    setQuestions([...questions, trimmedValue])
    setInputValue('')
    setInputWarning('')
  }

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (questions.length > 0) {
      navigate('/game/3/gameplay', { state: { questions } })
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
    
    // 드래그된 아이템 제거
    newQuestions.splice(draggedIndex, 1)
    
    // 새 위치에 삽입
    const finalDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
    newQuestions.splice(finalDropIndex, 0, draggedQuestion)
    
    setQuestions(newQuestions)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <LandscapeOnly>
    <div className="game3-build-container">
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
                onChange={(e) => {
                  const value = e.target.value
                  setInputValue(value)
                  
                  // 실시간 검증
                  if (value.trim()) {
                    const warning = validateInput(value)
                    setInputWarning(warning)
                  } else {
                    setInputWarning('')
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
              />
              <button 
                className="add-question-btn"
                onClick={handleAddQuestion}
                disabled={!inputValue.trim() || questions.length >= 16 || inputWarning}
              >
                OK
              </button>
            </div>
            {inputWarning && (
              <div className="input-warning">
                <p>{inputWarning}</p>
              </div>
            )}
            <div className="input-instructions">
              <p>* 단어를 입력하면 글자 단위로 자동 분리되어 문제가 생성됩니다.</p>
              <p>* 1문제당 최대 8글자, 최대 16문제 입력 가능합니다.</p>
              <p>* 드래그하여 문제 순서를 변경할 수 있습니다.</p>
              <p>* 특수문자와 띄어쓰기는 사용할 수 없습니다.</p>
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
                    <span className="question-text">{question.split('').join('/')}</span>
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
    </LandscapeOnly>
  )
}

export default Game3Build