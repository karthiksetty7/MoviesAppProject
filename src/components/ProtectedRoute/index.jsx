// Write your code here
import Cookies from 'js-cookie'
import {Navigate} from 'react-router'

const ProtectedRoute = ({children}) => {
  const jwtToken = Cookies.get('jwt_token')

  if (!jwtToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
