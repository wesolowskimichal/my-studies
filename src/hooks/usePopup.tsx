import { useEffect, useState } from 'react'
import { WarningPopup } from '../components/WarningPopup/WarningPopup'
import { InfoPopup } from '../components/InfoPopup/InfoPopup'

export const usePopup = () => {
  const [message, setMessage] = useState('')
  const [initialTime, setInitialTime] = useState(0)
  const [time, setTime] = useState(0)
  const [trigger, setTrigger] = useState(false)
  const [popupType, setPopupType] = useState<'Warning' | 'Token' | 'Info'>('Info')

  useEffect(() => {
    if (trigger) {
      const timeOut = setInterval(() => {
        setTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1
          } else {
            setTrigger(false)
            clearInterval(timeOut)
            return prevTime
          }
        })
      }, 1000)
      return () => clearInterval(timeOut)
    }
  }, [trigger])

  const handleSetTime = (time: number) => {
    setInitialTime(time)
    setTime(time)
  }

  const getPopup = () => {
    switch (popupType) {
      case 'Warning':
        return (
          <WarningPopup
            message={message}
            trigger={trigger}
            initialTime={initialTime}
            time={time}
            onClose={() => setTrigger(false)}
          />
        )
      case 'Token':
        return <h1>TOKEN</h1>
      case 'Info':
        return (
          <InfoPopup
            message={message}
            trigger={trigger}
            initialTime={initialTime}
            time={time}
            onClose={() => setTrigger(false)}
          />
        )
    }
  }

  return {
    popupType,
    setPopupType,
    trigger,
    setTrigger,
    time,
    setTime: handleSetTime,
    message,
    setMessage,
    popup: getPopup()
  }
}
