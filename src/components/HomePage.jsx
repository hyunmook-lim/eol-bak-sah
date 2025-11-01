import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import twoIcesImg from '../assets/images/two-ices.png'
import oneIceImg from '../assets/images/one-ice.png'
import mainPenguinImg from '../assets/images/main-penguin.png'

function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const games = [
    {
      id: 1,
      title: "슝 글자 게임 (단어)",
      description: "빠르게 지나가는 단어들을 집중해서 보고 정확하게 맞추는 반응 속도 게임입니다. 순발력과 집중력을 기를 수 있어요!",
      videoUrl: "/videos/game1.mp4",
      route: "/game/1/video"
    },
    {
      id: 2,
      title: "창문닦기 게임",
      description: "가려진 사진을 점점 닦아나가며 숨겨진 정답을 맞추는 추리 게임입니다. 관찰력과 추론 능력을 발휘해보세요!",
      videoUrl: "/videos/game2.mp4",
      route: "/game/2/video"
    },
    {
      id: 3,
      title: "슝 글자 게임 (글자)",
      description: "빠르게 지나가는 개별 글자들을 보고 의미있는 단어로 조합하는 인지 게임입니다. 빠른 사고력과 단어 실력이 필요해요!",
      videoUrl: "/videos/game3.mp4",
      route: "/game/3/video"
    },
    {
      id: 4,
      title: "뒤죽박죽 글자게임",
      description: "뒤죽박죽으로 섞인 글자들을 원래대로 맞추는 게임입니다. 머리를 잘 써보세요!",
      videoUrl: "/videos/game4.mp4",
      route: "/game/4/video"
    },
    {
      id: 5,
      title: "초성 게임",
      description: "초성을 맞추는 게임입니다. 빠른 사고력과 단어 실력이 필요해요!",
      videoUrl: "/videos/game5.mp4",
      route: "/game/5/video"
    },
    {
      id: 6,
      title: "OX 게임",
      description: "O 또는 X로 정답을 맞추는 퀴즈 게임입니다. 빠른 판단력과 지식을 발휘해보세요!",
      videoUrl: "/videos/game6.mp4",
      route: "/game/6/video"
    },
    {
      id: 7,
      title: "메모리 카드 게임",
      description: "같은 그림의 카드 2장을 찾아 맞추는 기억력 게임입니다. 집중력과 기억력을 키워요!",
      videoUrl: "/videos/game7.mp4",
      route: "/game/7/video"
    },
    {
      id: 8,
      title: "얼음깨기 게임 8",
      description: "스토리텔링을 통한 상상력 발달 게임입니다. 함께 이야기를 만들어가요!",
      videoUrl: "/videos/game8.mp4",
      route: "/game/8/video"
    },
    {
      id: 9,
      title: "얼음깨기 게임 9",
      description: "마지막 게임으로 모두가 함께하는 단체 게임입니다. 즐거운 마무리!",
      videoUrl: "/videos/game9.mp4",
      route: "/game/9/video"
    }
  ]

  const handleGameStart = (game) => {
    navigate(game.route)
  }

  return (
    <div className="app">
      <header className="title-header">
        <h1>얼박사</h1>
      </header>
      
      <main className="main-content">
        <div className="content-spacer"></div>
        
        <div className="text-container">
            <div 
              className={`animated-text subtitle ${scrollY > 50 ? 'visible' : ''}`}
            >
              <span className="highlight-text">어린이 박사</span>의 <span className="highlight-text">얼음 박살</span> 아이스 브레이킹 게임모음
            </div>
          
            <div 
              className={`animated-text main-title ${scrollY > 100 ? 'visible' : ''}`}
            >
              <img src={mainPenguinImg} alt="펭귄" className="main-penguin" />
              얼박사
            </div>
          
          <div 
            className={`additional-text left-text ${scrollY > 150 ? 'visible' : ''}`}
          >
            재미있는 수업을 하고 싶은 교사도!
          </div>
          
          <div 
            className={`additional-text right-text ${scrollY > 200 ? 'visible' : ''}`}
          >
            아이스 브레이킹을 원하는 누구나!
          </div>
        </div>
        
        <div className="content-spacer"></div>
        
        <section className="games-section">
          <div className="games-grid">
            {games.map((game) => (
              <div key={game.id} className="home-game-card">
                <div className="game-image">
                  <video 
                    src={game.videoUrl} 
                    alt={game.title}
                    muted
                    loop
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                  />
                </div>
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description">
                  {game.description}
                </p>
                <button 
                  className="game-start-btn"
                  onClick={() => handleGameStart(game)}
                >
                  게임 시작
                </button>
              </div>
            ))}
          </div>
        </section>
        
        <div className="ice-animation-container container-1">
          <img src={twoIcesImg} alt="" className="floating-ice ice-1" />
        </div>
        <div className="ice-animation-container container-2">
          <img src={oneIceImg} alt="" className="floating-ice ice-2" />
        </div>
      </main>
    </div>
  )
}

export default HomePage