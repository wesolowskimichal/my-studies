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
}

function CoursePosts({ post, postContentVisibility, togglePostContentVisibility, repositoryId }: CoursePostsProps) {
  const { user } = context()
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])

  const isTaskDone = (post: RepositoryPost): boolean => {
    return false
  }

  const stringifyDate = (dueDate: Date): string => {
    return dueDate.toString()
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
              <h4>Otwarto: {stringifyDate(post.created_at)}</h4>
              <h4>Wymagane do: {stringifyDate(post.due_to)}</h4>
            </div>
          )}
          {user && user.user_type === 'Teacher' && (
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
            ref={textarea => {
              if (textarea) {
                textarea.style.height = ''
                textarea.style.height = `${textarea.scrollHeight}px`
              }
            }}
          >
            {post.description}
          </textarea>
          {post.attachment && (
            <>
              <a href={`${import.meta.env.VITE_APP_API_URL}${post?.attachment}`} target="_blank">
                <img src={attachmentIcon} alt="Attachment Icon" />
                Załącznik
              </a>
            </>
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
