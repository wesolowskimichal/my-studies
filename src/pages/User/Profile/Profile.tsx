import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../../services/API/ApiService'
import styles from './Profile.module.scss'
import { ApiResponse } from '../../../services/API/ApiResponse'
import Page from '../../page/Page'
import CourseList from '../../../views/CourseList/CourseList'
import { context } from '../../../services/UserContext/UserContext'
import { User } from '../../../components/interfaces'

function Profile() {
  const { id } = useParams<{ id: string }>()
  const { user } = context()
  const [isOwner, setIsOwner] = useState(user && id === user.id)
  const [oUser, setOUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await ApiService.getInstance().getUserById(id!)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching profile: ${response.responseCode}`)
        return
      }
      setOUser(response.data)
    }

    if (!id) {
      navigate('/')
      return
    }

    setIsOwner(user && id === user.id)

    isOwner ? setOUser(user) : fetchUser()
  }, [user])

  return (
    <Page name="Profile">
      <div className={styles.Wrapper}>
        {oUser !== null ? (
          <>
            <aside>
              <h2>{oUser?.user_type}</h2>
              <img
                src={`${
                  oUser && oUser.picture.startsWith('http')
                    ? oUser.picture
                    : `${import.meta.env.VITE_APP_API_URL}${oUser?.picture}`
                }`}
                alt="user-profile-picture"
              />
              <div className={styles.HeaderInfoWrapper}>
                <div className={`${styles.HeaderInfo} ${isOwner && styles.HeaderInfoOwner}`}>
                  <p>Imię: {oUser?.first_name}</p>
                  <p>Nazwisko: {oUser?.last_name}</p>
                  <p>Email: {oUser?.email}</p>
                </div>
                {isOwner && (
                  <div className={styles.HeaderOptions}>
                    <button>Zmień hasło</button>
                  </div>
                )}
              </div>
            </aside>
            <div className={styles.Content}>
              {isOwner ? (
                <>
                  <header>
                    <h1>Repozytoria</h1>
                  </header>
                  <CourseList />
                </>
              ) : (
                <div>
                  <p>dupa</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <h1>user null</h1>
        )}
      </div>
    </Page>
  )
}

export default Profile
