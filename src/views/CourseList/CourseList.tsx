import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CourseList.module.scss'
import Course from './Course'
import { Repository, RepositoryEnrolment } from '../../components/interfaces'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'

function CourseList() {
  const [courses, setCourses] = useState<RepositoryEnrolment[] | null>([])
  const [visibleCourses, setVisibleCourses] = useState<RepositoryEnrolment[] | null>([])
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (ApiService.getInstance().isTokenExpired()) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const getAllCourses = async () => {
      const response = await ApiService.getInstance().getMyRepositories()
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching course: ' ${response.responseCode}`)
        return
      }
      const repositories = response.data!
      setCourses(repositories)
      setLoaded(true)
    }

    getAllCourses()
  }, [])

  useEffect(() => {
    if (search.length === 0) {
      setVisibleCourses(courses)
    } else {
      const filteredCourses = courses?.filter(course =>
        course.repository.name.toLowerCase().includes(search.toLowerCase())
      )
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
          {courses && courses.length > 0 ? (
            visibleCourses?.map((course, index) => (
              <div key={index} className={styles.CourseWrapper}>
                <Course repositoryEnrolment={course} />
              </div>
            ))
          ) : (
            <div> Nie masz żadnych kursów</div>
          )}
        </>
      ) : (
        <div className="loader" style={{ gridColumn: '2 / 3' }}></div>
      )}
    </div>
  )
}

export default CourseList
