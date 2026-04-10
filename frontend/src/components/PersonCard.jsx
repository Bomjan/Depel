const FALLBACK = '/placeholder.svg'

function imgSrc(path) {
  if (!path) return FALLBACK
  return path.startsWith('http') ? path : `/media/${path}`
}

export default function PersonCard({ person }) {
  return (
    <div className="person-card" id={`person-card-${person.id}`}>
      <div className="person-card-img-wrap">
        <img
          src={imgSrc(person.image)}
          alt={person.name}
          className="person-card-img"
          loading="lazy"
          onError={e => { e.target.src = FALLBACK }}
        />
      </div>
      <div className="person-card-body">
        <div className="person-card-name">{person.name}</div>
        <div className="person-card-position">{person.position}</div>
        {person.bio && (
          <p className="person-card-bio">{person.bio}</p>
        )}
      </div>
    </div>
  )
}
