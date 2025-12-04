import './LandscapeOnly.css'

function LandscapeOnly({ children }) {
  return (
    <>
      {/* 세로 모드일 때 표시되는 오버레이 */}
      <div className="portrait-overlay">
        <div className="rotate-message">
          <div className="phone-icon">📱</div>
          <h2>화면을 회전해주세요</h2>
          <p>더 나은 게임 경험을 위해<br />가로 모드로 플레이해주세요</p>
        </div>
      </div>

      {/* 실제 콘텐츠 (가로 모드에서만 표시) */}
      <div className="landscape-content">
        {children}
      </div>
    </>
  )
}

export default LandscapeOnly
