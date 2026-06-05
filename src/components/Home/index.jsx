import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'
import Loader from '../Loader'
import FailureView from '../FailureView'
import MovieSlider from '../MovieSlider'

import endpoints from '../endpoints'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [originalMovies, setOriginalMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])

  const [trendingStatus, setTrendingStatus] = useState(
    apiStatusConstants.initial,
  )
  const [originalStatus, setOriginalStatus] = useState(
    apiStatusConstants.initial,
  )
  const [topRatedStatus, setTopRatedStatus] = useState(
    apiStatusConstants.initial,
  )

  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 576)

  const jwtToken = Cookies.get('jwt_token')

  const selectFeaturedMovie = (trendingList, originalsList) => {
    const isMobile = window.innerWidth <= 576

    if (isMobile && trendingList.length > 0) {
      const randomIndex = Math.floor(Math.random() * trendingList.length)
      setFeaturedMovie(trendingList[randomIndex])
    } else if (!isMobile && originalsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * originalsList.length)
      setFeaturedMovie(originalsList[randomIndex])
    }
  }

  const getTrendingMovies = async () => {
    setTrendingStatus(apiStatusConstants.inProgress)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(endpoints.trendingMoviesApi, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.results.map(eachMovie => ({
          id: eachMovie.id,
          title: eachMovie.title,
          posterPath: eachMovie.poster_path,
          backdropPath: eachMovie.backdrop_path,
          overview: eachMovie.overview,
        }))
        setTrendingMovies(updatedData)
        setTrendingStatus(apiStatusConstants.success)
        return updatedData
      } else {
        setTrendingStatus(apiStatusConstants.failure)
        return null
      }
    } catch {
      setTrendingStatus(apiStatusConstants.failure)
      return null
    }
  }

  const getOriginalMovies = async () => {
    setOriginalStatus(apiStatusConstants.inProgress)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(endpoints.originalsApi, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.results.map(eachMovie => ({
          id: eachMovie.id,
          title: eachMovie.title,
          posterPath: eachMovie.poster_path,
          backdropPath: eachMovie.backdrop_path,
          overview: eachMovie.overview,
        }))

        setOriginalMovies(updatedData)
        setOriginalStatus(apiStatusConstants.success)
        return updatedData
      } else {
        setOriginalStatus(apiStatusConstants.failure)
        return null
      }
    } catch {
      setOriginalStatus(apiStatusConstants.failure)
      return null
    }
  }

  const getTopRatedMovies = async () => {
    setTopRatedStatus(apiStatusConstants.inProgress)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      // Fixed: Swapped to endpoints.topRatedMoviesApi endpoint path
      const response = await fetch(endpoints.topRatedMoviesApi, options)
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.results.map(eachMovie => ({
          id: eachMovie.id,
          title: eachMovie.title,
          posterPath: eachMovie.poster_path,
          backdropPath: eachMovie.backdrop_path,
          overview: eachMovie.overview,
        }))
        setTopRatedMovies(updatedData)
        setTopRatedStatus(apiStatusConstants.success)
      } else {
        setTopRatedStatus(apiStatusConstants.failure)
      }
    } catch {
      setTopRatedStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      const trendingData = await getTrendingMovies()
      const originalsData = await getOriginalMovies()
      await getTopRatedMovies()

      if (trendingData || originalsData) {
        selectFeaturedMovie(trendingData || [], originalsData || [])
      }
    }

    fetchAllData()

    const handleResize = () => {
      const mobileCheck = window.innerWidth <= 576
      setIsMobileView(mobileCheck)

      if (trendingMovies.length > 0 || originalMovies.length > 0) {
        selectFeaturedMovie(trendingMovies, originalMovies)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [trendingMovies.length, originalMovies.length])

  const renderTrendingSection = () => {
    switch (trendingStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader />
          </div>
        )
      case apiStatusConstants.success:
        return <MovieSlider moviesList={trendingMovies} />
      case apiStatusConstants.failure:
        return <FailureView onRetry={getTrendingMovies} />
      default:
        return null
    }
  }

  const renderOriginalSection = () => {
    switch (originalStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader />
          </div>
        )
      case apiStatusConstants.success:
        return <MovieSlider moviesList={originalMovies} />
      case apiStatusConstants.failure:
        return <FailureView onRetry={getOriginalMovies} />
      default:
        return null
    }
  }

  const renderTopRatedSection = () => {
    switch (topRatedStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader />
          </div>
        )
      case apiStatusConstants.success:
        return <MovieSlider moviesList={topRatedMovies} />
      case apiStatusConstants.failure:
        return <FailureView onRetry={getTopRatedMovies} />
      default:
        return null
    }
  }

  return (
    <div className="home-container">
      <Header />

      {featuredMovie && (
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${featuredMovie.backdropPath})`,
          }}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">{featuredMovie.title}</h1>
              <p className="hero-description">{featuredMovie.overview}</p>
              <button type="button" className="play-button">
                Play
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="movies-sections-container">
        <section className="movie-section">
          <h1 className="section-title">Trending Now</h1>
          {renderTrendingSection()}
        </section>

        <section className="movie-section">
          <h1 className="section-title">
            {isMobileView ? 'Popular' : 'Top Rated'}
          </h1>
          {renderTopRatedSection()}
        </section>

        <section className="movie-section">
          <h1 className="section-title">Originals</h1>
          {renderOriginalSection()}
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Home
