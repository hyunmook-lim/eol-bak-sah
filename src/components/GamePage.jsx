import { useParams } from 'react-router-dom'
import Game1Video from './games/game1/Game1Video'
import Game2Video from './games/game2/Game2Video'
import Game3Video from './games/game3/Game3Video'
import Game4Video from './games/game4/Game4Video'
import Game5Video from './games/game5/Game5Video'
import Game6Video from './games/game6/Game6Video'
import Game7Video from './games/game7/Game7Video'
import Game8Video from './games/game8/Game8Video'
import Game9Video from './games/game9/Game9Video'

function GamePage() {
  const { gameId } = useParams()

  const gameComponents = {
    '1': Game1Video,
    '2': Game2Video,
    '3': Game3Video,
    '4': Game4Video,
    '5': Game5Video,
    '6': Game6Video,
    '7': Game7Video,
    '8': Game8Video,
    '9': Game9Video,
  }

  const GameComponent = gameComponents[gameId]

  if (!GameComponent) {
    return (
      <div className="game-page">
        <div className="game-container">
          <h1>게임을 찾을 수 없습니다</h1>
          <button onClick={() => window.location.href = '/'} className="back-btn">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return <GameComponent />
}

export default GamePage