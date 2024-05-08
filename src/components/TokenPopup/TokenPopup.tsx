import { useEffect, useState } from 'react'
import styles from './TokenPopup.module.scss'

type TokenPopupProps = {
  active: boolean
  message: string
  trigger: boolean
  initialTime: number
  time: number
  onClose: () => void
  onRefresh: () => void
}

export const TokenPopup = ({ active, message, trigger, initialTime, time, onClose, onRefresh }: TokenPopupProps) => {
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

  const handleOnRefresh = () => {
    console.log('on refresh press')
    onRefresh()
    if (currentStyle == styles.Show) {
      setCurrentStyle(styles.Hide)
      setTimeout(() => {
        setCurrentStyle(styles.None)
      }, 500)
    }
  }

  useEffect(() => {
    if (!active) return
    if (trigger) {
      setCurrentStyle(styles.Show)
    } else {
      handleOnClose()
    }
  }, [trigger])

  return (
    <div className={currentStyle}>
      <div className={styles.Wrapper}>
        <div className={styles.ContentWrapper}>
          <div className={styles.Items}>
            <div className={styles.Timer}>
              <svg
                className={styles.Circle}
                style={
                  {
                    '--time': `${initialTime}s`
                  } as any
                }
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
                  onClick={() => handleOnClose()}
                >
                  {closeHovered ? 'X' : time}
                </text>
              </svg>
            </div>
            <p>{message}</p>
            <div className={styles.Buttons}>
              <button onClick={handleOnRefresh}>Odnów sesje</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
