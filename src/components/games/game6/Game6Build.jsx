import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game6Build.css'

function Game6Build() {
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState(location.state?.questions || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // 문제 객체 생성 함수
  const createQuestion = (questionText, answer, explanation = '', image = null) => {
    return {
      id: Date.now() + Math.random(), // 고유 ID
      question: questionText, // 문제 (필수)
      answer: answer, // 정답: 'O' 또는 'X' (필수)
      explanation: explanation, // 해설 (선택)
      image: image // 이미지 (선택)
    }
  }

  // 문제 추가 함수
  const handleAddQuestion = () => {
    if (questions.length >= 16) {
      alert('최대 16개까지만 문제를 추가할 수 있습니다.')
      return
    }
    
    const newQuestion = createQuestion(
      '',
      'O',
      '',
      null
    )
    setQuestions([...questions, newQuestion])
  }

  const handleBackToVideo = () => {
    navigate('/game/6/video')
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

  // 문제 삭제 함수
  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  // 문제 업데이트 함수
  const handleUpdateQuestion = (questionId, field, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }


  const handleComplete = () => {
    // 문제가 하나도 없으면 경고
    if (questions.length === 0) {
      alert('문제를 최소 1개 이상 추가해주세요.')
      return
    }

    // 빈 문제가 있는지 체크
    const emptyQuestions = questions.filter(q => !q.question.trim())
    if (emptyQuestions.length > 0) {
      alert('모든 문제를 입력해주세요.')
      return
    }

    // 문제 데이터를 정리하여 전달
    const gameData = {
      questions: questions.map((q, index) => ({
        id: q.id,
        number: index + 1,
        question: q.question.trim(),
        answer: q.answer,
        explanation: q.explanation.trim() || null,
        image: q.image || null
      }))
    }

    console.log('게임 데이터:', gameData)
    
    // 게임플레이 페이지로 이동하며 데이터 전달
    navigate('/game/6/gameplay', { state: gameData })
  }


  return (
    <div className="game6-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToVideo} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>OX 퀴즈 만들기</h1>
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
          
          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={question.id} className="question-item add-question-form">
                <div className="question-layout">
                  <div className="question-number-box">
                    {index + 1}
                  </div>
                  
                  <div className="form-row-container">
                    <div className="form-field">
                      <label>문제 <span className="required">(필수)</span></label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleUpdateQuestion(question.id, 'question', e.target.value)}
                        placeholder="문제를 입력하세요"
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-field">
                      <label>정답 <span className="required">(필수)</span></label>
                      <div className="answer-options">
                        <label className="radio-option">
                          <input
                            type="radio"
                            value="O"
                            checked={question.answer === 'O'}
                            onChange={(e) => handleUpdateQuestion(question.id, 'answer', e.target.value)}
                          />
                          <span>O</span>
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            value="X"
                            checked={question.answer === 'X'}
                            onChange={(e) => handleUpdateQuestion(question.id, 'answer', e.target.value)}
                          />
                          <span>X</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-field">
                      <label>해설 <span className="optional">(선택)</span></label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => handleUpdateQuestion(question.id, 'explanation', e.target.value)}
                        placeholder="해설을 입력하세요 (선택사항)"
                        rows="2"
                      />
                    </div>
                    
                    <div className="form-field">
                      <label>이미지 <span className="optional">(선택)</span></label>
                      <div className="image-upload-container">
                        {!question.image ? (
                          <>
                            <div className="file-drop-zone">
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg"
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (e) => {
                                      handleUpdateQuestion(question.id, 'image', e.target.result)
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                              />
                              <div className="file-drop-text">
                                이곳을 클릭하거나, 파일을 드롭하여 사진을 추가하세요
                              </div>
                            </div>
                            <div className="image-upload-info">
                              이미지는 문제와 함께 표시됩니다.
                            </div>
                          </>
                        ) : (
                          <div 
                            className="image-display"
                            onClick={() => handleUpdateQuestion(question.id, 'image', null)}
                          >
                            <img src={question.image} alt="선택된 이미지" />
                            <div className="image-remove-overlay">
                              <span>클릭하여 이미지 제거</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="delete-question-btn"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="add-question-btn" onClick={handleAddQuestion}>
            + 문제 추가
          </button>
          
          <div className="divider"></div>
          
          <div className="completion-section">
            <button 
              className="complete-btn"
              onClick={handleComplete}
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

export default Game6Build