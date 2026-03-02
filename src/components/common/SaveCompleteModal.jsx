import React from 'react';
import './SaveCompleteModal.css';

function SaveCompleteModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay" onClick={onClose}>
      <div className="save-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="save-modal-icon">
          <span className="floating-save">💾</span>
          <div className="success-ring"></div>
        </div>
        <div className="save-modal-body">
          <h3>임시저장 완료!</h3>
          <p>
            현재까지 작성한 내용이 안전하게 저장되었습니다.<br />
            홈 화면 우측 상단의 <strong>[💾]</strong> 아이콘 버튼에서<br />언제든 다시 불러올 수 있습니다.
          </p>
        </div>
        <div className="save-modal-footer">
          <button className="save-modal-confirm-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveCompleteModal;
