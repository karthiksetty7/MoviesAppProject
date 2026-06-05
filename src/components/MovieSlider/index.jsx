import Slider from 'react-slick'
import MovieCard from '../MovieCard'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './index.css'

const MovieSlider = props => {
  const {moviesList = []} = props

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="movie-slider-container">
      <Slider {...settings}>
        {moviesList.map(eachMovie => (
          <div key={eachMovie.id} className="slider-item">
            <MovieCard movieDetails={eachMovie} />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default MovieSlider
