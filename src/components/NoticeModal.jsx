import { useState } from 'react'
import './NoticeModal.css'

function NoticeModal({ isOpen, onClose }) {
  const [expandedNotices, setExpandedNotices] = useState({ 0: true })

  const notices = [
    {
      date: '2025.12.30',
      title: '업데이트 안내',
      items: [
        { segments: [{ highlight: '게임 만들기' }, { text: ' 의 삭제 버튼의 아이콘을 수정했습니다.' }] },
        { segments: [{ highlight: '투표' }, { text: ' 의 작은 버그들을 수정했습니다.' }] }
      ]
    },
    {
      date: '2025.12.24',
      title: '업데이트 안내',
      items: [
        { segments: [{ highlight: '게임 만들기' }, { text: ' 화면에 안내문구를 추가했습니다.' }] },
        { segments: [{ highlight: '슝 글자게임 (단어)' }, { text: '의 속도를 더 빠르게 수정했습니다.' }] }
      ]
    },
    {
      date: '2025.12.14',
      title: '업데이트 안내',
      items: [
        { segments: [{ highlight: '슝글자게임' }, { text: '을 라운드 시작 없이 바로 시작하도록 수정했습니다.' }] },
        { segments: [{ highlight: 'OX게임' }, { text: '의 UI를 변경하였습니다.' }] },
        { segments: [{ highlight: '게임 종료' }, { text: ' 화면을 동영상이 재생되도록 수정하였습니다.' }] }
      ]
    },
    {
      date: '2025.12.13',
      title: '업데이트 안내',
      items: [
        { segments: [{ highlight: '홈 화면' }, { text: '의 요소들을 수정했습니다.' }] },
        { segments: [{ highlight: '돋보기 게임' }, { text: '의 정답 공개 방법을 ' }, { highlight: '창문닦기 게임' }, { text: '과 동일하게 만들었습니다.' }] }
      ]
    },
    {
      date: '2025.12.09',
      title: '업데이트 안내',
      items: [
        { segments: [{ highlight: '메모리 카드 게임' }, { text: '의 배경화면과 카드 이미지를 변경하였습니다.' }] }
      ]
    },
    {
      date: '2025.12.06',
      title: '업데이트 안내',
      items: [
        { segments: [{ highlight: '슝 글자게임' }, { text: ', ' }, { highlight: '창문 닦기 게임' }, { text: '을 모바일 화면에 최적화 시켰습니다.' }] },
        { segments: [{ text: '로딩 화면에 ' }, { highlight: 'PC 최적화 안내멘트' }, { text: '를 추가했습니다.' }] }
      ]
    },
    {
      date: '2025.12.04',
      title: '업데이트 안내',
      items: [
        { segments: [{ highlight: '초성게임' }, { text: '에서 이미지에 가리던 버튼을 수정했습니다.' }] },
        { segments: [{ highlight: '모바일' }, { text: '에서 접근이 불가능 하던 이슈를 해결했습니다.' }] }
      ]
    },
    {
      date: '2025.12.01',
      title: '새로운 게임 출시',
      items: [
        { segments: [{ text: '9번째 게임 ' }, { highlight: '투표 만들기' }, { text: ' 게임이 출시됐습니다.' }] }
      ]
    }
  ]

  const toggleNotice = (index) => {
    setExpandedNotices(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content notice-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2 className="modal-title">📢 새로운 소식</h2>

        <div className="notice-list">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="notice-item"
              onClick={() => toggleNotice(index)}
            >
              <div className="notice-header">
                <div>
                  <div className="notice-date">{notice.date}</div>
                  <div className="notice-title">{notice.title}</div>
                </div>
                <span className={`notice-toggle ${expandedNotices[index] ? 'expanded' : ''}`}>
                  {expandedNotices[index] ? '−' : '+'}
                </span>
              </div>
              <div className={`notice-content ${expandedNotices[index] ? 'expanded' : ''}`}>
                <div className="notice-content-inner">
                  <ul>
                    {notice.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.segments.map((segment, segIndex) => (
                          segment.highlight ? (
                            <span key={segIndex} className="highlight">{segment.highlight}</span>
                          ) : (
                            <span key={segIndex}>{segment.text}</span>
                          )
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="notice-close-btn" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  )
}

export default NoticeModal
