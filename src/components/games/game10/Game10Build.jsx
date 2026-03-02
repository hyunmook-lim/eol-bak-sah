import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import localforage from 'localforage'
import './Game10Build.css'
import LandscapeOnly from '../../common/LandscapeOnly'
import SaveCompleteModal from '../../common/SaveCompleteModal'

function Game10Build() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Players array, where each player has a name, truth1, truth2, and lie
  const [players, setPlayers] = useState(location.state?.players || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleBackToVideo = () => navigate('/game/10/video')
  const handleBackToHome = () => setShowConfirmModal(true)

  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 800, behavior: 'smooth' }), 50)
  }

  const handleCancelExit = () => setShowConfirmModal(false)

  // Player Management
  const handleAddPlayer = () => {
    if (players.length >= 30) {
      alert('최대 30명까지만 추가할 수 있습니다.')
      return
    }
    setPlayers([...players, { id: Date.now(), name: '', truth1: '', truth1_image: null, truth2: '', truth2_image: null, lie: '', lie_image: null }])
  }

  const handleDeletePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId))
  }

  const handleUpdatePlayer = (playerId, field, value) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, [field]: value } : p
    ))
  }

  // Drag and Drop
  const handleDragStart = (index) => setDraggedIndex(index)
  const handleDragOver = (e) => e.preventDefault()
  
  const handleDrop = (dropIndex) => {
    if (draggedIndex === null) return
    const newPlayers = [...players]
    const draggedPlayer = newPlayers[draggedIndex]
    newPlayers.splice(draggedIndex, 1)
    newPlayers.splice(dropIndex, 0, draggedPlayer)
    setPlayers(newPlayers)
    setDraggedIndex(null)
  }
  const handleDragEnd = () => setDraggedIndex(null)

  const handleSaveDraft = async () => {
    if (players.length === 0) {
      alert('최소 1명 이상의 인원을 추가해야 임시저장할 수 있습니다.');
      return;
    }

    try {
      const existingDrafts = await localforage.getItem('game10_drafts') || [];
      const newDraft = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        players: players
      };
      
      const updatedDrafts = [newDraft, ...existingDrafts].slice(0, 10);
      
      await localforage.setItem('game10_drafts', updatedDrafts);
      setShowSaveModal(true);
    } catch (err) {
      console.error('Failed to save draft:', err);
      alert('임시저장 중 오류가 발생했습니다.');
    }
  };

  const handleComplete = () => {
    // Validation
    const invalidPlayer = players.find(p => !p.name.trim() || !p.truth1.trim() || !p.truth2.trim() || !p.lie.trim())
    if (invalidPlayer) {
      alert('모든 인원의 이름, 진실 2개, 가짜 1개를 입력해주세요.')
      return
    }

    const gameData = {
      players: players.map((p, index) => ({
        id: p.id,
        number: index + 1,
        name: p.name.trim(),
        truth1: p.truth1.trim(),
        truth2: p.truth2.trim(),
        lie: p.lie.trim(),
        statements: [ // Derived statements for easy rendering in gameplay
          { id: `${p.id}-t1`, text: p.truth1.trim(), image: p.truth1_image || null, isLie: false },
          { id: `${p.id}-t2`, text: p.truth2.trim(), image: p.truth2_image || null, isLie: false },
          { id: `${p.id}-l1`, text: p.lie.trim(), image: p.lie_image || null, isLie: true }
        ]
      }))
    }

    console.log('게임 데이터:', gameData)
    navigate('/game/10/gameplay', { state: gameData })
  }

  const isFormValid = players.length > 0 && players.every(p => p.name.trim() && p.truth1.trim() && p.truth2.trim() && p.lie.trim())

  return (
    <LandscapeOnly>
      <div className="game10-build-container">
        <header className="game-title-header">
          <button onClick={handleBackToVideo} className="header-back-btn">
            <div className="arrow-left"></div>
          </button>
          <h1>진진가 게임 만들기</h1>
          <button onClick={handleBackToHome} className="header-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        <div className="game-play-container">
          <div className="candidate-input-section">
            
            {/* Players Section */}
            <div className="section-header">
              <div className="section-left">
                <h2>1. 인원별 진진가 내용 입력</h2>
                <div className="candidate-counter">
                  <span className="current-count">{players.length}</span>
                  <span className="separator">/</span>
                  <span className="total-count">30</span>
                </div>
              </div>
              <div className="section-description-multi">
                <p className="section-description">최대 30명 입력 가능합니다.</p>
                <p className="section-description">드래그하여 순서를 변경할 수 있습니다.</p>
              </div>
            </div>

            <div className="candidates-list">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`candidate-item add-candidate-form ${draggedIndex === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="candidate-layout" style={{ gridTemplateColumns: '40px 1fr 40px' }}>
                    
                    <div className="candidate-number-box">
                      {index + 1}
                    </div>

                    <div className="form-row-container" style={{ gridTemplateColumns: '1fr', gap: '15px' }}>
                      {/* Name input */}
                      <div className="form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                        <label style={{ margin: 0, width: '60px' }}>이름</label>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => {
                            if (e.target.value.length <= 8) handleUpdatePlayer(player.id, 'name', e.target.value)
                          }}
                          placeholder="대상 이름 (최대 8자)"
                          className="title-input"
                          maxLength={8}
                          style={{ padding: '10px 15px', width: '100%', maxWidth: '300px' }}
                        />
                      </div>

                      <div className="candidate-layout" style={{ gridTemplateColumns: '50px 1fr 100px', gap: '15px', alignItems: 'center' }}>
                        <div className="candidate-number-box" style={{ width: '50px', fontSize: '1rem', backgroundColor: '#e2f0cb', borderColor: '#8bc34a', color: '#33691e', height: '100%' }}>진실</div>
                        <div className="form-field">
                          <textarea
                            value={player.truth1}
                            onChange={(e) => {
                              if (e.target.value.length <= 30) handleUpdatePlayer(player.id, 'truth1', e.target.value)
                            }}
                            placeholder="첫 번째 진실을 입력하세요 (최대 30자)"
                            maxLength={30}
                            rows="2"
                            style={{ height: '100%', minHeight: '60px' }}
                          />
                        </div>
                        <div className="form-field image-upload-field" style={{ margin: 0, height: '100%' }}>
                          <div className="image-upload-container game10-mini-upload">
                            {!player.truth1_image ? (
                              <div className="file-drop-zone mini">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.gif,.webp"
                                  onChange={(e) => {
                                    const file = e.target.files[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onload = (e) => handleUpdatePlayer(player.id, 'truth1_image', e.target.result)
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                />
                                <div className="file-drop-text">사진 추가(선택)</div>
                              </div>
                            ) : (
                              <div className="image-display mini" onClick={() => handleUpdatePlayer(player.id, 'truth1_image', null)}>
                                <img src={player.truth1_image} alt="선택됨" />
                                <div className="image-remove-overlay"><span>삭제</span></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="candidate-layout" style={{ gridTemplateColumns: '50px 1fr 100px', gap: '15px', alignItems: 'center' }}>
                        <div className="candidate-number-box" style={{ width: '50px', fontSize: '1rem', backgroundColor: '#e2f0cb', borderColor: '#8bc34a', color: '#33691e', height: '100%' }}>진실</div>
                        <div className="form-field">
                          <textarea
                            value={player.truth2}
                            onChange={(e) => {
                              if (e.target.value.length <= 30) handleUpdatePlayer(player.id, 'truth2', e.target.value)
                            }}
                            placeholder="두 번째 진실을 입력하세요 (최대 30자)"
                            maxLength={30}
                            rows="2"
                            style={{ height: '100%', minHeight: '60px' }}
                          />
                        </div>
                        <div className="form-field image-upload-field" style={{ margin: 0, height: '100%' }}>
                          <div className="image-upload-container game10-mini-upload">
                            {!player.truth2_image ? (
                              <div className="file-drop-zone mini">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.gif,.webp"
                                  onChange={(e) => {
                                    const file = e.target.files[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onload = (e) => handleUpdatePlayer(player.id, 'truth2_image', e.target.result)
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                />
                                <div className="file-drop-text">사진 추가(선택)</div>
                              </div>
                            ) : (
                              <div className="image-display mini" onClick={() => handleUpdatePlayer(player.id, 'truth2_image', null)}>
                                <img src={player.truth2_image} alt="선택됨" />
                                <div className="image-remove-overlay"><span>삭제</span></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="candidate-layout" style={{ gridTemplateColumns: '50px 1fr 100px', gap: '15px', alignItems: 'center' }}>
                        <div className="candidate-number-box" style={{ width: '50px', fontSize: '1rem', backgroundColor: '#ffcccc', borderColor: '#ff4d4f', color: '#b71c1c', height: '100%' }}>가짜</div>
                        <div className="form-field">
                          <textarea
                            value={player.lie}
                            onChange={(e) => {
                              if (e.target.value.length <= 30) handleUpdatePlayer(player.id, 'lie', e.target.value)
                            }}
                            placeholder="가짜 내용을 입력하세요 (최대 30자)"
                            maxLength={30}
                            rows="2"
                            style={{ height: '100%', minHeight: '60px' }}
                          />
                        </div>
                        <div className="form-field image-upload-field" style={{ margin: 0, height: '100%' }}>
                          <div className="image-upload-container game10-mini-upload">
                            {!player.lie_image ? (
                              <div className="file-drop-zone mini">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.gif,.webp"
                                  onChange={(e) => {
                                    const file = e.target.files[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onload = (e) => handleUpdatePlayer(player.id, 'lie_image', e.target.result)
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                />
                                <div className="file-drop-text">사진 추가(선택)</div>
                              </div>
                            ) : (
                              <div className="image-display mini" onClick={() => handleUpdatePlayer(player.id, 'lie_image', null)}>
                                <img src={player.lie_image} alt="선택됨" />
                                <div className="image-remove-overlay"><span>삭제</span></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="delete-candidate-btn"
                      onClick={() => handleDeletePlayer(player.id)}
                      style={{ alignSelf: 'center' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                  </div>
                </div>
              ))}
            </div>

            <button
              className="add-candidate-btn"
              onClick={handleAddPlayer}
              disabled={players.length >= 30}
            >
              + 인원 추가
            </button>

            <div className="divider"></div>

            <div className="completion-section">
              {players.length === 0 ? (
                <span className="completion-warning">
                  * 최소 한 명을 추가해주세요.
                </span>
              ) : !isFormValid && (
                <span className="completion-warning">
                  * 모든 인원의 이름, 진실 2개, 가짜 1개를 모두 입력해주세요.
                </span>
              )}
              
              <div className="action-buttons-group">
                <button
                  className="save-draft-btn"
                  onClick={handleSaveDraft}
                  disabled={players.length === 0}
                >
                  임시저장
                </button>
                <button
                  className="complete-btn"
                  onClick={handleComplete}
                  disabled={!isFormValid}
                >
                  완료
                </button>
              </div>
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
                <button className="confirm-btn" onClick={handleConfirmExit}>확인</button>
                <button className="cancel-btn" onClick={handleCancelExit}>취소</button>
              </div>
            </div>
          </div>
        )}

        <SaveCompleteModal 
          isOpen={showSaveModal} 
          onClose={() => setShowSaveModal(false)} 
        />
      </div>
    </LandscapeOnly>
  )
}

export default Game10Build
