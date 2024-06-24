import { useEffect, useState } from 'react'
import { Repository, RepositoryEnrolment, User } from '../../components/interfaces'
import styles from './EditCourseView.module.scss'
import { UserView } from '../UserView/UserView'
import removeIcon from '../../assets/removeIcon.svg'
import openIcon from '../../assets/opneIcon.svg'
import addIcon from '../../assets/addIcon.svg'
import saveIcon from '../../assets/saveIcon.svg'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { useNavigate } from 'react-router-dom'
import { usePopup } from '../../hooks/usePopup'
import { ImportImage } from '../../components/ImportImage/ImportImage'

type EditCourseViewProps = {
  repository: Repository
  onSubmit: (repository: Repository) => Promise<ApiResponse>
  creating?: boolean
}

export const EditCourseView = ({ repository, onSubmit, creating = false }: EditCourseViewProps) => {
  const navigate = useNavigate()
  const { setPopupType, setTime, setMessage, setTrigger, handleError, popup } = usePopup()

  const [name, setName] = useState<string>('')
  const [picture, setPicture] = useState<string>('')
  const [newPicture, setNewPicure] = useState<File | null>(null)
  const [owners, setOwners] = useState<User[]>([])
  const [allTeachers, setAllTeachers] = useState<User[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [searchTeachers, setSearchTeachers] = useState('')
  const [visileTeachers, setVisibleTeachers] = useState<User[]>([])
  const [originalEnrollments, setOriginalEnrollments] = useState<RepositoryEnrolment[]>([])
  const [allEnrollments, setAllEnrollments] = useState<RepositoryEnrolment[]>([])
  const [participants, setParticipants] = useState<RepositoryEnrolment[]>([])
  const [enrollments, setEnrollments] = useState<RepositoryEnrolment[]>([])
  const [searchParticipants, setSearchParticipants] = useState('')
  const [visileParticipants, setVisibleParticipants] = useState<RepositoryEnrolment[]>([])
  const [searchEnrollments, setSearchEnrollments] = useState('')
  const [visileEnrollments, setVisibleEnrollments] = useState<RepositoryEnrolment[]>([])
  const [isImportImageVisible, setIsImportImageVisible] = useState(false)

  const getPictureSrc = (pictureSrc: string): string => {
    return pictureSrc.startsWith('http') ? pictureSrc : `${import.meta.env.VITE_APP_API_URL}${pictureSrc}`
  }

  const localApiCall = async (pictureUrl: string) => {
    const fetchRes = await fetch(pictureUrl)
    const blob = await fetchRes.blob()
    const pictureFile = new File([blob], 'profile-picture.png', { type: 'image/png' })
    setNewPicure(pictureFile)
  }

  useEffect(() => {
    if (searchEnrollments.length === 0) {
      setVisibleEnrollments(enrollments)
    } else {
      const filteredEnrollments = enrollments.filter(enrollment => {
        const name = enrollment.user.first_name + ' ' + enrollment.user.last_name
        return name.toLowerCase().includes(searchEnrollments.toLowerCase())
      })
      setVisibleEnrollments(filteredEnrollments)
    }
  }, [searchEnrollments, enrollments])

  useEffect(() => {
    if (searchParticipants.length === 0) {
      setVisibleParticipants(participants)
    } else {
      const filteredParticipants = participants.filter(participant => {
        const name = participant.user.first_name + ' ' + participant.user.last_name
        return name.toLowerCase().includes(searchParticipants.toLowerCase())
      })
      setVisibleParticipants(filteredParticipants)
    }
  }, [searchParticipants, participants])

  useEffect(() => {
    if (searchTeachers.length === 0) {
      setVisibleTeachers(teachers)
    } else {
      const filteredTeachers = teachers.filter(teacher => {
        const name = teacher.first_name + ' ' + teacher.last_name
        return name.toLowerCase().includes(searchTeachers.toLowerCase())
      })
      setVisibleTeachers(filteredTeachers)
    }
  }, [searchTeachers, teachers])

  useEffect(() => {
    const nonOwnerTeachers = allTeachers.filter(teacher => !owners.some(owner => owner.id === teacher.id))

    setTeachers(nonOwnerTeachers)
  }, [owners, allTeachers])

  useEffect(() => {
    setParticipants(allEnrollments.filter(enrollment => enrollment.status))
    setEnrollments(allEnrollments.filter(enrollment => !enrollment.status))
  }, [allEnrollments])

  useEffect(() => {
    const fetchEnrollments = async () => {
      const response = await ApiService.getInstance().getEnrollments(repository.id)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setOriginalEnrollments(response.data!)
        setAllEnrollments(response.data!)
      } else {
        setPopupType('Info')
        handleError(response.responseCode)
        setPopupType('Warning')
        setTime(4)
        setTrigger(true)
      }
    }

    setName(repository.name)
    setPicture(repository.picture)
    setOwners(repository.owners)
    if (!creating) fetchEnrollments()
  }, [repository])

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await ApiService.getInstance().getTeachers()
      if (response.responseCode === ApiResponse.POSITIVE) {
        setAllTeachers(response.data!)
      } else {
        setPopupType('Info')
        handleError(response.responseCode)
        setPopupType('Warning')
        setTime(4)
        setTrigger(true)
      }
    }

    fetchTeachers()
  }, [])

  const handleRemoveOwner = (owner: User) => {
    const newOwners = owners.filter(it => it != owner)
    setOwners(newOwners)
  }

  const changeEnrollment = async (userId: User['id']) => {
    await ApiService.getInstance().changeEnrollment(repository.id, userId)
  }

  const handleRemoveParticipant = (enrollment: RepositoryEnrolment) => {
    const newAllEnrollments = allEnrollments.map(en => {
      if (en.id === enrollment.id) {
        return { ...en, status: false }
      }
      return en
    })
    setAllEnrollments(newAllEnrollments)
  }

  const handleAddParticipant = (enrollment: RepositoryEnrolment) => {
    const newAllEnrollments = allEnrollments.map(en => {
      if (en.id === enrollment.id) {
        return { ...en, status: true }
      }
      return en
    })
    setAllEnrollments(newAllEnrollments)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    allEnrollments.forEach((enrollment, index) => {
      if (enrollment.status != originalEnrollments[index].status) {
        changeEnrollment(enrollment.user.id)
      }
    })
    if (owners.length === 0) {
      setPopupType('Warning')
      setMessage('Nie można nie mieć właścicieli')
      setTime(4)
      setTrigger(true)
      return
    }
    const response = await onSubmit({
      ...repository,
      name: name,
      newPicture: newPicture,
      owners: owners
    })

    if (response === ApiResponse.POSITIVE) {
      setPopupType('Info')
      setMessage('Pomyślnie zapisano zmiany')
      setTime(4)
      setTrigger(true)
    } else {
      setPopupType('Warning')
      handleError(response)
      setTime(4)
      setTrigger(true)
    }
  }

  return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.GeneralWrapper}>
          <h1>Ogólne</h1>
          <div className={styles.FormWrapper}>
            <div className={styles.NameDiv}>
              <label>Nazwa</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className={styles.ImgDiv}>
              <span>Zdjęcie</span>
              {newPicture ? (
                <img src={URL.createObjectURL(newPicture)} alt="Chosen picture" />
              ) : (
                <img src={getPictureSrc(picture)} alt="Repository picture" />
              )}
              {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
              <button onClick={() => setIsImportImageVisible(true)} className={styles.ImportImageButton}>
                Import Image
              </button>
            </div>
            <button className={styles.SaveButton} onClick={handleSubmit}>
              <img src={saveIcon} alt="Save" />
            </button>
          </div>
        </div>
        <div className={styles.OwnersWrapper}>
          <h1>Właściciele</h1>
          <div className={styles.Owners}>
            <div className={styles.UserInfoRow}>
              <span>Zdjęcie</span>
              <span>Imię i Nazwisko</span>
              <span>Email</span>
              <span>Typ Użytkownika</span>
            </div>
            {owners.map((owner, index) => (
              <div key={index} className={styles.UserRow}>
                <UserView user={owner} />
                <button
                  onClick={() => handleRemoveOwner(owner)}
                  title="Usuń z właścicieli"
                  className={styles.RemoveButton}
                >
                  <img src={removeIcon} alt="Remove" />
                </button>
                <button
                  onClick={() => navigate(`/user/${owner.id}`)}
                  title="Zobacz profil"
                  className={styles.InspectButton}
                >
                  <img src={openIcon} alt="Go to profile" />
                </button>
              </div>
            ))}
          </div>
          <h1>Dodaj Właściciela</h1>
          {teachers.length > 3 && (
            <div className={styles.SearchBarWrapper}>
              <input
                type="text"
                placeholder="Szukaj Nauczyciela"
                value={searchTeachers}
                onChange={e => setSearchTeachers(e.target.value)}
                className={styles.SearchBar}
              />
            </div>
          )}
          <div className={styles.TeachersWrapper}>
            {visileTeachers.length === 0 ? (
              <h3>Brak wyników wyszukiwania</h3>
            ) : (
              visileTeachers.map((teacher, index) => (
                <div key={index} className={styles.UserRow}>
                  <UserView user={teacher} />
                  <button
                    onClick={() => {
                      setOwners(prevOwners => [...prevOwners, teacher])
                    }}
                    title="Dodaj jako właściciel"
                    className={styles.AddButton}
                  >
                    <img src={addIcon} alt="Add" />
                  </button>
                  <button
                    onClick={() => navigate(`/user/${teacher.id}`)}
                    title="Zobacz profil"
                    className={styles.InspectButton}
                  >
                    <img src={openIcon} alt="Go to profile" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className={styles.EnrollmentsWrapper}>
          <div className={styles.ParticipantsWrapper}>
            <h1>Uczestnicy</h1>
            {participants.length > 3 && (
              <div className={styles.SearchBarWrapper}>
                <input
                  type="text"
                  placeholder="Szukaj Uczestnika"
                  value={searchParticipants}
                  onChange={e => setSearchParticipants(e.target.value)}
                  className={styles.SearchBar}
                />
              </div>
            )}
            {participants.length === 0 ? (
              <h3>Brak Uczestników</h3>
            ) : visileParticipants.length === 0 ? (
              <h3>Brak wyników wyszukiwania</h3>
            ) : (
              visileParticipants.map((enrollment, index) => (
                <div key={index} className={styles.UserRow}>
                  <UserView user={enrollment.user} />
                  <button
                    onClick={() => handleRemoveParticipant(enrollment)}
                    title="Usuń uczestnika"
                    className={styles.RemoveButton}
                  >
                    <img src={removeIcon} alt="Remove" />
                  </button>
                  <button
                    onClick={() => navigate(`/user/${enrollment.user.id}`)}
                    title="Zobacz profil"
                    className={styles.InspectButton}
                  >
                    <img src={openIcon} alt="Go to profile" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className={styles.EnrollmentAsksWrapper}>
            <h1>Prośby</h1>
            {enrollments.length > 3 && (
              <div className={styles.SearchBarWrapper}>
                <input
                  type="text"
                  placeholder="Szukaj Próśb"
                  value={searchEnrollments}
                  onChange={e => setSearchEnrollments(e.target.value)}
                  className={styles.SearchBar}
                />
              </div>
            )}
            {enrollments.length === 0 ? (
              <h3>Brak próśb o dołącznie</h3>
            ) : visileEnrollments.length === 0 ? (
              <h3>Brak wyników wyszukiwania</h3>
            ) : (
              visileEnrollments.map((enrollment, index) => (
                <div key={index} className={styles.UserRow}>
                  <UserView user={enrollment.user} />
                  <button
                    onClick={() => handleAddParticipant(enrollment)}
                    title="Dodaj uczestnika"
                    className={styles.AddButton}
                  >
                    <img src={addIcon} alt="Add" />
                  </button>
                  <button
                    onClick={() => navigate(`/user/${enrollment.user.id}`)}
                    title="Zobacz profil"
                    className={styles.InspectButton}
                  >
                    <img src={openIcon} alt="Go to profile" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {popup}
      {isImportImageVisible && (
        <ImportImage onClose={() => setIsImportImageVisible(false)} onSaveApiCall={localApiCall} />
      )}
    </>
  )
}
