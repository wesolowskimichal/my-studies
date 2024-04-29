import React, { useEffect, useState } from 'react'
import { RepositoryPostFrame } from '../../components/interfaces'
import styles from './CoursePostView.module.scss'

type CoursePostViewProps = {
  coursePost: RepositoryPostFrame | null
  setCoursePost: (repositoryPost: RepositoryPostFrame) => void
}

export const CoursePostView = ({ coursePost, setCoursePost }: CoursePostViewProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isTask, setIsTask] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [due_to, setDueTo] = useState(new Date())

  useEffect(() => {
    if (coursePost) {
      setTitle(coursePost.title)
      setDescription(coursePost.description)
      setFile(coursePost.attachment ?? null)
      setIsTask(coursePost.isTask)
      setPinned(coursePost.pinned)
      setDueTo(new Date(coursePost.due_to))
    }
  }, [coursePost])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPost: RepositoryPostFrame = {
      title,
      description,
      attachment: file,
      isTask,
      pinned,
      due_to
    }
    setCoursePost(newPost)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]) // Store the file object
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.AddPostForm}>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} /> {/* Handle file input change */}
      </div>
      <div>
        <label>Is Task:</label>
        <input type="checkbox" checked={isTask} onChange={e => setIsTask(e.target.checked)} />
      </div>
      <div>
        <label>Pinned:</label>
        <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
      </div>
      <div>
        <label>Due To:</label>
        <input
          type="date"
          value={due_to.toISOString().split('T')[0]}
          onChange={e => setDueTo(new Date(e.target.value))}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
