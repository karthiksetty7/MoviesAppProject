import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'
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

const Popular = () => {
  const [moviesList, setMoviesList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [currentPage, setCurrentPage] = useState(1)

  const getPopularMovies = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(endpoints.popularMoviesApi, options)

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

  useEffect(() => {
    getPopularMovies()
  }, [])

  const totalPages = Math.ceil(moviesList.length / ITEMS_PER_PAGE) || 1
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentPageMoviesList = moviesList.slice(
    indexOfFirstItem,
    indexOfLastItem,
  )

  const onClickPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const onClickNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const renderPaginationControl = () => (
    <div className="pagination-container">
      <button
        type="button"
        className="pagination-btn"
        onClick={onClickPrevPage}
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
        onClick={onClickNextPage}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  )

  const renderPopularMovies = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader />
          </div>
        )

      case apiStatusConstants.success:
        return (
          <>
            <ul className="popular-movies-list">
              {currentPageMoviesList.map(eachMovie => (
                <MovieCard key={eachMovie.id} movieDetails={eachMovie} />
              ))}
            </ul>
            {renderPaginationControl()}
          </>
        )

      case apiStatusConstants.failure:
        return <FailureView onRetry={getPopularMovies} />

      default:
        return null
    }
  }

  return (
    <div className="popular-container">
      <Header />
      <div className="popular-content">{renderPopularMovies()}</div>
      <Footer />
    </div>
  )
}

export default Popular
