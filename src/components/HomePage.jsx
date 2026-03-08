import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
const twoIcesImg = '/images/two-ices.png'
const oneIceImg = '/images/one-ice.png'
const mainPenguinImg = '/images/main-penguin.png'
const penguinFoot = '/images/penguin-foot.png'
import FeedbackModal from './FeedbackModal'
import NoticeModal from './NoticeModal'
import SavedGamesModal from './SavedGamesModal'

function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()
  const videoRefs = useRef({})
  const [hoveredGame, setHoveredGame] = useState(null)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
  const [isSavedGamesModalOpen, setIsSavedGamesModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [hasUnreadNotice, setHasUnreadNotice] = useState(false)

  useEffect(() => {
    const hasRead = localStorage.getItem('hasReadNotice_20260307') === 'true'
    if (!hasRead) {
      setHasUnreadNotice(true)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 리소스 프리로딩
  useEffect(() => {
    // 실제 로딩 진행률을 추적하는 ref
    const targetProgressRef = { current: 0 }
    // 애니메이션 인터벌 id
    let animationFrameId

    const preloadResources = async () => {
      // 모바일 기기 감지
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768
      
      // 크롤러 감지 (AdSense 등)
      const isCrawler = /bot|googlebot|crawler|spider|robot|crawling|mediapartners-google|headless|chrome-lighthouse|pagespeed|lighthouse/i.test(navigator.userAgent)
      
      if (isCrawler) {
        setIsLoading(false)
        return
      }

      const videoResources = [
        '/videos/game1video.mp4',
        '/videos/game2video.mp4',
        '/videos/game3video.mp4',
        '/videos/game4video.mp4',
        '/videos/game5video.mp4',
        '/videos/game6video.mp4',
        '/videos/game7video.mp4',
        '/videos/game8video.mp4',
        '/videos/game9video.mp4',
        '/videos/game11video.mp4',
        '/videos/game12video.mp4',
      ]

      const audioResources = [
        '/sounds/background-music.mp3',
        '/sounds/click.wav',
      ]

      const resources = [
        // 모바일이 아닐 때만 비디오, 오디오 파일 프리로드
        ...(isMobile ? [] : videoResources),
        // 썸네일 이미지들
        '/thumbnail/game1thumbnail.png',
        '/thumbnail/game2thumbnail.png',
        '/thumbnail/game3thumbnail.png',
        '/thumbnail/game4thumbnail.png',
        '/thumbnail/game5thumbnail.png',
        '/thumbnail/game6thumbnail.png',
        '/thumbnail/game7thumbnail.png',
        '/thumbnail/game8thumbnail.png',
        '/thumbnail/game9thumbnail.png',
        '/thumbnail/game10thumbnail.png',
        '/thumbnail/game11thumbnail.png',
        '/thumbnail/game12thumbnail.png',
        // 기타 이미지들
        '/images/two-ices.png',
        '/images/one-ice.png',
        '/images/main-penguin.png',
        '/images/penguin-foot.png',
        // 사운드 파일들 (모바일이 아닐 때만)
        ...(isMobile ? [] : audioResources),
      ]

      let loaded = 0
      const total = resources.length

      // 부드러운 진행률 업데이트를 위한 애니메이션 루프
      const updateProgress = () => {
        setLoadingProgress(prev => {
          const target = targetProgressRef.current
          if (prev >= target) {
            // 목표에 도달했고, 100%라면 로딩 종료 (약간의 지연 추가)
            if (prev >= 100) {
              // 100% 도달 후 잠시 대기했다가 로딩 화면 제거
              return 100
            }
            return prev
          }
          
          // 남은 거리에 비례해서 증가 (부드러운 감속 효과)
          // 최소 1씩은 증가하되, 최대 0.5씩만 증가하도록 제한하여 천천히 차오르게 함
          const diff = target - prev
          const step = Math.min(Math.ceil(diff * 0.1), 0.5)
          return Math.min(prev + step, 100)
        })
        
        animationFrameId = requestAnimationFrame(updateProgress)
      }
      
      // 애니메이션 시작
      updateProgress()

      const loadPromises = resources.map((src) => {
        return new Promise((resolve) => {
          // 5초 타임아웃 설정
          const timeout = setTimeout(() => {
            console.warn(`Timeout loading: ${src}`)
            loaded++
            targetProgressRef.current = Math.round((loaded / total) * 100)
            resolve()
          }, 5000)

          const clearTimeoutAndResolve = () => {
            clearTimeout(timeout)
            loaded++
            targetProgressRef.current = Math.round((loaded / total) * 100)
            resolve()
          }

          if (src.endsWith('.mp4')) {
            // 비디오 프리로드
            const video = document.createElement('video')
            video.preload = 'auto'
            video.src = src
            video.onloadeddata = clearTimeoutAndResolve
            video.onerror = clearTimeoutAndResolve
          } else if (src.endsWith('.mp3') || src.endsWith('.wav')) {
            // 오디오 프리로드
            const audio = new Audio()
            audio.preload = 'auto'
            audio.src = src
            audio.onloadeddata = clearTimeoutAndResolve
            audio.onerror = clearTimeoutAndResolve
          } else {
            // 이미지 프리로드
            const img = new Image()
            img.src = src
            img.onload = clearTimeoutAndResolve
            img.onerror = clearTimeoutAndResolve
          }
        })
      })

      await Promise.all(loadPromises)
      
      // 모든 로딩이 끝나면 확실하게 100%로 설정
      targetProgressRef.current = 100
      
      // 시각적으로 100%가 될 때까지 기다렸다가 로딩 해제 확인을 위한 체크
      const checkCompletion = setInterval(() => {
        setLoadingProgress(current => {
          if (current >= 100) {
            clearInterval(checkCompletion)
            cancelAnimationFrame(animationFrameId)
            setTimeout(() => setIsLoading(false), 500) // 0.5초 후 로딩 화면 제거
            return 100
          }
          return current
        })
      }, 100)
    }

    preloadResources()
    
    return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleCardMouseMove = (e, gameId) => {
    if (games.find(g => g.id === gameId)?.isComingSoon) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -5 // -5 to 5 degrees
    const rotateY = ((x - centerX) / centerX) * 5  // -5 to 5 degrees
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
  }

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
      title: "슝 글자 게임 (글자)",
      description: "빠르게 지나가는 개별 글자들을 보고 의미있는 단어로 조합하는 인지 게임입니다. 빠른 사고력과 단어 실력이 필요해요!",
      videoUrl: "/videos/game3video.mp4",
      thumbnailUrl: "/thumbnail/game3thumbnail.png",
      route: "/game/3/video"
    },
    {
      id: 3,
      title: "창문닦기 게임",
      description: "가려진 사진을 점점 닦아나가며 숨겨진 정답을 맞추는 추리 게임입니다. 관찰력과 추론 능력을 발휘해보세요!",
      videoUrl: "/videos/game2video.mp4",
      thumbnailUrl: "/thumbnail/game2thumbnail.png",
      route: "/game/2/video"
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
      title: "투표 게임",
      description: "여러 후보 중 마음에 드는 후보를 선택하는 투표 게임입니다. 친구들과 함께 의견을 나누고 결과를 확인해보세요!",
      videoUrl: "/videos/game9video.mp4",
      thumbnailUrl: "/thumbnail/game9thumbnail.png",
      route: "/game/9/video"
    },
    {
      id: 10,
      title: "진진가 게임",
      description: (
        <>
          <span className="text-truth">진짜</span> <span className="text-truth">진짜</span> <span className="text-lie">가짜</span>! 진짜 속에 숨겨진 가짜를 찾아내는 고도의 심리 게임! 친구들의 이야기를 듣고 무엇이 진실인지 맞춰보세요.
        </>
      ),
      videoUrl: "/videos/game10video.mp4",
      thumbnailUrl: "/thumbnail/game10thumbnail.png",
      route: "/game/10/video"
    },
    {
      id: 11,
      title: "사다리타기 게임",
      description: "운명의 사다리를 타고 내려가 결과를 확인하세요! 벌칙이나 상품을 정할 때 안성맞춤입니다.",
      videoUrl: "/videos/game11video.mp4",
      thumbnailUrl: "/thumbnail/game11thumbnail.png",
      route: "/game/11/video"
    },
    {
      id: 12,
      title: "퍼즐 게임",
      description: "다양한 조각을 맞춰 완성하는 재미있는 퍼즐 게임! 친구들과 함께 퍼즐을 맞춰보세요.",
      videoUrl: "/videos/game12video.mp4",
      thumbnailUrl: "/thumbnail/game12thumbnail.png",
      route: "/game/12/video"
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
          <p className="loading-percentage">{Math.floor(loadingProgress)}%</p>
          <p className="loading-notice">💻 PC에 최적화 되어있습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="title-header">
        <img src={oneIceImg} alt="" className="header-ice" />
        <h1>얼박사</h1>
        <div className="header-buttons">
          <button
            className="saved-btn header-action-btn"
            onClick={() => setIsSavedGamesModalOpen(true)}
            title="임시저장 불러오기"
          >
            💾
          </button>
          <button
            className="notice-btn header-action-btn"
            onClick={() => {
              setIsNoticeModalOpen(true)
              setHasUnreadNotice(false)
              localStorage.setItem('hasReadNotice_20260307', 'true')
            }}
            aria-label="공지사항"
          >
            <span className={hasUnreadNotice ? "unread-animation" : ""}>
              📢
            </span>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-spacer"></div>

        <div className="text-container">
          <div
            className={`animated-text subtitle ${scrollY > 50 ? 'visible' : ''}`}
          >
            <span className="highlight-text">어린이 박사</span>의 <span className="highlight-text">얼음 박살</span> <br className="mobile-only-br" />아이스 브레이킹 게임모음
          </div>

          <div
            className={`animated-text main-title ${scrollY > 100 ? 'visible' : ''}`}
          >
            <img src={mainPenguinImg} alt="펭귄" className="main-penguin" />
            얼박사
            <div className="edu-container">
              <span className="edu-char edu-top">에</span>
              <span className="edu-char edu-bottom">듀</span>
            </div>
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
                className={`home-game-card ${game.isComingSoon ? 'coming-soon-card' : ''} ${game.customClass || ''}`}
                onMouseEnter={() => !game.isComingSoon && setHoveredGame(game.id)}
                onMouseLeave={(e) => {
                  if (!game.isComingSoon) {
                    setHoveredGame(null)
                    handleCardMouseLeave(e)
                  }
                }}
                onMouseMove={(e) => handleCardMouseMove(e, game.id)}
              >
                {game.isComingSoon ? (
                  <>
                    <div className="game-image coming-soon-image">
                      <div className="coming-soon-content">
                        <span className="coming-soon-icon">{game.icon || "🎁"}</span>
                        <span className="coming-soon-text">{game.comingSoonText || "준비 중"}</span>
                      </div>
                    </div>
                    <div className="game-title-container">
                      <h3 className="game-title">{game.title}</h3>
                      {game.releaseDate && (
                        <span className="coming-soon-badge">{game.releaseDate}</span>
                      )}
                    </div>
                    <p className="game-description">
                      {game.description}
                    </p>
                    <button
                      className="game-start-btn coming-soon-btn"
                      disabled
                    >
                      {game.comingSoonText || "준비 중"}
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

        <NoticeModal
          isOpen={isNoticeModalOpen}
          onClose={() => setIsNoticeModalOpen(false)}
        />

        <SavedGamesModal
          isOpen={isSavedGamesModalOpen}
          onClose={() => setIsSavedGamesModalOpen(false)}
        />

        <section className="about-section">
          <div className="about-container">
            <div className="about-header">
              <span className="about-icon">🐧</span>
              <h2>얼박사 에듀란?</h2>
            </div>
            <p className="about-text">
              <strong>얼박사(어린이 박사)</strong>는 누구나 쉽고 재미있게 즐길 수 있는 <strong>아이스 브레이킹 게임 모음</strong> 서비스입니다.<br />
              지루할 수 있는 수업 시간이나 모임의 시작을 시원한 얼음을 깨듯 활기차게 열어드리고 싶어 탄생했습니다!
            </p>
            <div className="about-features">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <p>간단하고 명확한 게임 규칙</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏫</span>
                <p>선생님과 학생이 함께하는 교육용 모드</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎮</span>
                <p>모두가 주인공이 되는 아이스브레이킹</p>
              </div>
            </div>
            <p className="about-footer">
              매일 똑같은 일상에 작은 즐거움이 필요할 때, 얼박사가 함께할게요! ❄️
            </p>
          </div>
        </section>

        <div className="ice-animation-container">
          <img src={twoIcesImg} alt="" className="floating-ice ice-1" />
          <img src={oneIceImg} alt="" className="floating-ice ice-2" />
          <img src={oneIceImg} alt="" className="floating-ice ice-3" />
        </div>
      </main>
    </div>
  )
}

export default HomePage