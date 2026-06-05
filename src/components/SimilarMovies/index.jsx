import './index.css'

const SimilarMovies = ({movieDetails}) => {
  const {id, title, posterPath} = movieDetails

  return (
    <li>
      <img key={id} className="image-style" alt={title} src={posterPath} />
    </li>
  )
}

export default SimilarMovies
