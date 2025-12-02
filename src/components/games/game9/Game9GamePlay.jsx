import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import './Game9GamePlay.css'

const fightPenguinBlue = '/images/fight-penguin-blue.png'
const fightPenguinRed = '/images/fight-penguin-red.png'
const voteBlackIcon = '/images/vote-black.png'
const voteRedIcon = '/images/vote-red.png'
const crownIcon = '/images/crown.png'
const winnerSound = '/sounds/vote-winner.wav'

function Game9GamePlay() {
  const navigate = useNavigate()
  const location = useLocation()
  const title = useMemo(() => location.state?.title || '', [location.state?.title])

  // candidates를 state로 관리하여 득표수 업데이트 가능하도록 변경
  const [candidates, setCandidates] = useState(location.state?.candidates || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [showVotes, setShowVotes] = useState(false)
  const [clickedCard, setClickedCard] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [showTieModal, setShowTieModal] = useState(false)

  useEffect(() => {
    // 게임 진입 시 스크롤 방지
    document.body.style.overflow = 'hidden'

    return () => {
      // 게임 종료 시 스크롤 복구
      document.body.style.overflow = 'auto'
    }
  }, [])

  // 결과 화면 표시 시 승리 사운드 재생 (0.5초 지연)
  useEffect(() => {
    if (showResults && isSoundOn) {
      const timer = setTimeout(() => {
        const audio = new Audio(winnerSound)
        audio.play().catch(err => console.log('Sound play failed:', err))
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [showResults, isSoundOn])

  // 투표 처리 함수
  const handleVote = (candidateId) => {
    // 클릭 효과 추가
    setClickedCard(candidateId)

    setCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    )

    // 애니메이션 후 클릭 상태 제거 (1초 후)
    setTimeout(() => {
      setClickedCard(null)
    }, 1000)
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

  const handleBackToBuild = () => {
    setShowBackConfirmModal(true)
  }

  const handleConfirmBackToBuild = () => {
    setShowBackConfirmModal(false)
    navigate('/game/9/build', { state: { title, candidates } })
  }

  const handleCancelBackToBuild = () => {
    setShowBackConfirmModal(false)
  }

  // 초기화 함수
  const handleReset = () => {
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate => ({
        ...candidate,
        votes: 0
      }))
    )
    setShowResults(false)
  }

  // 결과 확인 함수
  const handleShowResults = () => {
    // 최고 득표수 찾기
    const maxVotes = Math.max(...candidates.map(c => c.votes))
    // 최고 득표수를 가진 후보들 찾기
    const winners = candidates.filter(c => c.votes === maxVotes)

    // 동점자가 있는지 확인
    if (winners.length > 1) {
      setShowTieModal(true)
    } else {
      setShowResults(true)
    }
  }

  // 동점 모달에서 예 클릭
  const handleConfirmTie = () => {
    setShowTieModal(false)
    setShowResults(true)
  }

  // 동점 모달에서 취소 클릭
  const handleCancelTie = () => {
    setShowTieModal(false)
  }

  // 가장 많은 투표를 받은 후보들 찾기 (동점자 포함)
  const getWinners = () => {
    if (candidates.length === 0) return []
    const maxVotes = Math.max(...candidates.map(c => c.votes))
    return candidates.filter(c => c.votes === maxVotes)
  }

  return (
    <div className="game9-gameplay-container">
      <header className="game-title-header">
        <button onClick={handleBackToBuild} className="header-back-btn">
          <div className="arrow-left"></div>
        </button>
        <h1>투표 게임</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>

      <div className="gameplay-container">
        <div className={`background-container ${showResults ? 'result-background' : ''}`}>
          {!showResults && (
            <>
              <img src={fightPenguinBlue} alt="블루 펭귄" className="penguin-left" />
              <img src={fightPenguinRed} alt="레드 펭귄" className="penguin-right" />
            </>
          )}
        </div>

        {/* 게임 컨텐츠 */}
        <div className="game-content">
          {/* 투표 제목 영역 */}
          <div className="vote-title-section">
            <div className="vote-title-box">
              <h2 className="vote-title">{title}</h2>
            </div>
            {!showResults && (
              <div className="control-buttons">
                <div className="toggle-item">
                  <span className="toggle-icon">
                    {isSoundOn ? <HiVolumeUp /> : <HiVolumeOff />}
                  </span>
                  <div className="toggle-switch" onClick={() => setIsSoundOn(!isSoundOn)}>
                    <div className={`toggle-slider ${isSoundOn ? 'active' : ''}`}></div>
                  </div>
                </div>
                <div className="toggle-item">
                  <span className="toggle-icon">
                    <img src={voteBlackIcon} alt="투표" className="vote-icon" />
                  </span>
                  <div className="toggle-switch" onClick={() => setShowVotes(!showVotes)}>
                    <div className={`toggle-slider ${showVotes ? 'active' : ''}`}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!showResults ? (
            <>
              {/* 후보 카드 그리드 */}
              <div className="candidates-grid">
                {candidates.map((candidate, index) => {
                  // 파스텔 색상 배열
                  const pastelColors = [
                    '#FFE5E5', // 파스텔 핑크
                    '#E5F3FF', // 파스텔 블루
                    '#FFF5E5', // 파스텔 오렌지
                    '#E5FFE5', // 파스텔 그린
                    '#F5E5FF', // 파스텔 퍼플
                    '#FFFFE5', // 파스텔 옐로우
                  ]

                  // 진한 파스텔 색상 배열 (번호 배지용)
                  const darkPastelColors = [
                    '#FFB3B3', // 진한 파스텔 핑크
                    '#B3D9FF', // 진한 파스텔 블루
                    '#FFD9B3', // 진한 파스텔 오렌지
                    '#B3FFB3', // 진한 파스텔 그린
                    '#E0B3FF', // 진한 파스텔 퍼플
                    '#FFFFB3', // 진한 파스텔 옐로우
                  ]

                  const backgroundColor = pastelColors[index % pastelColors.length]
                  const badgeColor = darkPastelColors[index % darkPastelColors.length]
                  const hasContent = candidate.description || candidate.image

                  return (
                    <div key={candidate.id} className="candidate-wrapper">
                      <div
                        className={`candidate-card ${!hasContent ? 'simple' : ''}`}
                        style={{ '--card-bg-color': backgroundColor }}
                        onClick={() => handleVote(candidate.id)}
                      >
                        {!hasContent ? (
                          // 설명과 이미지가 없을 때: 번호와 이름만
                          <>
                            <div className="candidate-number" style={{ backgroundColor: badgeColor }}>{candidate.number}</div>
                            <h3 className="candidate-name">{candidate.name}</h3>
                          </>
                        ) : (
                          // 설명이나 이미지가 있을 때: 번호+이름 상단, 컨텐츠 중앙
                          <>
                            <div className="candidate-header">
                              <div className="candidate-number" style={{ backgroundColor: badgeColor }}>{candidate.number}</div>
                              <h3 className="candidate-name-with-content">{candidate.name}</h3>
                            </div>

                            <div className="candidate-content">
                              {candidate.image && (
                                <div className="candidate-image-container">
                                  <img src={candidate.image} alt={candidate.name} className="candidate-image" />
                                </div>
                              )}
                              {candidate.description && (
                                <p className="candidate-description">{candidate.description}</p>
                              )}
                            </div>
                          </>
                        )}

                        {/* 클릭 효과 - vote-red 이미지 */}
                        {clickedCard === candidate.id && (
                          <div className="vote-click-effect">
                            <img src={voteRedIcon} alt="투표!" className="vote-effect-icon" />
                          </div>
                        )}
                      </div>

                      {/* 투표 수 표시 */}
                      <div className={`votes-display ${showVotes ? 'visible' : ''}`} style={{ '--badge-bg-color': badgeColor }}>
                        {Array.from({ length: candidate.votes }).map((_, voteIndex) => (
                          <img
                            key={voteIndex}
                            src={voteRedIcon}
                            alt="투표"
                            className="vote-icon-red"
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 하단 버튼들 */}
              <div className="action-buttons">
                <button className="reset-btn" onClick={handleReset}>
                  초기화
                </button>
                <button className="results-btn" onClick={handleShowResults}>
                  결과 확인
                </button>
              </div>
            </>
          ) : (
            <div className="results-container">
              {/* 결과 화면 - 우승자 카드들 표시 */}
              {(() => {
                const winners = getWinners()
                if (winners.length === 0) return null

                // 파스텔 색상 배열
                const pastelColors = [
                  '#FFE5E5', // 파스텔 핑크
                  '#E5F3FF', // 파스텔 블루
                  '#FFF5E5', // 파스텔 오렌지
                  '#E5FFE5', // 파스텔 그린
                  '#F5E5FF', // 파스텔 퍼플
                  '#FFFFE5', // 파스텔 옐로우
                ]

                // 진한 파스텔 색상 배열 (번호 배지용)
                const darkPastelColors = [
                  '#FFB3B3', // 진한 파스텔 핑크
                  '#B3D9FF', // 진한 파스텔 블루
                  '#FFD9B3', // 진한 파스텔 오렌지
                  '#B3FFB3', // 진한 파스텔 그린
                  '#E0B3FF', // 진한 파스텔 퍼플
                  '#FFFFB3', // 진한 파스텔 옐로우
                ]

                return (
                  <>
                    <div className={`winners-grid ${winners.length === 1 ? 'single-winner' : ''}`}>
                      {winners.map((winner) => {
                        const winnerIndex = candidates.findIndex(c => c.id === winner.id)
                        const backgroundColor = pastelColors[winnerIndex % pastelColors.length]
                        const badgeColor = darkPastelColors[winnerIndex % darkPastelColors.length]
                        const hasContent = winner.description || winner.image

                        return (
                          <div key={winner.id} className="winner-card-wrapper">
                            <img src={crownIcon} alt="우승" className="winner-crown" />
                            <div
                              className={`candidate-card winner-card ${!hasContent ? 'simple' : ''}`}
                              style={{ '--card-bg-color': backgroundColor }}
                            >
                              {!hasContent ? (
                                // 설명과 이미지가 없을 때: 번호와 이름만
                                <>
                                  <div className="candidate-number" style={{ backgroundColor: badgeColor }}>{winner.number}</div>
                                  <h3 className="candidate-name">{winner.name}</h3>
                                </>
                              ) : (
                                // 설명이나 이미지가 있을 때: 번호+이름 상단, 컨텐츠 중앙
                                <>
                                  <div className="candidate-header">
                                    <div className="candidate-number" style={{ backgroundColor: badgeColor }}>{winner.number}</div>
                                    <h3 className="candidate-name-with-content">{winner.name}</h3>
                                  </div>

                                  <div className="candidate-content">
                                    {winner.image && (
                                      <div className="candidate-image-container">
                                        <img src={winner.image} alt={winner.name} className="candidate-image" />
                                      </div>
                                    )}
                                    {winner.description && (
                                      <p className="candidate-description">{winner.description}</p>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* 우승자 투표 수 표시 */}
                            <div className="winner-votes-display" style={{ '--badge-bg-color': badgeColor }}>
                              <span className="votes-label">득표</span>
                              <span className="votes-divider">|</span>
                              <div className="votes-icons">
                                {Array.from({ length: winner.votes }).map((_, voteIndex) => (
                                  <img
                                    key={voteIndex}
                                    src={voteRedIcon}
                                    alt="투표"
                                    className="vote-icon-red"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* 결과 화면 액션 버튼들 */}
                    <div className="result-action-buttons">
                      <button className="result-replay-btn" onClick={handleReset}>
                        다시 하기
                      </button>
                      <button className="result-home-btn" onClick={handleBackToHome}>
                        홈으로 가기
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelExit}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>홈으로 돌아가시겠습니까?</h3>
              <p>게임이 종료됩니다.</p>
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

      {showBackConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelBackToBuild}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>게임 만들기로 돌아가시겠습니까?</h3>
              <p>진행중인 게임은 저장되지 않습니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmBackToBuild}>
                확인
              </button>
              <button className="cancel-btn" onClick={handleCancelBackToBuild}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showTieModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelTie}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>동률이 있습니다.</h3>
              <p>그래도 결과를 발표하겠습니까?</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmTie}>
                예
              </button>
              <button className="cancel-btn" onClick={handleCancelTie}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game9GamePlay
