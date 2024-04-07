import {Link, withRouter} from 'react-router-dom'

import {IoIosHome, IoIosLogOut} from 'react-icons/io'
import {FaSuitcase} from 'react-icons/fa'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
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
      <ul className="nav-link-container desktop-nav-item">
        <li className="nav-link">
          <Link to="/" className="nav-item">
            Home
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/jobs" className="nav-item">
            Jobs
          </Link>
        </li>
      </ul>
      <button
        type="button"
        className="find-jobs-button desktop-logout-button"
        onClick={onLogout}
      >
        Log Out
      </button>
      <ul className="nav-link-container mobile-nav-item">
        <li className="nav-link">
          <Link to="/" className="nav-item">
            <IoIosHome size="25" />
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/jobs" className="nav-item">
            <FaSuitcase size="25" />
          </Link>
        </li>
        <button
          type="button"
          className="find-jobs-sm-button"
          onClick={onLogout}
        >
          <span>Logout</span>
          <IoIosLogOut size="25" />
        </button>
      </ul>
    </div>
  )
}

export default withRouter(Header)
