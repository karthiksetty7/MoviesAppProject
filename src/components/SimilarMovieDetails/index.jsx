import {useState, useEffect} from 'react'
import {useParams} from 'react-router'
import Cookies from 'js-cookie'
import ClipLoader from 'react-spinners/ClipLoader'

import SimilarMovies from '../SimilarMovies'

import './index.css'

const API_KEY = '073ee1c80c647b7c6ffb2c52eb328a6d'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const SimilarMovieDetails = () => {
  const {id} = useParams()
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [similarMoviesData, setSimilarMoviesData] = useState([])

  const getSimilarDetailsData = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const pageNumber = 1
    const apiUrl = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=${pageNumber}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const filtered = data.results.filter(m => m.poster_path !== null)
      const similarMoviesList = filtered.map(m => ({
        id: m.id,
        posterPath: m.poster_path,
        title: m.title,
      }))
      setSimilarMoviesData(similarMoviesList)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getSimilarDetailsData()
  }, [id])

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <ClipLoader color="#D81F26" size={50} />
    </div>
  )

  const renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-img"
      />
      <p className="failure-view-heading">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={getSimilarDetailsData}
      >
        Try Again
      </button>
    </div>
  )

  const renderSimilarMovieDetailsDataView = () => {
    const smallScreenSimilarMovies = [...similarMoviesData].splice(0, 5)

    return (
      <div className="similar-movies-container">
        <h1 className="similar-movies-heading">More like this</h1>
        <div className="similar-movies-list-container">
          {smallScreenSimilarMovies.map(eachMovieDetails => (
            <SimilarMovies
              key={eachMovieDetails.id}
              movieDetails={eachMovieDetails}
            />
          ))}
        </div>
      </div>
    )
  }

  switch (apiStatus) {
    case apiStatusConstants.success:
      return renderSimilarMovieDetailsDataView()
    case apiStatusConstants.failure:
      return renderFailureView()
    case apiStatusConstants.inProgress:
      return renderLoadingView()
    default:
      return null
  }
}

export default SimilarMovieDetails
