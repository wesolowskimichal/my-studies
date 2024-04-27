import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './CourseDetails.module.scss'
import CoursePosts from '../../views/CoursePosts/CoursePosts'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { Repository, RepositoryPost } from '../../components/interfaces'
import Page from '../page/Page'

function CourseDetails() {
  enum ContentType {
    Logged = 'logged',
    Authorized = 'authorized',
    Anonymous = 'anonymous',
    Loading = 'loader'
  }

  const [repository, setRepository] = useState<Repository>()
  const [repositoryPosts, setRepositoryPosts] = useState<RepositoryPost[]>([])
  const [contentType, setContentType] = useState<ContentType>(ContentType.Loading)

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const getPosts = async () => {
      const response = await ApiService.getInstance().getRepositoryPosts(id!)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching course: ' ${response.responseCode}`)
        if (response.responseCode === ApiResponse.FORBIDDEN) {
          setContentType(ContentType.Logged)
        } else if (response.responseCode === ApiResponse.UNAUTHORIZED) {
          setContentType(ContentType.Anonymous)
        }
        return
      }
      const posts = response.data!
      posts.sort((a: RepositoryPost, b: RepositoryPost) => {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)
        if (a.pinned && !b.pinned) {
          return -1
        } else if (!a.pinned && b.pinned) {
          return 1
        } else {
          return dateA - dateB
        }
      })
      setRepositoryPosts(posts)
      setContentType(ContentType.Authorized)
    }

    const getCourse = async () => {
      const response = await ApiService.getInstance().getRepository(id!)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching course: ${response.responseCode}`)
        return
      }
      const repository = response.data!
      setRepository(repository)
      await getPosts()
    }
    getCourse()
  }, [])

  const renderContent = () => {
    switch (contentType) {
      case ContentType.Anonymous:
        return (
          <div className={styles.NotLoggedIn}>
            <span>
              <b>Musisz się zalogować aby zobaczyć szczegóły kursu </b>
            </span>
            <div>
              <Link to="/login">Zaloguj się</Link>
            </div>
          </div>
        )
      case ContentType.Authorized:
        return repositoryPosts && <CoursePosts repositoryId={id!} repositoryPosts={repositoryPosts} />
      case ContentType.Logged:
        return (
          <div className={styles.NotAuthorized}>
            <span>
              <b>Nie został Ci przyznany dostęp do kursy</b>
            </span>
            <div>
              <a onClick={() => ApiService.getInstance().sendEnrollmentRequest(id!)}>Wyślij prośbę o dołączenie</a>
            </div>
          </div>
        )
      case ContentType.Loading:
        return <div className="loader"></div>
    }
  }

  return (
    <Page name="Course Details">
      <div className={styles.Wrapper}>
        <div className={styles.Header}>
          <img src={`${import.meta.env.VITE_APP_API_URL}${repository?.picture}`} alt="Course Image" />
          <div className={styles.Info}>
            <h1>{repository?.name}</h1>
            <h3>
              Prowadzący:{' '}
              {repository?.owners.map((user, index) => (
                <span key={index}>
                  {user.first_name} {user.last_name}
                  {index < repository.owners.length - 1 ? ', ' : ''}
                </span>
              ))}
            </h3>
          </div>
        </div>
        <div className={styles.Content}>{renderContent()}</div>
      </div>
    </Page>
  )
}

export default CourseDetails
