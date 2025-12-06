import './Loading.css'
const penguinFoot = '/images/penguin-foot.png'

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-container">
          <img src={penguinFoot} alt="Loading" className="loading-icon foot-1" />
          <img src={penguinFoot} alt="Loading" className="loading-icon foot-2" />
          <img src={penguinFoot} alt="Loading" className="loading-icon foot-3" />
        </div>
        <p className="loading-notice">PC에 최적화 되어있습니다</p>
      </div>
    </div>
  )
}

export default Loading
