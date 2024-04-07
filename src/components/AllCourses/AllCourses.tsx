import axios from 'axios'
import { useEffect, useState } from 'react'
import { Repository } from '../interfaces'

import Course from '../Course/Course'
import styles from './AllCourses.module.scss'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'

function AllCourses() {
  const [courses, setCourses] = useState<Repository[]>([])
  const [visibleCourses, setVisibleCourses] = useState<Repository[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getAllCourses = async () => {
      const response = await ApiService.getInstance().getRepositories()
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching course: ' ${response.responseCode}`)
        return
      }
      const repositories = response.data!
      setCourses(repositories)
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
