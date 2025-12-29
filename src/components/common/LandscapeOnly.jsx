import { useState, useEffect } from 'react'
import './LandscapeOnly.css'

function LandscapeOnly({ children, mountOnlyInLandscape = false }) {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    if (!mountOnlyInLandscape) return

    const checkOrientation = () => {
      // CSS 미디어 쿼리와 동일한 조건: max-width 1024px AND orientation: portrait
      const isPortraitMode = window.matchMedia('(max-width: 1024px) and (orientation: portrait)').matches
      setIsPortrait(isPortraitMode)
    }

    checkOrientation() // 초기값 설정
    
    // 이벤트 리스너 등록
    const mql = window.matchMedia('(max-width: 1024px) and (orientation: portrait)')
    const handler = (e) => setIsPortrait(e.matches)
    
    if (mql.addEventListener) {
      mql.addEventListener('change', handler)
    } else {
      mql.addListener(handler) // 구형 브라우저 지원
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handler)
      } else {
        mql.removeListener(handler)
      }
    }
  }, [mountOnlyInLandscape])

  // mountOnlyInLandscape가 true이고 포트레이트 모드이면 렌더링하지 않음
  const shouldRenderChildren = !mountOnlyInLandscape || !isPortrait

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
        {shouldRenderChildren && children}
      </div>
    </>
  )
}

export default LandscapeOnly
