import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Game9Build.css'

function Game9Build() {
  const navigate = useNavigate()
  const location = useLocation()
  const [title, setTitle] = useState(location.state?.title || '')
  const [candidates, setCandidates] = useState(location.state?.candidates || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  // 후보 객체 생성 함수
  const createCandidate = (name = '', description = '', image = null) => {
    return {
      id: Date.now() + Math.random(), // 고유 ID
      name: name, // 후보 이름 (필수)
      description: description, // 후보 설명 (선택)
      image: image, // 후보 이미지 (선택)
      votes: 0 // 득표 수
    }
  }

  // 후보 추가 함수
  const handleAddCandidate = () => {
    if (candidates.length >= 6) {
      alert('최대 6개까지만 후보를 추가할 수 있습니다.')
      return
    }

    const newCandidate = createCandidate('', '', null)
    setCandidates([...candidates, newCandidate])
  }

  const handleBackToVideo = () => {
    navigate('/game/9/video')
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

  // 후보 삭제 함수
  const handleDeleteCandidate = (candidateId) => {
    setCandidates(candidates.filter(c => c.id !== candidateId))
  }

  // 후보 업데이트 함수
  const handleUpdateCandidate = (candidateId, field, value) => {
    setCandidates(candidates.map(c =>
      c.id === candidateId ? { ...c, [field]: value } : c
    ))
  }

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (dropIndex) => {
    if (draggedIndex === null) return

    const newCandidates = [...candidates]
    const draggedCandidate = newCandidates[draggedIndex]

    // 드래그된 항목 제거
    newCandidates.splice(draggedIndex, 1)
    // 드롭 위치에 삽입
    newCandidates.splice(dropIndex, 0, draggedCandidate)

    setCandidates(newCandidates)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleComplete = () => {
    // 제목이 비어있는지 체크
    if (!title.trim()) {
      alert('투표 제목을 입력해주세요.')
      return
    }

    // 후보가 2개 미만이면 경고
    if (candidates.length < 2) {
      alert('후보를 최소 2개 이상 추가해주세요.')
      return
    }

    // 빈 후보가 있는지 체크
    const emptyCandidates = candidates.filter(c => !c.name.trim())
    if (emptyCandidates.length > 0) {
      alert('모든 후보의 이름을 입력해주세요.')
      return
    }

    // 후보 데이터를 정리하여 전달
    const gameData = {
      title: title.trim(),
      candidates: candidates.map((c, index) => ({
        id: c.id,
        number: index + 1,
        name: c.name.trim(),
        description: c.description.trim() || null,
        image: c.image || null,
        votes: 0
      }))
    }

    console.log('게임 데이터:', gameData)

    // 게임플레이 페이지로 이동하며 데이터 전달
    navigate('/game/9/gameplay', { state: gameData })
  }

  return (
    <div className="game9-build-container">
      <header className="game-title-header">
        <button onClick={handleBackToVideo} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>투표 만들기</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>

      <div className="game-play-container">
        <div className="candidate-input-section">
          {/* 제목 입력 섹션 */}
          <div className="section-header">
            <div className="section-left">
              <h2>1. 제목 입력</h2>
            </div>
            <p className="section-description">최대 20자 입력 가능합니다.</p>
          </div>

          <div className="title-input-container">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  setTitle(e.target.value)
                }
              }}
              placeholder="투표 제목"
              maxLength={20}
              className="title-input"
            />
          </div>

          <div className="divider"></div>

          {/* 후보 입력 섹션 */}
          <div className="section-header">
            <div className="section-left">
              <h2>2. 후보 입력</h2>
              <div className="candidate-counter">
                <span className="current-count">{candidates.length}</span>
                <span className="separator">/</span>
                <span className="total-count">6</span>
              </div>
            </div>
            <div className="section-description-multi">
              <p className="section-description">최대 6개 입력 가능합니다.</p>
              <p className="section-description">드래그하여 후보의 순서를 변경할 수 있습니다.</p>
            </div>
          </div>

          <div className="candidates-list">
            {candidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className={`candidate-item add-candidate-form ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <div className="candidate-layout">
                  <div className="candidate-number-box">
                    {index + 1}
                  </div>

                  <div className="form-row-container">
                    <div className="form-field">
                      <label>후보 이름 <span className="required">(필수)</span></label>
                      <textarea
                        value={candidate.name}
                        onChange={(e) => handleUpdateCandidate(candidate.id, 'name', e.target.value)}
                        placeholder="후보 이름"
                        rows="3"
                      />
                    </div>

                    <div className="form-field">
                      <label>후보 설명 <span className="optional">(선택)</span></label>
                      <textarea
                        value={candidate.description}
                        onChange={(e) => handleUpdateCandidate(candidate.id, 'description', e.target.value)}
                        placeholder="후보 설명"
                        rows="3"
                      />
                    </div>

                    <div className="form-field">
                      <label>후보 이미지 <span className="optional">(선택)</span></label>
                      <div className="image-upload-container">
                        {!candidate.image ? (
                          <div className="file-drop-zone">
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg"
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = (e) => {
                                    handleUpdateCandidate(candidate.id, 'image', e.target.result)
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }}
                            />
                            <div className="file-drop-text">
                              이곳을 클릭하거나, 파일을 드롭하여 사진을 추가하세요
                            </div>
                          </div>
                        ) : (
                          <div
                            className="image-display"
                            onClick={() => handleUpdateCandidate(candidate.id, 'image', null)}
                          >
                            <img src={candidate.image} alt="선택된 이미지" />
                            <div className="image-remove-overlay">
                              <span>클릭하여 이미지 제거</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className="delete-candidate-btn"
                    onClick={() => handleDeleteCandidate(candidate.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="add-candidate-btn"
            onClick={handleAddCandidate}
            disabled={candidates.length >= 6}
          >
            + 후보 추가
          </button>

          <div className="divider"></div>

          <div className="completion-section">
            <button
              className="complete-btn"
              onClick={handleComplete}
              disabled={!title.trim() || candidates.length < 2 || candidates.some(c => !c.name.trim())}
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

export default Game9Build
