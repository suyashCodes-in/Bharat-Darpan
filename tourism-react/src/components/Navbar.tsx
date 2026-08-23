import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  onReset: () => void
}

export default function Navbar({ onReset }: NavbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Body scroll lock while mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleReset = () => { setMenuOpen(false); onReset() }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  // ── Shared auth UI pieces ─────────────────────────────────────────────────
  const desktopAuth = user ? (
    <div className="hidden md:flex items-center gap-3">
      <span className="text-cream text-sm opacity-80">
        <i className="fas fa-user-circle mr-1.5" />
        {user.name}
        {user.role === 'guide' && (
          <span className="ml-1.5 text-xs bg-accent text-navy px-2 py-0.5 rounded-full font-semibold">
            Guide
          </span>
        )}
      </span>
      <button
        id="navbar-logout-btn"
        onClick={handleLogout}
        className="border border-accent px-5 py-2 text-cream rounded hover:bg-accent hover:text-navy transition-colors duration-200 text-sm"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="hidden md:flex items-center gap-2">
      <Link
        id="navbar-login-link"
        to="/login"
        className="border border-accent px-5 py-2 text-cream no-underline rounded hover:bg-accent hover:text-navy transition-colors duration-200 text-sm"
      >
        Login
      </Link>
      <Link
        id="navbar-signup-link"
        to="/signup"
        className="bg-accent text-navy font-bold px-5 py-2 no-underline rounded hover:bg-cream transition-colors duration-200 text-sm"
      >
        Sign Up
      </Link>
    </div>
  )

  const mobileAuth = user ? (
    <div className="flex flex-col gap-2">
      <p className="text-center text-cream text-sm opacity-80">
        <i className="fas fa-user-circle mr-1.5" />{user.name}
      </p>
      <button
        onClick={handleLogout}
        className="block text-center border border-accent px-6 py-2.5 text-cream rounded"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <Link
        to="/login"
        onClick={() => setMenuOpen(false)}
        className="block text-center border border-accent px-6 py-2.5 text-cream no-underline rounded"
      >
        Login
      </Link>
      <Link
        to="/signup"
        onClick={() => setMenuOpen(false)}
        className="block text-center bg-accent text-navy font-bold px-6 py-2.5 no-underline rounded"
      >
        Sign Up
      </Link>
    </div>
  )

  return (
    <header
      className={`fixed top-0 w-full z-[1000] bg-navy text-cream transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : ''
      }`}
    >
      {/* Main bar */}
      <div className="flex justify-between items-center px-6 md:px-12 py-4">

        {/* Brand */}
        <button
          id="navbar-logo-btn"
          onClick={handleReset}
          className="flex items-center gap-3 bg-transparent border-none cursor-pointer text-cream"
        >
          <img
            src="/logo.png"
            alt="Bharat Darpan"
            className="w-13 h-13 object-contain rounded-sm"
            style={{ width: 52, height: 52 }}
          />
          <span className="font-heading text-[1.1rem] font-bold italic leading-tight">
            experience<br />incredible india
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="flex items-center gap-4">
          {desktopAuth}

          {/* Hamburger (visible < 768px) */}
          <button
            id="navbar-hamburger-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="hamburger-btn flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer md:hidden"
          >
            <span
              className="block w-6 h-0.5 bg-cream rounded-sm transition-all duration-300"
              style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}
            />
            <span
              className="block w-6 h-0.5 bg-cream rounded-sm transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 bg-cream rounded-sm transition-all duration-300"
              style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}
            />
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out bg-navy md:hidden"
        style={{
          maxHeight: menuOpen ? '160px' : '0',
          borderTop: menuOpen ? '1px solid rgba(211,212,192,0.2)' : 'none',
        }}
      >
        <div className="px-6 pt-3 pb-5">
          {mobileAuth}
        </div>
      </div>
    </header>
  )
}
