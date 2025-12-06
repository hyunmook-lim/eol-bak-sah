import { useState } from 'react'
import './NoticeModal.css'

function NoticeModal({ isOpen, onClose }) {
  const [expandedNotices, setExpandedNotices] = useState({ 0: true })

  const notices = [
    {
      date: '2025.12.06',
      title: '업데이트 안내',
      items: [
        { text: '', highlight: '슝 글자게임', suffix: ', 창문 닦기 게임을 모바일 화면에 최적화 시켰습니다.' },
        { text: '로딩 화면에 ', highlight: 'PC 최적화 안내멘트', suffix: '를 추가했습니다.' }
      ]
    },
    {
      date: '2025.12.04',
      title: '업데이트 안내',
      items: [
        { text: '', highlight: '초성게임', suffix: '에서 이미지에 가리던 버튼을 수정했습니다.' },
        { text: '', highlight: '모바일', suffix: '에서 접근이 불가능 하던 이슈를 해결했습니다.' }
      ]
    },
    {
      date: '2025.12.01',
      title: '새로운 게임 출시',
      items: [
        { text: '9번째 게임 ', highlight: '투표 만들기', suffix: ' 게임이 출시됐습니다.' }
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
                        {item.text}
                        <span className="highlight">{item.highlight}</span>
                        {item.suffix}
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
