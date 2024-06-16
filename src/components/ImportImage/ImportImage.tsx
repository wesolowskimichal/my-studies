import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styles from './ImportImage.module.scss'
import closeIcon from '../../assets/removeIcon.svg'
import uploadIcon from '../../assets/uploadIcon.svg'
import plusIcon from '../../assets/plusIcon.svg'
import minusIcon from '../../assets/minusIcon.svg'
import Cropper, { Area } from 'react-easy-crop'

type ImportImageProps = {
  onClose: () => void
  onSaveApiCall: (pictureUrl: string) => Promise<void>
  sendApiCallOnClose?: boolean
}

export const ImportImage = ({ onClose, onSaveApiCall, sendApiCallOnClose = true }: ImportImageProps) => {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const handleImportImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0])
    }
  }

  const handleSaveCroppedImage = useCallback(() => {
    if (!croppedAreaPixels || !imageUrl) {
      return
    }
    const imageEl = new Image()
    imageEl.src = imageUrl
    imageEl.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return
      }

      const { width, height, x, y } = croppedAreaPixels

      canvas.width = width
      canvas.height = height

      ctx.drawImage(imageEl, x, y, width, height, 0, 0, width, height)
      const testUrl = canvas.toDataURL()
      if (sendApiCallOnClose) {
        onSaveApiCall(testUrl)
      }

      URL.revokeObjectURL(testUrl)
    }
  }, [croppedAreaPixels, imageUrl, onClose])

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedArea)
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  useEffect(() => {
    if (image) {
      const fileReaderUrl = URL.createObjectURL(image)
      setImageUrl(fileReaderUrl)
      return () => URL.revokeObjectURL(fileReaderUrl)
    }
  }, [image])

  useEffect(() => {}, [croppedArea, croppedAreaPixels])

  return (
    <div className={styles.Shadow}>
      <div className={styles.Wrapper}>
        <div className={styles.UpperBar}>
          <button title="Zamknij" onClick={() => onClose()}>
            <img src={closeIcon} alt="Zamknij" />
          </button>
        </div>
        <div className={styles.Content}>
          {/* {canvas} */}
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                flexBasis: '80%',
                overflow: 'hidden',
                userSelect: 'none',
                touchAction: 'none',
                cursor: 'move',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              },
              mediaStyle: {
                height: '100%'
              },
              cropAreaStyle: {
                position: 'absolute',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxSizing: 'border-box',
                boxShadow: '0 0 0 9999em',
                color: 'rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
              }
            }}
            disableAutomaticStylesInjection={true}
          />
          <aside className={styles.OptBar}>
            <h2>Ustawienia</h2>
            {image && (
              <div className={styles.Settings}>
                <div className={styles.Buttons}>
                  <div className={styles.CircleButtons}>
                    <button>
                      <img src={plusIcon} alt="Powiększ" onClick={() => {}} />
                    </button>
                    <button>
                      <img src={minusIcon} alt="Pomniejsz" onClick={() => {}} />
                    </button>
                  </div>
                </div>
                <div className={styles.Sliders}>
                  <label htmlFor="radius">Promień: </label>
                  <input
                    type="range"
                    name="radius"
                    id="radius"
                    min={5}
                    step={1}
                    max={100}
                    // value={radiusPercentage}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      // setRadius(parseFloat(event.target.value) / 100)
                    }}
                  />
                </div>
              </div>
            )}
            <label htmlFor="browse" className={styles.ImportImageButton}>
              <img src={uploadIcon} alt="Importuj" />
            </label>
            <input type="file" accept="image/*" hidden id="browse" onChange={handleImportImage} />
          </aside>
        </div>
        <footer>
          <button onClick={() => handleSaveCroppedImage()}>s</button>
        </footer>
      </div>
    </div>
  )
}
