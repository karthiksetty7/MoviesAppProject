import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <footer className="footer-container">
    <div className="footer-icons-container">
      <button type="button" className="social-button" aria-label="google">
        <FaGoogle className="social-icon" />
      </button>

      <button type="button" className="social-button" aria-label="twitter">
        <FaTwitter className="social-icon" />
      </button>

      <button type="button" className="social-button" aria-label="instagram">
        <FaInstagram className="social-icon" />
      </button>

      <button type="button" className="social-button" aria-label="youtube">
        <FaYoutube className="social-icon" />
      </button>
    </div>

    <p className="footer-contact-text">Contact Us</p>
  </footer>
)

export default Footer
