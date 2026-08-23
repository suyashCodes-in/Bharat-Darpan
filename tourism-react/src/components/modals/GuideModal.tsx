import { useEffect, useState } from 'react'
import { listGuides } from '../../lib/guides'
import type { UserProfile } from '../../lib/auth'

function StarRating({ score }: { score: number }) {
  return (
    <span className="text-yellow-500 text-sm" aria-label={`${score} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <i
          key={i}
          className={i <= Math.round(score) ? 'fas fa-star' : 'far fa-star'}
        />
      ))}
      {' '}({score.toFixed(1)})
    </span>
  )
}

export default function GuideModal() {
  const [guides, setGuides]   = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    listGuides()
      .then(res => setGuides(res.items))
      .catch(() => setError('Failed to load guides. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <h2 className="font-heading text-2xl text-navy mb-6">Verified Local Guides</h2>

      {loading && (
        <div className="flex flex-col items-center py-10 gap-3 text-navy opacity-60">
          <i className="fas fa-spinner fa-spin text-3xl" />
          <p className="text-sm">Loading guides…</p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center py-6">
          <i className="fas fa-exclamation-circle mr-1" />{error}
        </p>
      )}

      {!loading && !error && guides.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <i className="fas fa-user-slash text-4xl mb-3 block opacity-40" />
          <p className="text-sm">No verified guides found yet.</p>
          <p className="text-xs mt-1">Be the first to register!</p>
        </div>
      )}

      {!loading && !error && guides.length > 0 && (
        <div className="flex flex-col gap-4">
          {guides.map(g => (
            <div
              key={g._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded-lg border border-accent gap-3"
            >
              <div>
                <h4 className="font-semibold text-navy">{g.name}</h4>
                {g.city && (
                  <p className="text-gray-500 text-xs mt-0.5">
                    <i className="fas fa-map-marker-alt mr-1" />{g.city}
                  </p>
                )}
                {(g.languages ?? []).length > 0 && (
                  <p className="text-gray-500 text-xs mt-0.5">
                    <i className="fas fa-language mr-1" />{(g.languages ?? []).join(', ')}
                  </p>
                )}
                {(g.specialties ?? []).length > 0 && (
                  <p className="text-gray-500 text-xs mt-0.5">
                    <i className="fas fa-star mr-1 text-accent" />
                    {(g.specialties ?? []).join(', ')}
                  </p>
                )}
                {typeof g.experienceYears === 'number' && (
                  <StarRating score={Math.min(5, 3 + g.experienceYears * 0.2)} />
                )}
              </div>
              <button className="bg-accent text-navy font-bold px-5 py-2 rounded hover:bg-cream transition-colors shrink-0">
                Book Guide
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
