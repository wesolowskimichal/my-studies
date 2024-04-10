import { useEffect, useState } from 'react'
import styles from './Alert.module.scss'

interface AlertProps {
  message: string
  timeToRefresh: number
  onClose?: () => void
  onRefresh?: () => void
}

function Alert({ message, timeToRefresh, onClose, onRefresh }: AlertProps) {
  const [time, setTime] = useState(timeToRefresh)
  const [closeHovered, setCloseHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          if (onClose) onClose()
          clearInterval(timer)
          return prevTime
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onClose, timeToRefresh])

  return (
    <div className={styles.Wrapper}>
      <div className={styles.ContentWrapper}>
        <div className={styles.Items}>
          <div className={styles.Timer}>
            <svg
              className={styles.Circle}
              width="40"
              height="40"
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
            >
              <circle
                className={styles.ProgressCircle}
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
                onClick={onClose ? () => onClose() : () => {}}
              >
                {closeHovered ? 'X' : time}
              </text>
            </svg>
          </div>
          <p>{message}</p>
          <div className={styles.Buttons}>
            <button onClick={onRefresh ? () => onRefresh() : () => {}}>Odnów sesje</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert
