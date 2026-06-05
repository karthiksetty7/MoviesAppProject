import {useEffect, useState} from 'react'
import {useLocation} from 'react-router'
import Cookies from 'js-cookie'

import Header from '../Header'
import Loader from '../Loader'
import FailureView from '../FailureView'
import MovieCard from '../MovieCard'

import endpoints from '../endpoints'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const ITEMS_PER_PAGE = 12

const Search = () => {
  const [moviesList, setMoviesList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [currentPage, setCurrentPage] = useState(1)

  const location = useLocation()

  // Extracts the actual keyword from the URL query string
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('value') || ''

  const getSearchResults = async () => {
    if (searchQuery.trim() === '') {
      setMoviesList([])
      setApiStatus(apiStatusConstants.initial)
      return
    }

    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(
        `${endpoints.searchMoviesApi}?search=${searchQuery}`,
        options,
      )

      if (response.ok) {
        const data = await response.json()
        const updatedData = data.results.map(eachMovie => ({
          id: eachMovie.id,
          title: eachMovie.title,
          posterPath: eachMovie.poster_path,
        }))

        setMoviesList(updatedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  // Triggers API fetch only when the URL searchQuery string shifts
  useEffect(() => {
    setCurrentPage(1)
    getSearchResults()
  }, [searchQuery])

  const totalPages = Math.ceil(moviesList.length / ITEMS_PER_PAGE) || 1
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentPageMoviesList = moviesList.slice(
    indexOfFirstItem,
    indexOfLastItem,
  )

  const renderPaginationControl = () => (
    <div className="pagination-container">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      <p className="page-number-text">
        {currentPage} of {totalPages}
      </p>
      <button
        type="button"
        className="pagination-btn"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  )

  const renderSearchResults = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader />
          </div>
        )

      case apiStatusConstants.failure:
        return <FailureView onRetry={getSearchResults} />

      case apiStatusConstants.success:
        if (moviesList.length === 0) {
          return (
            <div className="no-results-container">
              <img
                src="https://res.cloudinary.com/dlvle38po/image/upload/v1780662158/Search_No_Results_1_zqkz9x.png"
                alt="no movies"
                className="no-results-image"
              />
              <p className="no-results-text">
                Your search for {searchQuery} did not find any matches.
              </p>
            </div>
          )
        }

        return (
          <>
            <ul className="search-movies-list">
              {currentPageMoviesList.map(eachMovie => (
                <MovieCard key={eachMovie.id} movieDetails={eachMovie} />
              ))}
            </ul>
            {renderPaginationControl()}
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="search-container">
      <Header />
      <div className="search-content">{renderSearchResults()}</div>
    </div>
  )
}

export default Search
