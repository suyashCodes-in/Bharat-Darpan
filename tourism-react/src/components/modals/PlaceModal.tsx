// This modal was missing entirely from the vanilla source (modal-place div did not exist).
// Built here with structured placeholder content.

const SECTIONS = [
  { icon: 'fas fa-landmark',   title: 'History',         text: 'This destination has a rich historical legacy spanning centuries. Explore monuments, forts, and temples that tell the story of its past.' },
  { icon: 'fas fa-music',      title: 'Culture',         text: 'Experience vibrant local festivals, traditional music, dance forms, and handicrafts unique to this region.' },
  { icon: 'fas fa-leaf',       title: 'Nature & Climate',text: 'Discover the natural landscapes, nearby wildlife, and the best seasons to visit for an unforgettable experience.' },
  { icon: 'fas fa-map-pin',    title: 'Hidden Gems',     text: 'Beyond the famous landmarks lie local markets, street food alleys, and off-the-beaten-path trails waiting to be explored.' },
]

export default function PlaceModal() {
  return (
    <>
      <h2 className="font-heading text-2xl text-navy mb-6">About the Place</h2>
      <div className="flex flex-col gap-5">
        {SECTIONS.map(s => (
          <div key={s.title} className="flex gap-4 items-start bg-white rounded-lg p-4 border border-accent">
            <i className={`${s.icon} text-navy text-2xl mt-1 w-8 shrink-0`} />
            <div>
              <h4 className="font-semibold text-navy mb-1">{s.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
