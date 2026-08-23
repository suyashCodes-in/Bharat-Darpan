import { useState } from 'react'

export default function FoodModal() {
  const [coupon, setCoupon] = useState<number | null>(null)

  const generateCode = () => {
    setCoupon(Math.floor(100000 + Math.random() * 900000))
  }

  return (
    <div className="text-center">
      <h2 className="font-heading text-2xl text-navy mb-4">Local Zayaka</h2>
      <p className="text-gray-600 mb-6">
        Show this code at our listed local food corners to get{' '}
        <strong>Flat 25% OFF</strong> on your bill!
      </p>
      <button
        id="generate-coupon-btn"
        onClick={generateCode}
        className="bg-accent text-navy font-bold px-8 py-3 rounded hover:bg-cream transition-colors mb-6"
      >
        Generate My Coupon
      </button>
      {coupon !== null && (
        <div className="text-4xl tracking-widest font-bold bg-navy text-cream px-6 py-5 rounded-xl inline-block">
          {coupon}
        </div>
      )}
    </div>
  )
}
