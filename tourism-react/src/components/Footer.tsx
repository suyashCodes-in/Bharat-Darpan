import { useState, useCallback } from 'react'

const SOCIAL = [
  { icon: 'fab fa-facebook-f', label: 'Facebook' },
  { icon: 'fab fa-instagram',  label: 'Instagram' },
  { icon: 'fab fa-twitter',    label: 'Twitter' },
  { icon: 'fab fa-whatsapp',   label: 'WhatsApp' },
  { icon: 'fab fa-youtube',    label: 'YouTube' },
]

const LEGAL = ['FAQs', 'Terms and conditions', 'Privacy policy', 'Cookie policy']

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)

  const handleBackToTop = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSubscribe = useCallback(() => {
    setSubscribed(true)
    setTimeout(() => setSubscribed(false), 4000)
  }, [])

  return (
    <footer className="bg-[#05182A] text-cream px-6 md:px-12 pt-[60px] pb-[30px] font-sans">

      {/* Top row */}
      <div className="flex justify-between items-center mb-[30px]">
        <div className="font-heading text-[2rem] font-bold tracking-wide">
          Bharat Darpan
        </div>
        <button
          id="back-to-top-btn"
          onClick={handleBackToTop}
          className="border border-cream text-cream bg-transparent px-5 py-2.5 rounded-[30px] text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-cream hover:text-navy"
        >
          BACK TO TOP ↑
        </button>
      </div>

      {/* Middle 3-column grid */}
      <div className="grid mb-10" style={{ gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px' }}>

        {/* Newsletter */}
        <div className="bg-[rgba(243,228,201,0.05)] border border-[rgba(211,212,192,0.1)] rounded-xl p-10">
          <h3 className="font-sans text-[1.8rem] font-semibold mb-5">
            Subscribe to the Newsletter
          </h3>
          <p className="text-accent leading-[1.6] mb-[30px]">
            Sign up for exciting travel news, learn more about our upcoming packages and get great travel ideas.
          </p>
          <button
            id="footer-subscribe-btn"
            onClick={handleSubscribe}
            disabled={subscribed}
            className={`flex items-center gap-2.5 border-none px-[30px] py-[15px] rounded-[30px] font-bold text-sm cursor-pointer transition-all duration-300 ${
              subscribed
                ? 'bg-green-500 text-white'
                : 'bg-cream text-navy hover:opacity-80'
            }`}
          >
            {subscribed
              ? <><i className="fas fa-check" /> Subscribed!</>
              : <>SUBSCRIBE NEWSLETTER <i className="fas fa-chevron-right" /></>
            }
          </button>
        </div>

        {/* Quick links */}
        <div className="bg-[rgba(243,228,201,0.05)] border border-[rgba(211,212,192,0.1)] rounded-xl p-10 flex flex-col gap-5 justify-center">
          {['ABOUT US', 'CONTACT US', 'WHERE TO GO'].map(label => (
            <a
              key={label}
              href="#"
              onClick={label === 'WHERE TO GO' ? handleBackToTop : undefined}
              className="text-cream no-underline font-semibold text-[0.95rem] tracking-[0.5px] transition-colors duration-300 hover:text-accent"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Social + App */}
        <div className="flex flex-col gap-5">
          {/* Social */}
          <div className="bg-[rgba(243,228,201,0.05)] border border-[rgba(211,212,192,0.1)] rounded-xl px-[30px] py-[25px]">
            <h3 className="font-sans text-[1.5rem] font-semibold mb-[15px]">Follow us</h3>
            <div className="flex gap-3 flex-wrap">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-[rgba(243,228,201,0.15)] text-cream no-underline text-[1.2rem] transition-all duration-300 hover:bg-accent hover:text-navy"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* App */}
          <div className="bg-[rgba(243,228,201,0.05)] border border-[rgba(211,212,192,0.1)] rounded-xl px-[30px] py-[25px] flex justify-between items-center">
            <h3 className="font-sans text-[1.5rem] font-semibold leading-tight">
              Download<br />Our App
            </h3>
            <div className="w-20 h-20 bg-cream text-navy rounded-lg flex items-center justify-center text-5xl">
              <i className="fas fa-qrcode" />
            </div>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="flex justify-between items-center pt-5 border-t border-[rgba(211,212,192,0.2)] text-sm flex-wrap gap-3">
        <div className="flex gap-6 flex-wrap">
          {LEGAL.map(label => (
            <a
              key={label}
              href="#"
              className="text-accent no-underline transition-colors duration-300 hover:text-cream"
            >
              {label}
            </a>
          ))}
        </div>
        <p className="text-accent">Copyright &copy; 2026 Incredible India Tourism. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
