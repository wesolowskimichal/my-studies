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

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const repositories = await apiResponse()
        console.log(repositories)
        setCourses(repositories)
      } catch (error) {
        console.error('Error fetching user: ', error)
      }
    }

    getAllCourses()
    console.log(courses)
  }, [])

  return (
    <>
      <div className={styles.Wrapper}>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index}>
              <Course key={index} repository={course} />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  )
}

export default AllCourses
