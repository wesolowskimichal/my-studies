import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../../services/API/ApiService'
import styles from './Profile.module.scss'
import { ApiResponse } from '../../../services/API/ApiResponse'
import Page from '../../page/Page'
import CourseList from '../../../views/CourseList/CourseList'
import { context } from '../../../services/UserContext/UserContext'
import { User } from '../../../components/interfaces'
import { usePopup } from '../../../hooks/usePopup'
import { ImportImage } from '../../../components/ImportImage/ImportImage'

function Profile() {
  const { id } = useParams<{ id: string }>()
  const { user, setUser } = context()
  const [isOwner, setIsOwner] = useState(user && id === user.id)
  const [oUser, setOUser] = useState<User | null>(null)
  const [isImportImageVisible, setIsImportImageVisible] = useState(false)
  const navigate = useNavigate()
  const { setTime, setTrigger, handleError, popup, setPopupType } = usePopup()

  const onSaveApiCall = async (pictureUrl: string) => {
    const fetchRes = await fetch(pictureUrl)
    const blob = await fetchRes.blob()
    const pictureFile = new File([blob], 'profile-picture.png', { type: 'image/png' })
    const response = await ApiService.getInstance().changeUser({ ...user!, newPicture: pictureFile })
    if (response.responseCode === ApiResponse.POSITIVE) {
      setUser(prevUser => {
        if (!prevUser) return null // If there is no previous user, return null to avoid setting an undefined user.

        // Spread existing user data and then spread response.data to overwrite any updated fields
        return {
          ...prevUser,
          ...response.data
        }
      })
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await ApiService.getInstance().getUserById(id!)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        setTime(8)
        handleError(response.responseCode)
        setPopupType('Warning')
        setTrigger(true)
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
    <>
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
                {isOwner && (
                  <button className={styles.ChangePictureButton} onClick={() => setIsImportImageVisible(true)}>
                    Zmień Zdjęcie
                  </button>
                )}
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
                    <p>NOT IMPLEMENTED</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <h1>user null</h1>
          )}
        </div>
      </Page>
      {popup}
      {isImportImageVisible && (
        <ImportImage onClose={() => setIsImportImageVisible(false)} onSaveApiCall={onSaveApiCall} />
      )}
    </>
  )
}

export default Profile
