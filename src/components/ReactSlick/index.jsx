import {Link} from 'react-router'
import ClipLoader from 'react-spinners/ClipLoader'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {slidesToShow: 4, slidesToScroll: 1, initialSlide: 1},
    },
    {
      breakpoint: 600,
      settings: {slidesToShow: 3, slidesToScroll: 3, initialSlide: 1},
    },
    {
      breakpoint: 480,
      settings: {slidesToShow: 3, slidesToScroll: 3},
    },
  ],
}

const ReactSlick = ({apiStatus, moviesList, retryFn}) => {
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
      <button type="button" className="retry-button" onClick={retryFn}>
        Try again
      </button>
    </div>
  )

  const renderSlides = () => {
    const filteredMoviesData = moviesList.filter(
      eachMovie => eachMovie.posterPath !== null,
    )

    return filteredMoviesData.map(eachMovie => (
      <Link
        key={eachMovie.id}
        to={`/movies/${eachMovie.id}`}
        className="link-item"
      >
        <div className="react-slick-item">
          <img
            className="poster"
            src={eachMovie.posterPath}
            width="100%"
            height="100%"
            alt={eachMovie.title}
          />
        </div>
      </Link>
    ))
  }

  switch (apiStatus) {
    case apiStatusConstants.success:
      return (
        <div className="App">
          <Slider {...settings}>{renderSlides()}</Slider>
        </div>
      )
    case apiStatusConstants.failure:
      return <div className="App">{renderFailureView()}</div>
    case apiStatusConstants.inProgress:
      return <div className="App">{renderLoadingView()}</div>
    default:
      return null
  }
}

export default ReactSlick
