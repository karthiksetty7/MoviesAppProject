import {useState} from 'react'
import {Navigate, useNavigate} from 'react-router'

import {Eye, EyeOff} from 'lucide-react'

import Cookies from 'js-cookie'

import endpoints from '../endpoints'

import './index.css'

const Login = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility

  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken) {
    return <Navigate to="/" replace />
  }

  const onSubmitSuccess = jwtTokenValue => {
    Cookies.set('jwt_token', jwtTokenValue, {
      expires: 30,
    })

    localStorage.setItem('username', username)
    localStorage.setItem('password', password)

    navigate('/', {replace: true})
  }

  const onSubmitFailure = errorMessage => {
    setShowError(true)
    setErrorMsg(errorMessage)
  }

  const submitLoginForm = async event => {
    event.preventDefault()

    const userDetails = {
      username,
      password,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(endpoints.loginApi, options)

    const data = await response.json()

    if (response.ok) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  return (
    <div className="login-route-container">
      <div className="login-overlay">
        <form className="login-form-container" onSubmit={submitLoginForm}>
          <img
            src="https://res.cloudinary.com/dlvle38po/image/upload/v1780663791/Group_7399_bo5qgq.png"
            alt="login website logo"
            className="login-logo"
          />

          <h1 className="login-heading">Login</h1>

          <div className="input-container">
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              className="input-field"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </div>

          <div className="input-container">
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            {/* Added a wrapper container to handle absolute placement of the toggle button */}
            <div className="password-field-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input-field password-input"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(prevState => !prevState)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {showError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
