import { useEffect, useState } from 'react'
import styles from './WarningPopup.module.scss'

type WarningPopupProps = {
  message: string
  trigger: boolean
  initialTime: number
  time: number
  onClose: () => void
}

export const WarningPopup = ({ message, trigger, initialTime, time, onClose }: WarningPopupProps) => {
  const [closeHovered, setCloseHovered] = useState(false)
  const [currentStyle, setCurrentStyle] = useState(styles.None)

  const handleOnClose = () => {
    if (currentStyle == styles.Show) {
      setCurrentStyle(styles.Hide)
      setTimeout(() => {
        setCurrentStyle(styles.None)
      }, 500)
    }
    onClose()
  }

  useEffect(() => {
    if (trigger) {
      setCurrentStyle(styles.Show)
    } else {
      handleOnClose()
    }
  }, [trigger])

  return (
    <div className={currentStyle}>
      {message}
      <svg
        className={styles.Circle}
        width="40"
        height="40"
        onMouseEnter={() => setCloseHovered(true)}
        onMouseLeave={() => setCloseHovered(false)}
      >
        <circle
          className={styles.ProgressCircle}
          style={
            {
              '--time': `${initialTime}s`
            } as any
          }
          cx="20"
          cy="20"
          r="16"
          stroke="#ccc"
          strokeWidth="4"
          fill="none"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={styles.TimerText}
          onClick={() => handleOnClose()}
        >
          {closeHovered ? 'X' : time}
        </text>
      </svg>
    </div>
  )
}
