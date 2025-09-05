import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGameStart = (gameId) => {
    navigate(`/game/${gameId}/video`)
  }

  return (
    <div className="app">
      <div className="scroll-indicator">
        스크롤: {scrollY}px
      </div>
      <header className="title-header">
        <h1>얼박사</h1>
      </header>
      
      <main className="main-content">
        <div className="content-spacer"></div>
        
        <div 
          className={`text-container ${scrollY > 400 && scrollY < 800 ? 'sticky-mode' : ''}`}
          style={{
            transform: scrollY >= 800 ? 'translateY(275px)' : 'none'
          }}
        >
          <div 
            className={`animated-text subtitle ${scrollY > 100 ? 'visible' : ''}`}
          >
            어린이 박사의 얼음 박살 아이스 브레이킹 게임모음
          </div>
          
          <div 
            className={`animated-text main-title ${scrollY > 200 ? 'visible' : ''}`}
          >
            얼박사
          </div>
          
          <div 
            className={`additional-text left-text ${scrollY > 300 ? 'visible' : ''}`}
          >
            재미있는 수업을 하고 싶은 교사도!
          </div>
          
          <div 
            className={`additional-text right-text ${scrollY > 400 ? 'visible' : ''}`}
          >
            아이스 브레이킹을 원하는 누구나!
          </div>
        </div>
        
        <div className="content-spacer"></div>
        
        <section className="games-section">
          <div className="games-grid">
            {Array.from({ length: 9 }, (_, index) => (
              <div key={index} className="game-card">
                <div className="game-image">
                  <img src="/placeholder.jpg" alt={`Game ${index + 1}`} />
                </div>
                <h3 className="game-title">게임 {index + 1}</h3>
                <p className="game-description">
                  재미있는 얼음깨기 게임입니다. 모든 연령대가 즐길 수 있어요!
                </p>
                <button 
                  className="game-start-btn"
                  onClick={() => handleGameStart(index + 1)}
                >
                  게임 시작
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage