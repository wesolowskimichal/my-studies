import { useEffect, useState } from 'react'
import styles from './Courses.module.scss'
import { useNavigate } from 'react-router-dom'
import { Repository, RepositoryEnrolment } from '../../components/interfaces'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import Course from '../../views/Course/Course'
import { context } from '../../services/UserContext/UserContext'

function MyCourses() {
  const [courses, setCourses] = useState<Repository[] | null>(null)
  const [visibleCourses, setVisibleCourses] = useState<Repository[] | null>(null)
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  const { user } = context()
  console.log(user)

  const navigate = useNavigate()

  useEffect(() => {
    if (ApiService.getInstance().isTokenExpired()) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const getAllCourses = async () => {
      const response = await ApiService.getInstance().getMyRepositories(user!.user_type)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching course: ' ${response.responseCode}`)
        return
      }
      setCourses(response.data)
      setLoaded(true)
    }

    getAllCourses()
  }, [])

  useEffect(() => {
    if (search.length === 0) {
      setVisibleCourses(courses)
    } else {
      const filteredCourses = courses?.filter(course => course.name.toLowerCase().includes(search.toLowerCase()))
      setVisibleCourses(filteredCourses ?? null)
    }
  }, [search, courses])

  return (
    <div className={styles.Wrapper} style={!loaded ? { height: '100vh' } : {}}>
      {loaded ? (
        <>
          <div className={styles.FindBox}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Szukaj kursu"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.Courses}>
            {courses?.length && courses.length > 0 ? (
              visibleCourses?.map((course, index) => (
                <div key={index}>
                  <Course repository={course} />
                </div>
              ))
            ) : (
              <div> Nie masz żadnych kursów</div>
            )}
          </div>
        </>
      ) : (
        <div className="loader" style={{ gridColumn: '2 / 3' }}></div>
      )}
    </div>
  )
}

export default MyCourses
