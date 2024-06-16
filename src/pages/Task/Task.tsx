import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Page from '../page/Page'
import {
  RepositoryPost,
  RepositoryTaskResponse,
  RepositoryTaskResponseComment,
  User
} from '../../components/interfaces'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import styles from './Task.module.scss'
import dropDownIcon from '../../assets/drop_down_icon.svg'
import dropUpIcon from '../../assets/drop_up_icon.svg'
import inspectIcon from '../../assets/ispect_icon.svg'
import { context } from '../../services/UserContext/UserContext'
import sendIcon from '../../assets/sendIcon.svg'

export const Task = () => {
  const { courseId, taskId } = useParams<{ courseId: string; taskId: string }>()
  const { user } = context()

  const [task, setTask] = useState<RepositoryPost | null>(null)
  const [members, setMembers] = useState<User[]>([])
  const [targetResponse, setTargetResponse] = useState<RepositoryTaskResponse | null>(null)
  const [responses, setResponses] = useState<RepositoryTaskResponse[]>([])
  const [notSubmitted, setNotSubmitted] = useState<User[]>([])
  const [notMarkedResposnses, setNotMarkedResposnses] = useState<RepositoryTaskResponse[]>([])
  const [markedResposnses, setMarkedResposnses] = useState<RepositoryTaskResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [markedVisible, setMarkedVisible] = useState(true)
  const [notMarkedVisible, setNotMarkedVisible] = useState(true)
  const [submittedVisible, setSubmittedVisible] = useState(true)
  const [notSubmittedVisible, setNotSubmittedVisible] = useState(true)
  const [comments, setComments] = useState<RepositoryTaskResponseComment[]>([])
  const [commentMessage, setCommentMessage] = useState('')
  const [grade, setGrade] = useState('')

  const handleChangeGrade = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gradeString = event.target.value
    const numericGrade = parseFloat(gradeString)
    if (!isNaN(numericGrade)) {
      setGrade(gradeString)
    }
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

  const sendComment = () => {
    const postComment = async () => {
      const commentResponse = await ApiService.getInstance().sendTaskResponseComment(
        courseId!,
        taskId!,
        targetResponse!.id!,
        commentMessage
      )
      if (commentResponse.responseCode === ApiResponse.POSITIVE) {
        setComments(prevComments => [commentResponse.data!, ...prevComments])
      }
    }
    postComment()
    setCommentMessage('')
  }

  useEffect(() => {
    const fetchComments = async () => {
      const commentsResponse = await ApiService.getInstance().getTaskResponseComment(
        courseId!,
        taskId!,
        targetResponse!.id!
      )
      if (commentsResponse.responseCode === ApiResponse.POSITIVE) {
        setComments(commentsResponse.data!)
      }
    }
    if (targetResponse) {
      fetchComments()
      setGrade(targetResponse.mark ? targetResponse.mark.toString() : '')
    }
  }, [targetResponse])

  useEffect(() => {
    const initial: {
      notMarked: RepositoryTaskResponse[]
      marked: RepositoryTaskResponse[]
      submittedUserIds: Set<any>
    } = {
      notMarked: [],
      marked: [],
      submittedUserIds: new Set()
    }

    const result = responses.reduce((acc, response) => {
      if (response.mark === null) {
        acc.notMarked.push(response)
      } else {
        acc.marked.push(response)
      }
      acc.submittedUserIds.add(response.owner.id)
      return acc
    }, initial)

    setNotMarkedResposnses(result.notMarked)
    setMarkedResposnses(result.marked)

    const notSubmittedMembers = members.filter(member => !result.submittedUserIds.has(member.id))
    setNotSubmitted(notSubmittedMembers)
  }, [responses, members])

  useEffect(() => {
    const loadMembers = async () => {
      const membersResponse = await ApiService.getInstance().getEnrollments(courseId!)
      if (membersResponse.responseCode === ApiResponse.POSITIVE) {
        const enrolledUsers = membersResponse.data!.filter(enrollment => enrollment.status)
        const users = enrolledUsers.map(enrollment => enrollment.user)
        setMembers(users)
      }
    }

    const loadResponses = async () => {
      const responsesResponse = await ApiService.getInstance().getTaskResponses(courseId!, taskId!)
      if (responsesResponse.responseCode === ApiResponse.POSITIVE) {
        setResponses(responsesResponse.data!)
      }
    }

    const loadTask = async () => {
      const responseTask = await ApiService.getInstance().getPost(courseId!, taskId!)
      if (responseTask.responseCode == ApiResponse.POSITIVE) {
        setTask(responseTask.data)
      }
    }
    loadMembers()
    loadResponses()
    loadTask()
    setLoading(false)
  }, [])

  const gradeTask = () => {
    const postGrade = async () => {
      const response = await ApiService.getInstance().setGRadeToTaskResponse(
        courseId!,
        taskId!,
        task!.id!,
        Number(grade)
      )
      if (response.responseCode === ApiResponse.POSITIVE) {
        setResponses(prevResponses =>
          prevResponses.map(prevResponse => {
            if (prevResponse.id === response.data!.id) {
              return response.data!
            }
            return prevResponse
          })
        )
      }
    }
    postGrade()
  }

  return (
    <Page name={`Zadanie:`} teacherOnly={true}>
      {loading ? (
        <div className="centeredLoader"></div>
      ) : (
        <div className={styles.Wrapper}>
          <div className={styles.Left}>
            <h2 className={styles.LeftHeader}>
              Prace ({responses.length}/{members.length})
            </h2>
            <div className={styles.LeftBox}>
              <div className={styles.LeftBoxHeader}>
                <h3>Oddano: </h3>
                <button onClick={() => setSubmittedVisible(!submittedVisible)}>
                  <img
                    src={submittedVisible ? dropUpIcon : dropDownIcon}
                    alt={submittedVisible ? 'Schowaj' : 'Pokaż'}
                  />
                </button>
              </div>
              {submittedVisible && (
                <div className={styles.LeftBoxContent}>
                  <div className={styles.LeftBoxContentChapter}>
                    <div className={styles.LeftBoxContentChapterHeder}>
                      <p>
                        Ocenione: ({markedResposnses.length} / {responses.length})
                      </p>
                      <button onClick={() => setMarkedVisible(!markedVisible)}>
                        <img
                          src={markedVisible ? dropUpIcon : dropDownIcon}
                          alt={markedVisible ? 'Schowaj' : 'Pokaż'}
                        />
                      </button>
                    </div>
                    {markedVisible && (
                      <div className={styles.LeftBoxContentChapterContent}>
                        {markedResposnses.map((markedResponse, index) => (
                          <div className={styles.LeftBoxContentChapterContentElement} key={`makred-response-${index}`}>
                            <button
                              className={styles.ButtonUser}
                              onClick={() => setTargetResponse(markedResponse)}
                            >{`${markedResponse.owner.first_name} ${markedResponse.owner.last_name} (${markedResponse.owner.username})`}</button>
                            <button className={styles.ButtonInspect} onClick={() => setTargetResponse(markedResponse)}>
                              <img src={inspectIcon} alt="Zobacz" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {markedResposnses.length !== responses.length && (
                    <div className={styles.LeftBoxContentChapter}>
                      <div className={styles.LeftBoxContentChapterHeder}>
                        <p>
                          Nie ocenione: ({notMarkedResposnses.length} / {responses.length})
                        </p>
                        <button onClick={() => setNotMarkedVisible(!notMarkedVisible)}>
                          <img
                            src={notMarkedVisible ? dropUpIcon : dropDownIcon}
                            alt={notMarkedVisible ? 'Schowaj' : 'Pokaż'}
                          />
                        </button>
                      </div>
                      {notMarkedVisible && (
                        <div className={styles.LeftBoxContentChapterContent}>
                          {notMarkedResposnses.map((markedResponse, index) => (
                            <div
                              className={styles.LeftBoxContentChapterContentElement}
                              key={`makred-response-${index}`}
                            >
                              <button
                                className={styles.ButtonUser}
                                onClick={() => setTargetResponse(markedResponse)}
                              >{`${markedResponse.owner.first_name} ${markedResponse.owner.last_name} (${markedResponse.owner.username})`}</button>
                              <button
                                className={styles.ButtonInspect}
                                onClick={() => setTargetResponse(markedResponse)}
                              >
                                <img src={inspectIcon} alt="Zobacz" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {notSubmitted.length !== 0 && (
              <div className={styles.LeftBox} style={{ marginTop: '1rem' }}>
                <div className={styles.LeftBoxHeader}>
                  <h3>Nie oddano: </h3>
                  <button onClick={() => setNotSubmittedVisible(!notSubmittedVisible)}>
                    <img
                      src={notSubmittedVisible ? dropUpIcon : dropDownIcon}
                      alt={notSubmittedVisible ? 'Schowaj' : 'Pokaż'}
                    />
                  </button>
                </div>
                {notSubmittedVisible && (
                  <div className={styles.LeftBoxContent}>
                    {notSubmitted.map((user, index) => (
                      <p
                        key={`not-submitted-${index}`}
                        style={{ paddingLeft: '2rem', fontSize: 14 }}
                      >{`${user.first_name} ${user.last_name} (${user.username})`}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={styles.Right}>
            <h1 className={styles.TaskTitle}>{task?.title}</h1>
            <textarea
              value={task?.description}
              disabled
              className={styles.TaskDescription}
              ref={textarea => {
                if (textarea) {
                  textarea.style.height = ''
                  textarea.style.height = `${textarea.scrollHeight}px`
                  textarea.style.maxHeight = '500px'
                }
              }}
            />
            {targetResponse && (
              <div className={styles.Task}>
                <h3 className={styles.TaskOwner}>
                  Zadanie od:{' '}
                  {`${targetResponse.owner.first_name} ${targetResponse.owner.last_name} (${targetResponse.owner.username})`}
                </h3>
                <div className={styles.TaskFiles}>
                  <div className={styles.TaskGrade}>
                    <h3>{targetResponse.mark ? 'Oceniono: ' : 'Ocena: '}</h3>
                    <input type="text" value={grade} onChange={handleChangeGrade} placeholder="Ocena" />
                  </div>
                  <div className={styles.TaskAttachments}>
                    <h3>Pliki:</h3>
                    <a
                      href={`${
                        (targetResponse.attachment as string).startsWith('http')
                          ? targetResponse.attachment
                          : `${import.meta.env.VITE_APP_API_URL}${targetResponse.attachment}`
                      }`}
                      target="_blank"
                    >
                      {(targetResponse.attachment as string).split('/').splice(-1)}
                    </a>
                  </div>
                  <div className={styles.SaveButtonWrapper}>
                    <button onClick={() => gradeTask()}>ZAPISZ</button>
                  </div>
                </div>
                <div className={styles.TaskComments}>
                  <div className={styles.Comments}>
                    {comments.map((comment, index) => (
                      <div
                        key={index}
                        className={styles.CommentWrapper}
                        style={comment.owner.id === user!.id ? { alignSelf: 'flex-end' } : {}}
                      >
                        {comment.owner.id === user!.id ? (
                          <>
                            <p
                              className={`${styles.Comment} ${styles.MyComment}`}
                              title={
                                comment.edited_at ? stringifyDate(comment.edited_at) : stringifyDate(comment.created_at)
                              }
                            >
                              {comment.comment}
                            </p>
                          </>
                        ) : (
                          <p className={`${styles.Comment}`} title={stringifyDate(comment.edited_at)}>
                            {comment.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={styles.Message}>
                    <span
                      className={styles.Textarea}
                      role="textbox"
                      contentEditable
                      onInput={e => setCommentMessage(e.currentTarget.textContent ?? '')}
                    ></span>
                    <button onClick={() => sendComment()} className={styles.Send}>
                      <img src={sendIcon} alt="Send" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  )
}
