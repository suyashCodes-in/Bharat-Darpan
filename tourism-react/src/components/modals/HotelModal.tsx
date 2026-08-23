const HOTELS = [
  { name: 'The Heritage Stay', rating: 'Google Maps: ★★★★★' },
  { name: 'Comfort Inn',       rating: 'Google Maps: ★★★★☆' },
]

export default function HotelModal() {
  return (
    <>
      <h2 className="font-heading text-2xl text-navy mb-6">Nearby Hotels</h2>
      <div className="flex flex-col gap-4">
        {HOTELS.map(h => (
          <div
            key={h.name}
            className="flex justify-between items-center bg-white p-4 rounded-lg border border-accent"
          >
            <div>
              <h4 className="font-semibold text-navy">{h.name}</h4>
              <p className="text-yellow-500 text-sm">{h.rating}</p>
            </div>
            <button className="bg-accent text-navy font-bold px-5 py-2 rounded hover:bg-cream transition-colors">
              Pay &amp; Book
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
