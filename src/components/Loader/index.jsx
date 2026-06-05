import {BeatLoader, ClipLoader} from 'react-spinners'
import './index.css'

const Loader = props => {
  const {type = 'beat'} = props

  return (
    <div className="loader-container" data-testid="loader">
      {type === 'clip' ? (
        <ClipLoader color="#D81F26" size={50} />
      ) : (
        <BeatLoader color="#D81F26" size={15} />
      )}
    </div>
  )
}

export default Loader
