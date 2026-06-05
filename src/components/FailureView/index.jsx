import './index.css'

const FailureView = props => {
  const {onRetry} = props

  return (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dlvle38po/image/upload/v1780663568/Background-Complete_uskebh.png"
        alt="failure view"
        className="failure-image"
      />

      <h1 className="failure-heading">Something went wrong</h1>

      <p className="failure-description">
        We are having some trouble completing your request. Please try again.
      </p>

      <button type="button" className="try-again-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )
}

export default FailureView
