import { useState, useEffect } from 'react'
import './MigrationModal.css'

function MigrationModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 확인한 적이 없다면 모달 띄우기
    const hasRead = localStorage.getItem('hasReadMigrationNotice') === 'true'
    if (!hasRead) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleCloseNeverShowAgain = () => {
    localStorage.setItem('hasReadMigrationNotice', 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay migration-modal-overlay">
      <div className="modal-content migration-modal-content">
        <div className="migration-modal-header">
          <h2 className="modal-title">🚨 사이트 이전 안내</h2>
        </div>
        
        <div className="migration-modal-body">
          <p className="migration-warning">
            얼박사 에듀의 <strong className="highlight-red">URL 주소가 변경</strong>됩니다!
            <br />
            <span className="warning-subtext">3월 14일 이후 기존 Vercel 주소는 접속이 불가합니다.</span>
          </p>
          <div className="migration-info-box">
            <p>앞으로는 아래 방법으로 접속해 주세요:</p>
            <ul>
              <li>
                새로운 주소 접속: <br />
                <a href="https://eol-bak-sah.netlify.app" target="_blank" rel="noopener noreferrer" className="highlight-link">
                  eol-bak-sah.netlify.app
                </a>
              </li>
              <li>
                검색창에 <strong className="highlight-text">"얼박사 에듀"</strong> 검색
              </li>
            </ul>
          </div>
          <div className="migration-highlight-box">
            ✨ <span className="highlight-game-text">기존과 동일한 게임들을 계속해서 즐기실 수 있습니다!</span> ✨
          </div>
          <p className="migration-footer-text">
            이용에 불편을 드려 죄송합니다.
          </p>
        </div>

        <div className="migration-modal-actions">
          <button className="migration-close-never-btn" onClick={handleCloseNeverShowAgain}>
            다시 보지 않기
          </button>
          <button className="migration-close-btn" onClick={handleClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default MigrationModal
