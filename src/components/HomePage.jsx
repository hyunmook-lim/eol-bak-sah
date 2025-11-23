import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
const twoIcesImg = '/images/two-ices.png'
const oneIceImg = '/images/one-ice.png'
const mainPenguinImg = '/images/main-penguin.png'
const penguinFoot = '/images/penguin-foot.png'
import FeedbackModal from './FeedbackModal'

function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()
  const videoRefs = useRef({})
  const [hoveredGame, setHoveredGame] = useState(null)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 리소스 프리로딩
  useEffect(() => {
    const preloadResources = async () => {
      const resources = [
        // 비디오 파일들
        '/videos/game1video.mp4',
        '/videos/game2video.mp4',
        '/videos/game3video.mp4',
        '/videos/game4video.mp4',
        '/videos/game5video.mp4',
        '/videos/game6video.mp4',
        '/videos/game7video.mp4',
        '/videos/game8video.mp4',
        // 썸네일 이미지들
        '/thumbnail/game1thumbnail.png',
        '/thumbnail/game2thumbnail.png',
        '/thumbnail/game3thumbnail.png',
        '/thumbnail/game4thumbnail.png',
        '/thumbnail/game5thumbnail.png',
        '/thumbnail/game6thumbnail.png',
        '/thumbnail/game7thumbnail.png',
        '/thumbnail/game8thumbnail.png',
        // 기타 이미지들
        '/images/two-ices.png',
        '/images/one-ice.png',
        '/images/main-penguin.png',
      ]

      let loaded = 0
      const total = resources.length

      const loadPromises = resources.map((src) => {
        return new Promise((resolve) => {
          if (src.endsWith('.mp4')) {
            // 비디오 프리로드
            const video = document.createElement('video')
            video.preload = 'auto'
            video.src = src
            video.onloadeddata = () => {
              loaded++
              setLoadingProgress(Math.round((loaded / total) * 100))
              resolve()
            }
            video.onerror = () => {
              loaded++
              setLoadingProgress(Math.round((loaded / total) * 100))
              resolve() // 에러가 나도 계속 진행
            }
          } else {
            // 이미지 프리로드
            const img = new Image()
            img.src = src
            img.onload = () => {
              loaded++
              setLoadingProgress(Math.round((loaded / total) * 100))
              resolve()
            }
            img.onerror = () => {
              loaded++
              setLoadingProgress(Math.round((loaded / total) * 100))
              resolve() // 에러가 나도 계속 진행
            }
          }
        })
      })

      await Promise.all(loadPromises)
      setIsLoading(false)
    }

    preloadResources()
  }, [])

  const games = [
    {
      id: 1,
      title: "슝 글자 게임 (단어)",
      description: "빠르게 지나가는 단어들을 집중해서 보고 정확하게 맞추는 반응 속도 게임입니다. 순발력과 집중력을 기를 수 있어요!",
      videoUrl: "/videos/game1video.mp4",
      thumbnailUrl: "/thumbnail/game1thumbnail.png",
      route: "/game/1/video"
    },
    {
      id: 2,
      title: "창문닦기 게임",
      description: "가려진 사진을 점점 닦아나가며 숨겨진 정답을 맞추는 추리 게임입니다. 관찰력과 추론 능력을 발휘해보세요!",
      videoUrl: "/videos/game2video.mp4",
      thumbnailUrl: "/thumbnail/game2thumbnail.png",
      route: "/game/2/video"
    },
    {
      id: 3,
      title: "슝 글자 게임 (글자)",
      description: "빠르게 지나가는 개별 글자들을 보고 의미있는 단어로 조합하는 인지 게임입니다. 빠른 사고력과 단어 실력이 필요해요!",
      videoUrl: "/videos/game3video.mp4",
      thumbnailUrl: "/thumbnail/game3thumbnail.png",
      route: "/game/3/video"
    },
    {
      id: 4,
      title: "뒤죽박죽 글자게임",
      description: "뒤죽박죽으로 섞인 글자들을 원래대로 맞추는 게임입니다. 머리를 잘 써보세요!",
      videoUrl: "/videos/game4video.mp4",
      thumbnailUrl: "/thumbnail/game4thumbnail.png",
      route: "/game/4/video"
    },
    {
      id: 5,
      title: "초성 게임",
      description: "초성을 맞추는 게임입니다. 빠른 사고력과 단어 실력이 필요해요!",
      videoUrl: "/videos/game5video.mp4",
      thumbnailUrl: "/thumbnail/game5thumbnail.png",
      route: "/game/5/video"
    },
    {
      id: 6,
      title: "OX 게임",
      description: "O 또는 X로 정답을 맞추는 퀴즈 게임입니다. 빠른 판단력과 지식을 발휘해보세요!",
      videoUrl: "/videos/game6video.mp4",
      thumbnailUrl: "/thumbnail/game6thumbnail.png",
      route: "/game/6/video"
    },
    {
      id: 7,
      title: "메모리 카드 게임",
      description: "같은 그림의 카드 2장을 찾아 맞추는 기억력 게임입니다. 집중력과 기억력을 키워요!",
      videoUrl: "/videos/game7video.mp4",
      thumbnailUrl: "/thumbnail/game7thumbnail.png",
      route: "/game/7/video"
    },
    {
      id: 8,
      title: "돋보기 게임",
      description: "확대된 사진을 보고 무엇의 사진인지 맞추는 관찰력 게임입니다. 부분만 보고 전체를 추리하는 재미를 느껴보세요!",
      videoUrl: "/videos/game8video.mp4",
      thumbnailUrl: "/thumbnail/game8thumbnail.png",
      route: "/game/8/video"
    },
    {
      id: 9,
      title: "Coming Soon!",
      description: "새로운 게임을 만들고 있어요! 조금만 기다려주세요!",
      isComingSoon: true
    }
  ]

  const handleGameStart = (game) => {
    navigate(game.route)
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-penguin-feet">
            <img src={penguinFoot} alt="Loading" className="loading-foot foot-1" />
            <img src={penguinFoot} alt="Loading" className="loading-foot foot-2" />
            <img src={penguinFoot} alt="Loading" className="loading-foot foot-3" />
          </div>
          <h2 className="loading-title">얼박사 로딩 중...</h2>
          <div className="loading-bar">
            <div
              className="loading-progress"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="loading-percentage">{loadingProgress}%</p>
        </div>
      </div>
    )
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
              <div
                key={game.id}
                className={`home-game-card ${game.isComingSoon ? 'coming-soon-card' : ''}`}
                onMouseEnter={() => !game.isComingSoon && setHoveredGame(game.id)}
                onMouseLeave={() => !game.isComingSoon && setHoveredGame(null)}
              >
                {game.isComingSoon ? (
                  <>
                    <div className="game-image coming-soon-image">
                      <div className="coming-soon-content">
                        <span className="coming-soon-icon">🎁</span>
                        <span className="coming-soon-text">준비 중</span>
                      </div>
                    </div>
                    <h3 className="game-title">{game.title}</h3>
                    <p className="game-description">
                      {game.description}
                    </p>
                    <button
                      className="game-start-btn coming-soon-btn"
                      disabled
                    >
                      준비 중
                    </button>
                  </>
                ) : (
                  <>
                    <div className="game-image">
                      {hoveredGame === game.id ? (
                        <video
                          ref={(el) => {
                            if (el) {
                              videoRefs.current[game.id] = el
                              el.currentTime = 0
                              el.playbackRate = 2
                              el.play()
                            }
                          }}
                          src={game.videoUrl}
                          alt={game.title}
                          muted
                          loop
                          autoPlay
                        />
                      ) : (
                        <img
                          src={game.thumbnailUrl}
                          alt={game.title}
                        />
                      )}
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
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="feedback-button-container">
            <button
              className="feedback-btn"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              의견 보내기
            </button>
          </div>
        </section>

        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
        />

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