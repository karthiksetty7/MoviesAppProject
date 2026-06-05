import {Link} from 'react-router'

import './index.css'

const MovieCard = props => {
  const {movieDetails} = props

  const {id, title, posterPath} = movieDetails

  return (
    <li className="movie-card-item">
      <Link to={`/movies/${id}`} className="movie-card-link">
        <img src={posterPath} alt={title} className="movie-card-image" />
      </Link>
    </li>
  )
}

export default MovieCard
