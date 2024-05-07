import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from './CoursePosts.module.scss'
import attachmentIcon from '../../assets/attachment_icon.svg'
import hidePostIcon from '../../assets/hidePost_icon.png'
import showPostIcon from '../../assets/showPost_icon.png'
import { RepositoryPost, User } from '../../components/interfaces'
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop'
import { context } from '../../services/UserContext/UserContext'
import { useNavigate } from 'react-router-dom'

interface CoursePostsProps {
  post: RepositoryPost
  postContentVisibility: boolean
  togglePostContentVisibility: () => void
  repositoryId: string
  asView?: boolean
}

function CoursePosts({
  post,
  postContentVisibility,
  togglePostContentVisibility,
  repositoryId,
  asView = false
}: CoursePostsProps) {
  const { user } = context()
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])

  const isTaskDone = (post: RepositoryPost): boolean => {
    return false
  }

  const stringifyDate = (dueDate: Date | undefined): string => {
    if (!dueDate) {
      return ''
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }

    return new Date(dueDate).toLocaleDateString('pl-PL', options)
  }

  const getCssPostHeaderClass = (repositoryPost: RepositoryPost): string => {
    if (repositoryPost.pinned) {
      return styles.Pinned
    } else if (repositoryPost.isTask) {
      return styles.Task
    }
    return ''
  }

  return (
    <>
      <div className={styles.Post}>
        <div className={styles.PostHeader}>
          <button onClick={() => togglePostContentVisibility()}>
            <img src={`${postContentVisibility ? showPostIcon : hidePostIcon}`} alt="Toggle Post Content" />
          </button>
          <h1 className={getCssPostHeaderClass(post)}>{post.title}</h1>
          {post.isTask && (
            <div className={styles.PostHeaderFooterTaskInfo}>
              <h4>Otwarto: {stringifyDate(post.created_at ?? new Date())}</h4>
              <h4>Wymagane do: {stringifyDate(post.due_to)}</h4>
            </div>
          )}
          {!asView && user && user.user_type === 'Teacher' && (
            <div className={styles.TeacherOptions}>
              <button className={styles.EditButton} onClick={() => navigate(`/course/${repositoryId}/post/${post.id}`)}>
                Edit
              </button>
            </div>
          )}
        </div>

        <div className={`${styles.PostContent} ${postContentVisibility ? '' : styles.Hide}`}>
          <textarea
            readOnly
            disabled
            ref={textarea => {
              if (textarea) {
                textarea.style.height = ''
                textarea.style.height = `${textarea.scrollHeight}px`
              }
            }}
            value={post.description}
          />

          {asView && post.localAttachment ? (
            <>
              <a href={post.localAttachment} target="_blank">
                <img src={attachmentIcon} alt="Attachment Icon" />
                Załącznik
              </a>
            </>
          ) : (
            post.attachment && (
              <>
                <a href={`${import.meta.env.VITE_APP_API_URL}${post.attachment}`} target="_blank">
                  <img src={attachmentIcon} alt="Attachment Icon" />
                  Załącznik
                </a>
              </>
            )
          )}
          {post.isTask &&
            (isTaskDone(post) ? (
              <p>as</p>
            ) : (
              <>
                <DragAndDrop onFilesSelected={() => {}} />
              </>
            ))}
        </div>
      </div>
    </>
  )
}

export default CoursePosts
