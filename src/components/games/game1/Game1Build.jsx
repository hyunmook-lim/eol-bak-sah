import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Game1Build.css'

function Game1Build() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleBackToVideo = () => {
    navigate('/game/1/video')
  }

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  const handleAddQuestion = () => {
    if (inputValue.trim() && questions.length < 16) {
      setQuestions([...questions, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (questions.length > 0) {
      navigate('/game/1/gameplay', { state: { questions } })
    }
  }

  return (
    <div className="game1-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToVideo} className="header-back-btn">
          &lt;
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
                disabled={!inputValue.trim() || questions.length >= 16}
              >
                OK
              </button>
            </div>
            <div className="input-instructions">
              <p>* 1문제당 최대 8글자, 최대 16문제 입력 가능합니다.</p>
              <p>* 드래그하여 문제 순서를 변경할 수 있습니다.</p>
            </div>
          </div>
          
          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={index} className="question-item">
                <div className="question-header">
                  <div className="question-number-box">{index + 1}</div>
                  <div className="question-content">
                    <span className="question-text">{question}</span>
                    <button 
                      className="delete-question-btn"
                      onClick={() => handleDeleteQuestion(index)}
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
    </div>
  )
}

export default Game1Build