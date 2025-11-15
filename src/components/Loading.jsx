import './Loading.css'
import penguinFoot from '../assets/images/penguin-foot.png'

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <img src={penguinFoot} alt="Loading" className="loading-icon foot-1" />
        <img src={penguinFoot} alt="Loading" className="loading-icon foot-2" />
        <img src={penguinFoot} alt="Loading" className="loading-icon foot-3" />
      </div>
    </div>
  )
}

export default Loading
