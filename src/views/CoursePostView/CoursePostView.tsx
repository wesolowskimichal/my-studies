import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { RepositoryPost } from '../../components/interfaces'
import styles from './CoursePostView.module.scss'

type CoursePostViewProps = {
  coursePost: RepositoryPost
  onSubmit: (repositoryPost: RepositoryPost) => void
  setCoursePost: Dispatch<SetStateAction<RepositoryPost>>
}

export const CoursePostView = ({ coursePost, onSubmit, setCoursePost }: CoursePostViewProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isTask, setIsTask] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [due_to, setDueTo] = useState(new Date())

  useEffect(() => {
    setTitle(coursePost.title)
    setDescription(coursePost.description)
    setFile(coursePost.attachment ?? null)
    setIsTask(coursePost.isTask)
    setPinned(coursePost.pinned)
    setDueTo(new Date(coursePost.due_to))
  }, [coursePost])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...coursePost,
      title: title,
      description: description,
      attachment: file,
      isTask: isTask,
      pinned: pinned,
      due_to: due_to
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value)
    console.log(selectedDate)

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }

    setDueTo(new Date(new Date(selectedDate).toLocaleDateString('pl-PL', options)))
  }

  const stringifyDate = (dueDate: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Ensure 24-hour format
    }

    const formattedDate = new Date(dueDate).toLocaleString('pl-PL', options)

    const [datePart, timePart] = formattedDate.split(', ')

    const [day, month, year] = datePart.split('.')
    const [hour, minute] = timePart.split(':')

    return `${year}-${month}-${day}T${hour}:${minute}`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]) // Store the file object
      // setCoursePost(createPost())
    }
  }

  return {
    content: (
      <form onSubmit={handleSubmit} className={styles.AddPostForm}>
        <div>
          <label>Tytuł</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Opis:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className={styles.Footer}>
          <div>
            <label>Załączniki:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div>
            <label>Zadanie:</label>
            <input type="checkbox" checked={isTask} onChange={e => setIsTask(e.target.checked)} />
          </div>
          <div>
            <label>Przypięty:</label>
            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
          </div>
          <div>
            <label>Dostępny do:</label>
            <input
              type="datetime-local"
              value={stringifyDate(due_to)}
              onChange={e => setDueTo(new Date(e.target.value))}
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    ),
    postValue: {
      ...coursePost,
      title: title,
      description: description,
      attachment: file,
      isTask: isTask,
      pinned: pinned,
      due_to: due_to
    }
  }
}
