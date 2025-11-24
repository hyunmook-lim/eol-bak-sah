import { useState } from 'react'
import { HiChevronRight, HiChevronLeft, HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { IoMusicalNotes } from 'react-icons/io5'
import { MdMusicOff } from 'react-icons/md'
import './GlobalUtilityBar.css'

function GlobalUtilityBar({ isSoundEnabled, toggleSound, isMusicEnabled, toggleMusic }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleBar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={`global-utility-bar ${isOpen ? 'open' : ''}`}>
            <div className="utility-content">
                <div className="utility-item" title="배경음악" onClick={toggleMusic}>
                    {isMusicEnabled ? <IoMusicalNotes /> : <MdMusicOff />}
                </div>
                <div className="utility-item" title="효과음" onClick={toggleSound}>
                    {isSoundEnabled ? <HiVolumeUp /> : <HiVolumeOff />}
                </div>
            </div>
            <button className="utility-toggle-btn" onClick={toggleBar}>
                {isOpen ? <HiChevronLeft /> : <HiChevronRight />}
            </button>
        </div>
    )
}

export default GlobalUtilityBar
