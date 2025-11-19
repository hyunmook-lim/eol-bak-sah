import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { HiLightBulb } from 'react-icons/hi'
import useSound from 'use-sound'
import './Game7Gameplay.css'
const penguinImage = '/images/curious-penguin.png'
const penguinFootCursor = '/images/penguin-foot.png'
const correctSound = '/sounds/correct.wav'
const wrongSound = '/sounds/wrong.wav'

function Game7Gameplay() {
  const navigate = useNavigate()
  const location = useLocation()
  const gameData = location.state

  const [cards, setCards] = useState([])
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [isHintOn, setIsHintOn] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [gameStarted, setGameStarted] = useState(false)
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [shakingCards, setShakingCards] = useState([])
  const [successCards, setSuccessCards] = useState([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gridLayout, setGridLayout] = useState({ columns: 4, rows: 4 })

  // 소리 효과
  const [playCorrect] = useSound(correctSound, { volume: 0.5 })
  const [playWrong] = useSound(wrongSound, { volume: 0.5 })

  // 카드 쌍 개수에 따른 그리드 레이아웃 계산
  const getGridLayout = (pairCount) => {
    const layouts = {
      3: { columns: 3, rows: 2 },
      4: { columns: 4, rows: 2 },
      5: { columns: 4, rows: 3 },
      6: { columns: 4, rows: 3 },
      7: { columns: 4, rows: 4 },
      8: { columns: 4, rows: 4 },
      9: { columns: 6, rows: 3 },
      10: { columns: 5, rows: 4 },
      11: { columns: 6, rows: 4 },
      12: { columns: 6, rows: 4 },
      13: { columns: 7, rows: 4 },
      14: { columns: 7, rows: 4 },
      15: { columns: 10, rows: 3 },
      16: { columns: 8, rows: 4 }
    }
    return layouts[pairCount] || { columns: 4, rows: 4 }
  }

  useEffect(() => {
    if (!gameData || !gameData.cardPairs) {
      navigate('/game/7/build')
      return
    }

    // 카드 쌍 개수에 따른 그리드 레이아웃 설정
    const pairCount = gameData.cardPairs.length
    const layout = getGridLayout(pairCount)
    setGridLayout(layout)

    // 각 이미지를 2장씩 만들고 섞기
    const cardDeck = []
    gameData.cardPairs.forEach((pair, index) => {
      // 첫 번째 카드
      cardDeck.push({
        id: `card-${index}-1`,
        pairId: index,
        image: pair.image
      })
      // 두 번째 카드 (같은 이미지)
      cardDeck.push({
        id: `card-${index}-2`,
        pairId: index,
        image: pair.image
      })
    })

    // 카드 섞기
    const shuffledCards = cardDeck.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }, [gameData, navigate])

  // 게임 완료 체크
  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
      setTimeout(() => {
        setGameCompleted(true)
      }, 1000)
    }
  }, [matchedCards, cards.length])

  const handleBackToBuild = () => {
    navigate('/game/7/build')
  }

  const handleBackToHome = () => {
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleGameComplete = () => {
    navigate('/game/7/finish', {
      state: {
        gameType: '메모리 카드 게임',
        gameData: gameData
      }
    })
  }

  const handleCardClick = (cardId) => {
    // 처리 중이거나, 이미 뒤집혔거나, 매칭된 카드는 클릭 불가
    if (isProcessing || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return
    }

    // 카드 뒤집기
    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // 2장이 뒤집혔을 때 매칭 검사
    if (newFlippedCards.length === 2) {
      setIsProcessing(true)

      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstCardId)
      const secondCard = cards.find(card => card.id === secondCardId)

      // 같은 카드인지 확인 (pairId가 같으면 같은 카드)
      if (firstCard.pairId === secondCard.pairId) {
        // 매칭 성공 - 성공 애니메이션
        setSuccessCards([firstCardId, secondCardId])

        // 소리 재생
        if (isSoundOn) {
          playCorrect()
        }

        setTimeout(() => {
          setMatchedCards(prev => [...prev, firstCardId, secondCardId])
          setFlippedCards([])
          setSuccessCards([])
          setIsProcessing(false)
        }, 800)
      } else {
        // 매칭 실패 - 흔들기 애니메이션 후 다시 뒤집기
        setShakingCards([firstCardId, secondCardId])

        // 소리 재생
        if (isSoundOn) {
          playWrong()
        }

        setTimeout(() => {
          setShakingCards([])
          setFlippedCards([])
          setIsProcessing(false)
        }, 1000)
      }
    }
  }

  return (
    <div className="game7-gameplay-container" onMouseMove={handleMouseMove}>
      <header className="game-title-header">
        <button onClick={handleBackToBuild} className="header-back-btn">
          &lt;
        </button>
        <h1>메모리 카드 게임</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>

      {/* 게임 화면 - 항상 표시 */}
      <div className={`gameplay-container ${!gameStarted ? 'game-paused' : ''}`}>
        {/* 상단 컨트롤 영역 */}
        <div className="control-section">
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
                <HiLightBulb />
              </span>
              <div className="toggle-switch" onClick={() => setIsHintOn(!isHintOn)}>
                <div className={`toggle-slider ${isHintOn ? 'active' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 게임 영역 */}
        <div className="game-section hide-cursor">
          <div
            className="cards-grid"
            style={{
              gridTemplateColumns: `repeat(${gridLayout.columns}, minmax(60px, 120px))`,
              gridTemplateRows: `repeat(${gridLayout.rows}, minmax(60px, 120px))`
            }}
          >
            {cards.map((card) => {
              const isFlipped = isHintOn || flippedCards.includes(card.id) || matchedCards.includes(card.id)
              const isMatched = matchedCards.includes(card.id)
              const isShaking = shakingCards.includes(card.id)
              const isSuccess = successCards.includes(card.id)

              return (
                <div
                  key={card.id}
                  className="game-card"
                  onClick={() => !isHintOn && handleCardClick(card.id)}
                >
                  <div className={`card-inner ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''} ${isShaking ? 'shaking' : ''} ${isSuccess ? 'success' : ''} ${isHintOn ? 'hint' : ''}`}>
                    <div className="card-front">
                      <img src={card.image} alt="카드" />
                    </div>
                    <div className="card-back">
                      <img src={penguinImage} alt="카드 뒷면" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 게임 시작 화면 - 오버레이로 표시 */}
      {!gameStarted && !gameCompleted && (
        <div className="game-start-overlay">
          <div className="game-start-content">
            <h2>메모리 카드 게임</h2>
            <p>카드를 뒤집어서 같은 그림을 찾아보세요!</p>
            <button onClick={handleStartGame} className="start-game-btn">
              게임 시작
            </button>
          </div>
        </div>
      )}

      {/* 게임 완료 화면 */}
      {gameCompleted && (
        <div className="game-complete-overlay">
          <div className="game-complete-content">
            <h2>🎉 축하합니다! 🎉</h2>
            <p>모든 카드를 성공적으로 맞추셨습니다!</p>
            <div className="complete-buttons">
              <button onClick={handleBackToBuild} className="complete-btn secondary">
                다시 만들기
              </button>
              <button onClick={handleGameComplete} className="complete-btn primary">
                게임 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 펭귄 발 커서를 전체 컨테이너에 배치 */}
      <img
        src={penguinFootCursor}
        alt="Penguin Foot Cursor"
        className="penguin-foot-cursor"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          width: 40,
          height: 40
        }}
      />
    </div>
  )
}

export default Game7Gameplay
