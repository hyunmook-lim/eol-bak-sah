import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import './Game8Build2.css'
import LandscapeOnly from '../../common/LandscapeOnly'

function Game8Build2() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialQuestions = location.state?.questions || []

  const [questions, setQuestions] = useState(initialQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [previewBox, setPreviewBox] = useState(null)
  const [fixedBox, setFixedBox] = useState(null)
  const [showZoomPreview, setShowZoomPreview] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(20)

  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/game/8/build')
    }
  }, [questions, navigate])

  // 문제 전환 시 저장된 좌표 로드
  useEffect(() => {
    if (currentQuestion?.startX !== undefined) {
      const imgElement = document.querySelector('.preview-image')
      if (imgElement && imgElement.complete) {
        const containerRect = imgElement.parentElement.getBoundingClientRect()
        const naturalWidth = imgElement.naturalWidth
        const naturalHeight = imgElement.naturalHeight
        const naturalRatio = naturalWidth / naturalHeight
        const containerRatio = containerRect.width / containerRect.height

        // object-fit: contain으로 인한 실제 표시 영역 계산
        let displayWidth, displayHeight, offsetX, offsetY
        if (naturalRatio > containerRatio) {
          displayWidth = containerRect.width
          displayHeight = containerRect.width / naturalRatio
          offsetX = 0
          offsetY = (containerRect.height - displayHeight) / 2
        } else {
          displayHeight = containerRect.height
          displayWidth = containerRect.height * naturalRatio
          offsetX = (containerRect.width - displayWidth) / 2
          offsetY = 0
        }

        const scale = displayWidth / naturalWidth

        setFixedBox({
          x: currentQuestion.startX * scale + offsetX,
          y: currentQuestion.startY * scale + offsetY,
          width: currentQuestion.startWidth * scale,
          height: currentQuestion.startHeight * scale,
        })
      }
    } else {
      setFixedBox(null)
    }
  }, [currentIndex, currentQuestion])

  const handleBackToBuild = () => {
    navigate('/game/8/build', { state: { questions } })
  }

  const handleBackToHome = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmExit = () => {
    setShowConfirmModal(false)
    navigate('/')
    setTimeout(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' })
    }, 50)
  }

  const handleCancelExit = () => {
    setShowConfirmModal(false)
  }

  const handlePreview = () => {
    if (currentQuestion?.startX !== undefined) {
      setZoomLevel(20)
      setShowZoomPreview(true)
    }
  }

  const handleClosePreview = () => {
    setShowZoomPreview(false)
    setZoomLevel(20)
  }

  const handleZoomClick = () => {
    const zoomLevels = [20, 15, 10, 8, 6, 4, 2, 1]
    const currentIndex = zoomLevels.indexOf(zoomLevel)
    const nextIndex = (currentIndex + 1) % zoomLevels.length
    setZoomLevel(zoomLevels[nextIndex])
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleDeleteQuestion = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    const updatedQuestions = questions.filter((_, idx) => idx !== currentIndex)

    if (updatedQuestions.length === 0) {
      navigate('/game/8/build')
      return
    }

    setQuestions(updatedQuestions)

    if (currentIndex >= updatedQuestions.length) {
      setCurrentIndex(updatedQuestions.length - 1)
    }

    setShowDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handleComplete = () => {
    // 모든 문제에 시작점이 설정되어 있는지 확인
    const allQuestionsComplete = questions.every(q => q.startX !== undefined && q.startY !== undefined)

    if (allQuestionsComplete) {
      // gameplay 화면으로 이동
      navigate('/game/8/gameplay', { state: { questions } })
    }
  }

  const handleImageMouseMove = (e) => {
    if (fixedBox) return // 고정된 상자가 있으면 미리보기 안함

    const imgElement = e.currentTarget.querySelector('.preview-image')
    if (!imgElement || !imgElement.complete) return

    // 실제 이미지 크기
    const naturalWidth = imgElement.naturalWidth
    const naturalHeight = imgElement.naturalHeight
    const naturalRatio = naturalWidth / naturalHeight

    // 컨테이너 크기
    const containerRect = e.currentTarget.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    const containerRatio = containerWidth / containerHeight

    // object-fit: contain으로 인한 실제 표시 영역 계산
    let displayWidth, displayHeight, offsetX, offsetY
    if (naturalRatio > containerRatio) {
      displayWidth = containerWidth
      displayHeight = containerWidth / naturalRatio
      offsetX = 0
      offsetY = (containerHeight - displayHeight) / 2
    } else {
      displayHeight = containerHeight
      displayWidth = containerHeight * naturalRatio
      offsetX = (containerWidth - displayWidth) / 2
      offsetY = 0
    }

    // 마우스 위치 (컨테이너 기준)
    const mouseX = e.clientX - containerRect.left
    const mouseY = e.clientY - containerRect.top

    // 마우스 위치 (실제 이미지 표시 영역 기준)
    const imgMouseX = mouseX - offsetX
    const imgMouseY = mouseY - offsetY

    // 박스 크기 (표시된 이미지의 5%)
    const boxWidth = displayWidth * 0.05
    const boxHeight = displayHeight * 0.05

    // 박스 위치 계산
    const maxX = displayWidth - boxWidth
    const maxY = displayHeight - boxHeight
    const boxX = Math.max(0, Math.min(imgMouseX - boxWidth / 2, maxX))
    const boxY = Math.max(0, Math.min(imgMouseY - boxHeight / 2, maxY))

    setPreviewBox({
      x: boxX + offsetX,
      y: boxY + offsetY,
      width: boxWidth,
      height: boxHeight,
    })
  }

  const handleImageMouseLeave = () => {
    setPreviewBox(null)
  }

  const handleImageClick = (e) => {
    const imgElement = e.currentTarget.querySelector('.preview-image')
    if (!imgElement || !imgElement.complete) return

    // 실제 이미지 크기
    const naturalWidth = imgElement.naturalWidth
    const naturalHeight = imgElement.naturalHeight
    const naturalRatio = naturalWidth / naturalHeight

    // 컨테이너 크기
    const containerRect = e.currentTarget.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    const containerRatio = containerWidth / containerHeight

    // object-fit: contain으로 인한 실제 표시 영역 계산
    let displayWidth, displayHeight, offsetX, offsetY
    if (naturalRatio > containerRatio) {
      // 이미지가 더 넓음 - 너비에 맞춤
      displayWidth = containerWidth
      displayHeight = containerWidth / naturalRatio
      offsetX = 0
      offsetY = (containerHeight - displayHeight) / 2
    } else {
      // 이미지가 더 높음 - 높이에 맞춤
      displayHeight = containerHeight
      displayWidth = containerHeight * naturalRatio
      offsetX = (containerWidth - displayWidth) / 2
      offsetY = 0
    }

    // 클릭 위치 (컨테이너 기준)
    const clickX = e.clientX - containerRect.left
    const clickY = e.clientY - containerRect.top

    // 클릭 위치 (실제 이미지 표시 영역 기준)
    const imgClickX = clickX - offsetX
    const imgClickY = clickY - offsetY

    // 박스 크기 (표시된 이미지의 5%)
    const boxWidth = displayWidth * 0.05
    const boxHeight = displayHeight * 0.05

    // 박스 위치 계산
    const maxX = displayWidth - boxWidth
    const maxY = displayHeight - boxHeight
    const boxX = Math.max(0, Math.min(imgClickX - boxWidth / 2, maxX))
    const boxY = Math.max(0, Math.min(imgClickY - boxHeight / 2, maxY))

    // 실제 이미지 크기 기준으로 변환
    const scale = naturalWidth / displayWidth
    const realX = boxX * scale
    const realY = boxY * scale
    const realWidth = boxWidth * scale
    const realHeight = boxHeight * scale

    // 화면 표시용 고정 상자 (컨테이너 기준)
    setFixedBox({
      x: boxX + offsetX,
      y: boxY + offsetY,
      width: boxWidth,
      height: boxHeight,
    })

    // 실제 이미지 좌표 저장
    const updatedQuestions = [...questions]
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      startX: realX,
      startY: realY,
      startWidth: realWidth,
      startHeight: realHeight,
    }
    setQuestions(updatedQuestions)
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <LandscapeOnly>
    <div className="game8-build2-container">
      <header className="game-title-header">
        <button onClick={handleBackToBuild} className="header-back-btn">
          &lt;
        </button>
        <h1>시작점 설정</h1>
        <button onClick={handleBackToHome} className="header-close-btn">
          X
        </button>
      </header>

      <div className="game-play-container">
        {/* 제목 영역 */}
        <div className="title-section">
          <div className="section-header">
            <div className="section-left">
              <h2>2. 시작점 설정</h2>
              <div className="question-counter">
                <span className="current-count">{currentIndex + 1}</span>
                <span className="separator">/</span>
                <span className="total-count">{questions.length}</span>
              </div>
            </div>
            <p className="section-description">가장 처음으로 보여지는 확대지점을 클릭해주세요.</p>
            <button className="delete-question-btn" onClick={handleDeleteQuestion}>
              <FaTrash />
            </button>
          </div>
          <div className="divider"></div>
        </div>

        {/* 설정 영역 */}
        <div className="settings-section">
          <div
            className="photo-preview-container"
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
            onClick={handleImageClick}
          >
            <div className="image-wrapper">
              <img
                src={currentQuestion.imageUrl}
                alt={`사진 ${currentIndex + 1}`}
                className="preview-image"
              />
              {previewBox && !fixedBox && (
                <div
                  className="preview-box"
                  style={{
                    left: `${previewBox.x}px`,
                    top: `${previewBox.y}px`,
                    width: `${previewBox.width}px`,
                    height: `${previewBox.height}px`,
                  }}
                ></div>
              )}
              {fixedBox && (
                <div
                  className="fixed-box"
                  style={{
                    left: `${fixedBox.x}px`,
                    top: `${fixedBox.y}px`,
                    width: `${fixedBox.width}px`,
                    height: `${fixedBox.height}px`,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>

        {/* 조작 영역 */}
        <div className="control-section">
          <div className="navigation-section">
            <button
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← 이전
            </button>

            <div className="action-buttons">
              <button
                className="preview-btn"
                onClick={handlePreview}
                disabled={!currentQuestion?.startX}
              >
                미리보기
              </button>
              <button
                className="complete-btn"
                onClick={handleComplete}
                disabled={!questions.every(q => q.startX !== undefined && q.startY !== undefined)}
              >
                완료
              </button>
            </div>

            <button
              className="nav-btn next-btn"
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              다음 →
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelExit}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>홈으로 돌아가시겠습니까?</h3>
              <p>작업 중인 내용이 저장되지 않을 수 있습니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmExit}>
                확인
              </button>
              <button className="cancel-btn" onClick={handleCancelExit}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="confirm-modal-overlay" onClick={handleCancelDelete}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-body">
              <h3>문제를 삭제하시겠습니까?</h3>
              <p>삭제된 문제는 복구할 수 없습니다.</p>
            </div>
            <div className="confirm-modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmDelete}>
                확인
              </button>
              <button className="cancel-btn" onClick={handleCancelDelete}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showZoomPreview && currentQuestion?.startX !== undefined && (
        <div className="zoom-preview-overlay" onClick={handleClosePreview}>
          <div className="zoom-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="zoom-close-btn" onClick={handleClosePreview}>
              X
            </button>
            <div className="zoom-level-indicator">
              줌: {zoomLevel === 1 ? '원본' : `${zoomLevel}배`}
            </div>
            <div className="zoom-image-container" onClick={handleZoomClick}>
              <canvas
                ref={(canvas) => {
                  if (canvas && currentQuestion.imageUrl) {
                    const ctx = canvas.getContext('2d')
                    const img = new Image()
                    img.crossOrigin = 'anonymous'
                    img.src = currentQuestion.imageUrl
                    img.onload = () => {
                      // 선택 영역의 중심점
                      const centerX = currentQuestion.startX + currentQuestion.startWidth / 2
                      const centerY = currentQuestion.startY + currentQuestion.startHeight / 2

                      // 줌 레벨에 따라 보여줄 영역 크기 계산
                      // 줌 레벨이 낮을수록 더 넓은 영역을 보여줌
                      const viewWidth = (currentQuestion.startWidth * 20) / zoomLevel
                      const viewHeight = (currentQuestion.startHeight * 20) / zoomLevel

                      // 보여줄 영역의 시작점 (중심점 기준)
                      let sourceX = centerX - viewWidth / 2
                      let sourceY = centerY - viewHeight / 2

                      // 이미지 경계를 벗어나지 않도록 조정
                      sourceX = Math.max(0, Math.min(sourceX, img.naturalWidth - viewWidth))
                      sourceY = Math.max(0, Math.min(sourceY, img.naturalHeight - viewHeight))

                      // 캔버스 크기는 항상 동일 (선택 영역의 20배)
                      const canvasWidth = currentQuestion.startWidth * 20
                      const canvasHeight = currentQuestion.startHeight * 20

                      canvas.width = canvasWidth
                      canvas.height = canvasHeight

                      ctx.clearRect(0, 0, canvas.width, canvas.height)
                      ctx.drawImage(
                        img,
                        sourceX,
                        sourceY,
                        viewWidth,
                        viewHeight,
                        0,
                        0,
                        canvasWidth,
                        canvasHeight
                      )
                    }
                  }
                }}
                className="zoomed-image"
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div className="zoom-guide-message">
              사진을 클릭하면 이미지가 점점 드러나요!
            </div>
          </div>
        </div>
      )}
    </div>
    </LandscapeOnly>
  )
}

export default Game8Build2
