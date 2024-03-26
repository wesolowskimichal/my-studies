import { jwtDecode } from 'jwt-decode'

function JWTester() {
  const token = localStorage.getItem('accessToken')
  const refresh = localStorage.getItem('refreshToken')
  console.log(jwtDecode(token))

  return (
    <>
      <p>{token}</p>
      <p>{refresh}</p>
    </>
  )
}

export default JWTester
