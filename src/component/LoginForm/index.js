import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showError: false, errorMessage: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })

    history.replace('/')
  }

  onLoginFailure = errorMessage => {
    this.setState({showError: true, errorMessage})
  }

  onLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, option)
    const data = await response.json()

    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const {errorMessage, showError} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <form className="form-container" onSubmit={this.onLogin}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-form-logo"
          />
          <div className="input-container">
            <div className="input-item">
              <label htmlFor="username">USERNAME</label>
              <input
                placeholder="Username"
                id="username"
                type="text"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="input-item">
              <label htmlFor="password">PASSWORD</label>
              <input
                placeholder="Password"
                id="password"
                type="password"
                onChange={this.onChangePassword}
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showError && <p className="error-message">{`*${errorMessage}`}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
