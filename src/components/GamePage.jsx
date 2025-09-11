import { useParams } from 'react-router-dom'
import GameVideo from './games/GameVideo'

function GamePage() {
  const { gameId } = useParams()

  const gameVideos = {
    '1': null, // 동영상 URL을 추후 추가
    '2': null,
    '3': null,
    '4': null,
    '5': null,
    '6': null,
    '7': null,
    '8': null,
    '9': null,
  }

  if (!gameVideos.hasOwnProperty(gameId)) {
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

  return <GameVideo videoUrl={gameVideos[gameId]} />
}

export default GamePage