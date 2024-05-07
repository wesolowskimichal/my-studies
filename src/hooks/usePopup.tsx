import { useEffect, useState } from 'react'
import { WarningPopup } from '../components/WarningPopup/WarningPopup'
import { InfoPopup } from '../components/InfoPopup/InfoPopup'
import { ApiResponse } from '../services/API/ApiResponse'

export const usePopup = () => {
  const [message, setMessage] = useState('')
  const [initialTime, setInitialTime] = useState(0)
  const [time, setTime] = useState(0)
  const [trigger, setTrigger] = useState(false)
  const [popupType, setPopupType] = useState<'Warning' | 'Token' | 'Info'>('Info')
  const [onTimeOut, setOnTimeOut] = useState<(() => void) | null>(null)
  const [onClose, setOnClose] = useState<(() => void) | null>(null)

  const handleError = (apiResponse: ApiResponse) => {
    switch (apiResponse) {
      case ApiResponse.BAD_RESPONSE:
        setMessage('Error: Niepoprawne zachowanie')
        break
      case ApiResponse.UNAUTHORIZED:
        setMessage('Error: Niezautoryzowany użownik')
        break
      case ApiResponse.FORBIDDEN:
        setMessage('Error: Brak dostępu')
        break
      case ApiResponse.NOT_FOUND:
        setMessage('Error: Nie znaleziono zasobu')
        break
      case ApiResponse.TIMEOUT:
        setMessage('Error: Przekroczono maksymalny czas')
        break
      case ApiResponse.INTERNAL_SERVER:
        setMessage('Error: Serwer jest offline')
        break
      case ApiResponse.BAD_GATEWAY:
        setMessage('Error: Niepoprawna bramka')
        break
      case ApiResponse.GATEWAY_TIMEOUT:
        setMessage('Error: Przekroczono maksymalny czas bramki')
        break
    }
  }

  useEffect(() => {
    if (trigger) {
      const timeOut = setInterval(() => {
        setTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1
          } else {
            setTrigger(false)
            clearInterval(timeOut)
            if (onTimeOut) onTimeOut()
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

  const handleOnClose = () => {
    setTrigger(false)
    if (onClose) onClose()
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
            onClose={() => handleOnClose()}
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
            onClose={() => handleOnClose()}
          />
        )
    }
  }

  return {
    popupType,
    setPopupType,
    onClose,
    setOnClose,
    onTimeOut,
    setOnTimeOut,
    trigger,
    setTrigger,
    time,
    setTime: handleSetTime,
    message,
    setMessage,
    handleError,
    popup: getPopup()
  }
}
