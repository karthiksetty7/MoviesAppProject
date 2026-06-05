import {useState, useEffect} from 'react'
import {Link, NavLink, useNavigate, useLocation} from 'react-router'
import {HiOutlineSearch} from 'react-icons/hi'
import {MdMenu, MdClose} from 'react-icons/md'

import './index.css'

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)

  // Local state captures typing text cleanly without disturbing the router
  const [localSearchInput, setLocalSearchInput] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  // Sync the input value if the user changes pages or loads a search URL directly
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const urlQuery = searchParams.get('value') || ''

    if (location.pathname === '/search') {
      setIsSearchActive(true)
      setLocalSearchInput(urlQuery)
    } else {
      setLocalSearchInput('')
    }
  }, [location])

  const onClickSearchIcon = () => {
    if (isSearchActive) {
      setLocalSearchInput('')
      setIsSearchActive(false)
      navigate('/')
    } else {
      setIsSearchActive(true)
    }
  }

  const onChangeInput = event => {
    setLocalSearchInput(event.target.value)

    // Optional shortcut: if they clear out everything via backspace, return home
    if (event.target.value.trim() === '') {
      navigate('/')
    }
  }

  // Action runs ONLY when clicking the search button or hitting Enter
  const triggerSearchAction = () => {
    if (localSearchInput.trim() !== '') {
      navigate(`/search?value=${encodeURIComponent(localSearchInput)}`)
    }
  }

  const onKeyDownInput = event => {
    if (event.key === 'Enter') {
      triggerSearchAction()
    }
  }

  const toggleMenu = () => {
    setShowMenu(prevState => !prevState)
  }

  const activeClass = ({isActive}) =>
    isActive ? 'nav-link active-link' : 'nav-link'

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-left-section">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dlvle38po/image/upload/v1780663791/Group_7399_bo5qgq.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>

          <nav className="nav-menu desktop-nav">
            <NavLink to="/" end className={activeClass}>
              Home
            </NavLink>
            <NavLink to="/popular" className={activeClass}>
              Popular
            </NavLink>
          </nav>
        </div>

        <div className="header-right-section">
          {isSearchActive ? (
            <div className="header-search-input-container">
              <input
                type="search"
                className="header-search-input"
                placeholder="Search"
                value={localSearchInput}
                onChange={onChangeInput}
                onKeyDown={onKeyDownInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="header-search-icon-btn"
                onClick={triggerSearchAction}
              >
                <HiOutlineSearch className="search-icon-active" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={onClickSearchIcon}
            >
              <HiOutlineSearch className="search-icon" />
            </button>
          )}

          <Link to="/account" className="profile-link-wrapper">
            <img
              src="https://res.cloudinary.com/dlvle38po/image/upload/v1780655168/Mask_Group_1_nlkpnf.png"
              alt="profile"
              className="profile-image"
            />
          </Link>

          <button
            type="button"
            className="hamburger-menu-btn"
            onClick={toggleMenu}
            aria-label="open navigation menu"
          >
            <MdMenu className="menu-icon" />
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="mobile-nav-dropdown-overlay">
          <nav className="mobile-nav-links-list">
            <NavLink to="/" end className={activeClass} onClick={toggleMenu}>
              Home
            </NavLink>
            <NavLink to="/popular" className={activeClass} onClick={toggleMenu}>
              Popular
            </NavLink>
            <NavLink to="/account" className={activeClass} onClick={toggleMenu}>
              Account
            </NavLink>
          </nav>
          <button
            type="button"
            className="close-menu-btn"
            onClick={toggleMenu}
            aria-label="close navigation menu"
          >
            <MdClose className="close-icon" />
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
