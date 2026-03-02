import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import './SavedGamesModal.css';

function SavedGamesModal({ isOpen, onClose }) {
  const [savedGames, setSavedGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadSavedGames();
    }
  }, [isOpen]);

  const GAMES_INFO = {
    1: { title: "슝 글자 게임 (단어)", route: "/game/1/build" },
    2: { title: "창문닦기 게임", route: "/game/2/build" },
    3: { title: "슝 글자 게임 (글자)", route: "/game/3/build" },
    4: { title: "뒤죽박죽 글자게임", route: "/game/4/build" },
    5: { title: "초성 게임", route: "/game/5/build" },
    6: { title: "OX 게임", route: "/game/6/build" },
    7: { title: "메모리 카드 게임", route: "/game/7/build" },
    8: { title: "돋보기 게임", route: "/game/8/build" },
    9: { title: "투표 게임", route: "/game/9/build" },
    10: { title: "진진가 게임", route: "/game/10/build" }
  };

  const loadSavedGames = async () => {
    try {
      let allDrafts = [];
      // Loop through game1_drafts to game10_drafts
      for (let i = 1; i <= 10; i++) {
        const drafts = await localforage.getItem(`game${i}_drafts`) || [];
        // Inject gameId into each draft for easier handling later
        const draftsWithGameId = drafts.map(d => ({ ...d, gameId: i }));
        allDrafts = [...allDrafts, ...draftsWithGameId];
      }
      
      // Sort by descending order of date globally
      allDrafts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSavedGames(allDrafts);
    } catch (err) {
      console.error('Failed to load saved games:', err);
    }
  };

  const handleLoadGame = (gameData) => {
    onClose();
    
    // Determine what state to pass based on gameId
    let stateToPass = {};
    if (gameData.gameId === 10) {
      stateToPass = { players: gameData.players };
    } else if (gameData.gameId === 9) {
      stateToPass = { title: gameData.title, candidates: gameData.candidates };
    } else {
      // Games 1~8 typically use 'questions'
      stateToPass = { questions: gameData.questions };
    }

    const route = GAMES_INFO[gameData.gameId]?.route;
    if (route) {
      navigate(route, { state: stateToPass });
    }
  };

  const handleDeleteGame = async (gameId, idToDelete) => {
    if (window.confirm('이 임시저장 데이터를 정말 삭제하시겠습니까?')) {
      try {
        const storageKey = `game${gameId}_drafts`;
        const drafts = await localforage.getItem(storageKey) || [];
        const updatedDrafts = drafts.filter(d => d.id !== idToDelete);
        await localforage.setItem(storageKey, updatedDrafts);
        
        // Update local state
        setSavedGames(prev => prev.filter(d => d.id !== idToDelete));
      } catch (err) {
        console.error('Failed to delete game:', err);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getSubItemCount = (game) => {
    if (game.gameId === 10) return `${game.players?.length || 0}명`;
    if (game.gameId === 9) return `${game.candidates?.length || 0}개 항목`;
    return `${game.questions?.length || 0}문제`;
  };

  if (!isOpen) return null;

  return (
    <div className="saved-games-modal-overlay" onClick={onClose}>
      <div className="saved-games-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="saved-games-modal-header">
          <span className="saved-games-icon">💾</span>
          <h2>임시저장 불러오기</h2>
        </div>
        
        <div className="saved-games-list">
          {savedGames.length === 0 ? (
            <div className="empty-saved-games">
              <p>저장된 게임 데이터가 없습니다.</p>
              <p className="empty-subtext">게임 만들기 화면에서 '임시저장'을 누르면 이곳에 표시됩니다.</p>
            </div>
          ) : (
            savedGames.map((game) => (
              <div key={game.id} className="saved-game-item">
                <div className="saved-game-info">
                  <h3 className="saved-game-title">
                    {GAMES_INFO[game.gameId]?.title || `게임 ${game.gameId}`} ({getSubItemCount(game)})
                  </h3>
                  <p className="saved-game-date">{new Date(game.date).toLocaleString('ko-KR')}</p>
                </div>
                <div className="saved-game-actions">
                  <button className="load-game-btn" onClick={() => handleLoadGame(game)}>
                    이어서 만들기
                  </button>
                  <button className="delete-game-btn" onClick={() => handleDeleteGame(game.gameId, game.id)}>
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="saved-games-modal-footer">
          <button className="close-modal-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default SavedGamesModal;
