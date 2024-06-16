import { useEffect, useState } from 'react'
import styles from './DragAndDrop.module.scss'
import trashIcon from '../../assets/trash_icon.svg'

type DragAndDropProps = {
  onSend?: (file: File) => void
  apiFiles?: string
  disabled?: boolean
}

function DragAndDrop({ onSend, apiFiles = '', disabled = false }: DragAndDropProps) {
  const [file, setFile] = useState<File | null>()
  const [initFile, setInitFile] = useState(apiFiles)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles)
      setFile(newFiles[0])
    }
  }
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer?.files
    if (droppedFiles && droppedFiles?.length > 0) {
      const newFiles = Array.from(droppedFiles)
      setFile(newFiles[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleRemoveInitFile = () => {
    setInitFile('')
  }

  const handleSend = () => {
    if (file) {
      if (onSend) onSend(file)
    }
  }

  console.log(disabled)

  return (
    <div className={styles.Wrapper} style={disabled ? { height: '50px', margin: 0, padding: 0 } : {}}>
      <div className={styles.Files} onDrop={event => handleDrop(event)} onDragOver={event => event.preventDefault()}>
        {!file && initFile.length === 0 && !disabled && <p>Zaimportuj pliki</p>}
        {(file || initFile.length > 0) && (
          <>
            <div className={styles.File}>
              <span>Nazwa pliku</span>
              <span>Wielkość</span>
            </div>
            {initFile.length > 0 && (
              <div className={styles.File}>
                <span>{initFile.split('/').splice(-1)}</span>
                <span> --- </span>
                <img src={trashIcon} onClick={() => handleRemoveInitFile()} />
              </div>
            )}
            {file && (
              <div className={styles.File}>
                <span>{file!.name}</span>
                <span>{(file!.size / (1024 * 1024)).toFixed(2)} MB</span>
                <img src={trashIcon} onClick={() => handleRemoveFile()} />
              </div>
            )}
          </>
        )}
      </div>
      {!file ? (
        <>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            disabled={disabled}
            accept=".zip,application/zip"
          />
          <label htmlFor="browse" className="browse-btn">
            Importuj
          </label>
        </>
      ) : (
        <div className={styles.Footer}>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            disabled={disabled}
            accept=".zip,application/zip"
          />
          <label htmlFor="browse" className="browse-btn">
            Importuj
          </label>
          <button onClick={() => handleSend()}>Wyślij</button>
        </div>
      )}
    </div>
  )
}

export default DragAndDrop
