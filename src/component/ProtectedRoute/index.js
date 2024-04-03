import {Redirect, Route} from 'react-router-dom'

import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" {...props} />
  }
  return <Route {...props} />
}

export default ProtectedRoute
