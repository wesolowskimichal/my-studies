import { useEffect, useState } from 'react'
import { Repository } from '../interfaces'

import Course from '../Course/Course'
import styles from './Courses.module.scss'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'

function MyCourses() {
  const [courses, setCourses] = useState<Repository[]>([])
  const [visibleCourses, setVisibleCourses] = useState<Repository[]>([])
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

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
      const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(search.toLowerCase()))
      setVisibleCourses(filteredCourses)
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
            {courses.length > 0 ? (
              visibleCourses.map((course, index) => (
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
