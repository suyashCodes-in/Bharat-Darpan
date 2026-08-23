const PACKAGES = [
  { tier: 'Silver',   color: 'border-gray-400',  desc: '3-Star Stay, Standard Guide, Local Zayaka Access' },
  { tier: 'Gold',     color: 'border-yellow-400', desc: '4-Star Stay, Premium Guide, 2 Meals/Day' },
  { tier: 'Platinum', color: 'border-gray-300',   desc: '5-Star Stay, Elite Guide, All Meals & VIP Entry' },
]

export default function PackagesModal() {
  return (
    <>
      <h2 className="font-heading text-2xl text-navy mb-6">All-Inclusive Packages</h2>
      <div className="flex flex-col gap-4">
        {PACKAGES.map(pkg => (
          <div
            key={pkg.tier}
            className={`flex justify-between items-center bg-white p-5 rounded-lg border-l-4 ${pkg.color}`}
          >
            <div>
              <h4 className="font-semibold text-navy text-lg">{pkg.tier}</h4>
              <p className="text-gray-600 text-sm">{pkg.desc}</p>
            </div>
            <button className="bg-accent text-navy font-bold px-5 py-2 rounded hover:bg-cream transition-colors whitespace-nowrap ml-4">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
