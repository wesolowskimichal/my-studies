import axios from 'axios'
import { useEffect, useState } from 'react'
import { AccountType, Repository, User } from '../interfaces'

import Course from '../Course/Course'
import styles from './AllCourses.module.scss'

const apiResponse = async () => {
  try {
    const response = await axios.get('/api/repositories/list/')
    if (response.status !== 200) {
      throw new Error('Bad response status')
    }
    return response.data
  } catch (error) {
    throw error
  }
}

function AllCourses() {
  const [courses, setCourses] = useState<Repository[]>([])
  const [visibleCourses, setVisibleCourses] = useState<Repository[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const repositories = await apiResponse()
        console.log(repositories)
        setCourses(repositories)
        setVisibleCourses(courses)
      } catch (error) {
        console.error('Error fetching user: ', error)
      }
    }

    getAllCourses()
    console.log(courses)
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
    <div className={styles.Wrapper}>
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
              <Course key={index} repository={course} />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}

export default AllCourses
