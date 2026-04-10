export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="loader-ring" aria-hidden="true" />
      <span className="loader-text">{text}</span>
    </div>
  )
}
