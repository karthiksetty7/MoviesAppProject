import Cookies from 'js-cookie'
import {useNavigate} from 'react-router'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import Header from '../Header'
import './index.css'

const Account = () => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  return (
    <div className="account-bg-container">
      <Header />

      <div className="account-responsive-body">
        <div className="account-card-content">
          <h1 className="account-main-heading">Account</h1>
          <hr className="account-card-divider" />

          <div className="account-info-row-section">
            <p className="account-row-label">Member ship</p>
            <div className="account-row-details-block">
              <p className="account-user-email">rahul@gmail.com</p>
              <p className="account-user-password">
                Password :{' '}
                <span className="password-masked-stars">************</span>
              </p>
            </div>
          </div>
          <hr className="account-card-divider" />

          <div className="account-info-row-section">
            <p className="account-row-label">Plan details</p>
            <div className="account-plan-details-inline">
              <p className="account-plan-premium-text">Premium</p>
              <span className="account-plan-ultra-hd-badge">Ultra HD</span>
            </div>
          </div>
          <hr className="account-card-divider" />

          <div className="account-logout-action-container">
            <button
              type="button"
              className="account-logout-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <footer className="account-footer-section">
        <div className="account-footer-social-icons">
          <button
            type="button"
            className="footer-social-icon-btn"
            aria-label="Google"
          >
            <FaGoogle />
          </button>
          <button
            type="button"
            className="footer-social-icon-btn"
            aria-label="Twitter"
          >
            <FaTwitter />
          </button>
          <button
            type="button"
            className="footer-social-icon-btn"
            aria-label="Instagram"
          >
            <FaInstagram />
          </button>
          <button
            type="button"
            className="footer-social-icon-btn"
            aria-label="Youtube"
          >
            <FaYoutube />
          </button>
        </div>
        <p className="account-footer-contact-text">Contact Us</p>
      </footer>
    </div>
  )
}

export default Account
