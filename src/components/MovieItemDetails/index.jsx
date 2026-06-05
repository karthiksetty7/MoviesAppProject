import {useEffect, useState} from 'react'
import {useParams} from 'react-router'
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

const MovieItemDetails = () => {
  const {id} = useParams()
  const [movieDetails, setMovieDetails] = useState(null)
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getMovieDetails = async () => {
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
        `${endpoints.getMovieItemDetailsApi}/${id}`,
        options,
      )
      if (response.ok) {
        const data = await response.json()
        const movieData = data.movie_details

        const updatedData = {
          id: movieData.id,
          title: movieData.title,
          overview: movieData.overview,
          backdropPath: movieData.backdrop_path,
          posterPath: movieData.poster_path,
          budget: movieData.budget,
          releaseDate: movieData.release_date,
          runtime: movieData.runtime,
          adult: movieData.adult,
          voteAverage: movieData.vote_average,
          voteCount: movieData.vote_count,
          genres: movieData.genres,
          spokenLanguages: movieData.spoken_languages,
          similarMovies: movieData.similar_movies.map(eachMovie => ({
            id: eachMovie.id,
            title: eachMovie.title,
            posterPath: eachMovie.poster_path,
          })),
        }

        setMovieDetails(updatedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getMovieDetails()
  }, [id])

  const getRuntime = runtime => {
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    return `${hours}h ${minutes}m`
  }

  const formatReleaseDate = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate()
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    let suffix = 'th'
    if (day === 1 || day === 21 || day === 31) suffix = 'st'
    else if (day === 2 || day === 22) suffix = 'nd'
    else if (day === 3 || day === 23) suffix = 'rd'

    return `${day}${suffix} ${month} ${year}`
  }

  const renderSuccessView = () => {
    const {
      title,
      overview,
      backdropPath,
      runtime,
      adult,
      releaseDate,
      budget,
      genres,
      spokenLanguages,
      similarMovies,
      voteAverage,
      voteCount,
    } = movieDetails

    return (
      <>
        <div
          className="movie-details-banner"
          style={{
            backgroundImage: `url(${backdropPath})`,
          }}
        >
          {/* Header placed here to render smoothly over the transparent background */}
          <Header />

          <div className="movie-details-overlay">
            <div className="movie-details-content">
              <h1 className="movie-title">{title}</h1>
              <div className="movie-meta-container">
                <p className="meta-text">{getRuntime(runtime)}</p>
                <p className="rating-badge">{adult ? 'A' : 'U/A'}</p>
                <p className="meta-text">
                  {new Date(releaseDate).getFullYear()}
                </p>
              </div>
              <p className="movie-overview">{overview}</p>
              <button type="button" className="play-button">
                Play
              </button>
            </div>
          </div>
        </div>

        <div className="movie-info-section">
          <div className="movie-info-grid">
            <div className="info-grid-column">
              <h1 className="info-heading">Genres</h1>
              {genres.map(eachGenre => (
                <p key={eachGenre.id} className="info-text">
                  {eachGenre.name}
                </p>
              ))}
            </div>

            <div className="info-grid-column">
              <h1 className="info-heading">Audio Available</h1>
              {spokenLanguages.map(language => (
                <p key={language.id} className="info-text">
                  {language.english_name}
                </p>
              ))}
            </div>

            <div className="info-grid-column">
              <h1 className="info-heading">Rating Average</h1>
              <p className="info-text">{voteAverage}</p>
              <h1 className="info-heading sub-heading">Rating Count</h1>
              <p className="info-text">{voteCount || 0}</p>
            </div>

            <div className="info-grid-column">
              <h1 className="info-heading">Budget</h1>
              <p className="info-text">{budget}</p>
              <h1 className="info-heading sub-heading">Release Date</h1>
              <p className="info-text">{formatReleaseDate(releaseDate)}</p>
            </div>
          </div>

          <h1 className="similar-heading">More Like This</h1>
          <ul className="similar-movies-list">
            {similarMovies.map(eachMovie => (
              <li key={eachMovie.id} className="similar-movie-item">
                <MovieCard movieDetails={eachMovie} />
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  const renderMovieDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader />
          </div>
        )
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return <FailureView onRetry={getMovieDetails} />
      default:
        return null
    }
  }

  return (
    <div className="movie-details-container">
      {renderMovieDetails()}
      <Footer />
    </div>
  )
}

export default MovieItemDetails
