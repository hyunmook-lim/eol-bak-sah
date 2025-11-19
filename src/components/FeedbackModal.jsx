import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './FeedbackModal.css'

function FeedbackModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      alert('메시지를 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      // EmailJS를 사용하여 이메일 전송
      const templateParams = {
        from_name: name || '익명',
        message: message,
        to_email: 'hmlim0320@gmail.com'
      }

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      alert('의견이 성공적으로 전송되었습니다!')

      // 폼 초기화 및 모달 닫기
      setName('')
      setMessage('')
      setIsSubmitting(false)
      onClose()
    } catch (error) {
      console.error('이메일 전송 오류:', error)
      alert('이메일 전송에 실패했습니다. 다시 시도해주세요.')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2 className="modal-title">의견 보내기</h2>
        <p className="modal-description">
          얼박사에 대한 의견이나 제안사항을 보내주세요!
        </p>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">이름 (선택)</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">의견 *</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="의견이나 제안사항을 자유롭게 작성해주세요"
              className="form-textarea"
              rows="6"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '전송 중...' : '보내기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal
