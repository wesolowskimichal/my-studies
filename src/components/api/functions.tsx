import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const getUserFromApi = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('Not logged in')
    }
    const token = jwtDecode(accessToken)
    const response = await axios.get(`/api/user/${token.user_id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
