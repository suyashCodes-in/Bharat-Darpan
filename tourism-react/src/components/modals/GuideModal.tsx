const GUIDES = [
  { name: 'Ramesh Kumar', rating: '★★★★★', score: '4.9' },
  { name: 'Anita Sharma', rating: '★★★★☆', score: '4.5' },
]

export default function GuideModal() {
  return (
    <>
      <h2 className="font-heading text-2xl text-navy mb-6">Verified Local Guides</h2>
      <div className="flex flex-col gap-4">
        {GUIDES.map(g => (
          <div
            key={g.name}
            className="flex justify-between items-center bg-white p-4 rounded-lg border border-accent"
          >
            <div>
              <h4 className="font-semibold text-navy">{g.name}</h4>
              <p className="text-yellow-500 text-sm">{g.rating} ({g.score})</p>
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
