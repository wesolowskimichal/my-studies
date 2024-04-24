import { useEffect, useState } from 'react'
import styles from './DragAndDrop.module.scss'
import trashIcon from '../../assets/trash_icon.svg'

type DragAndDropProps = {
  onFilesSelected: (file: File[]) => void
}

function DragAndDrop({ onFilesSelected }: DragAndDropProps) {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer?.files
    if (droppedFiles && droppedFiles?.length > 0) {
      const newFiles = Array.from(droppedFiles)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  useEffect(() => {
    onFilesSelected(files)
  }, [files, onFilesSelected])

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Files} onDrop={event => handleDrop(event)} onDragOver={event => event.preventDefault()}>
        {files.length === 0 && <p>Zaimportuj pliki</p>}
        {files.length > 0 && (
          <>
            <div className={styles.File}>
              <span>Nazwa pliku</span>
              <span>Wielkość</span>
            </div>
            {files.map((file, index) => (
              <div className={styles.File} key={index}>
                <span>{file.name}</span>
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                <img src={trashIcon} onClick={() => handleRemoveFile(index)} />
              </div>
            ))}
          </>
        )}
      </div>
      {files.length == 0 ? (
        <>
          <input type="file" hidden id="browse" onChange={handleFileChange} multiple />
          <label htmlFor="browse" className="browse-btn">
            Browse files
          </label>
        </>
      ) : (
        <div className={styles.Footer}>
          <input type="file" hidden id="browse" onChange={handleFileChange} multiple />
          <label htmlFor="browse" className="browse-btn">
            Browse files
          </label>
          <button>Wyślij</button>
        </div>
      )}
    </div>
  )
}

export default DragAndDrop
