import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-form-logo"
        />
      </Link>
      <ul className="nav-link-container">
        <li className="nav-link">
          <Link to="/" className="nav-item">
            Home
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/" className="nav-item">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" className="find-jobs-button" onClick={onLogout()}>
        Find Jobs
      </button>
    </div>
  )
}

export default withRouter(Header)
