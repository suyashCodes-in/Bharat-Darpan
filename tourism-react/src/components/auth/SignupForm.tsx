import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignupForm() {
  const [name, setName]                   = useState('')
  const [email, setEmail]                 = useState('')
  const [password, setPassword]           = useState('')
  const [confirmPassword, setConfirmPw]   = useState('')
  const [showPassword, setShowPw]         = useState(false)
  const [passwordError, setPwError]       = useState('')
  const [submitted, setSubmitted]         = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setPwError("Passwords don't match. Please try again.")
      return
    }
    setPwError('')
    console.log('Signup attempt:', { name, email, password })
    setSubmitted(true)
  }

  const inputCls = "w-full px-4 py-2.5 rounded border border-accent bg-[#F9F9F9] text-navy text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
  const labelCls = "block text-xs text-navy mb-1"

  if (submitted) {
    return (
      <div className="text-center py-6">
        <i className="fas fa-check-circle text-5xl text-green-500 mb-4 block" />
        <h2 className="font-heading text-2xl text-navy mb-2">Account Created!</h2>
        <p className="text-gray-600 text-sm mb-6">Welcome aboard! You can now log in.</p>
        <Link to="/login" className="bg-navy text-cream font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="font-heading text-3xl text-navy mb-6">Register</h2>

      <form id="signup-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="signup-name" className={labelCls}>Full Name</label>
          <input
            id="signup-name"
            type="text"
            placeholder="e.g. John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputCls}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className={labelCls}>Email or Username</label>
          <input
            id="signup-email"
            type="text"
            placeholder="user@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputCls}
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="signup-password" className={labelCls}>Password</label>
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`${inputCls} pr-10`}
            required
          />
          <button
            type="button"
            id="signup-toggle-pw"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-[30px] text-gray-400 hover:text-navy transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
          </button>
        </div>

        {/* Confirm Password — fixed from vanilla (field was missing) */}
        <div>
          <label htmlFor="signup-confirm-password" className={labelCls}>Confirm Password</label>
          <input
            id="signup-confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => { setConfirmPw(e.target.value); setPwError('') }}
            className={`${inputCls} ${passwordError ? 'border-red-400' : ''}`}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
        </div>

        <button
          id="signup-submit-btn"
          type="submit"
          className="w-full bg-navy text-cream font-bold py-3 rounded hover:opacity-90 transition-opacity"
        >
          SIGN UP
        </button>
      </form>

      {/* Social SSO */}
      <div className="text-center mt-6 mb-4">
        <p className="text-xs text-gray-400 mb-4">Or Sign up With</p>
        <div className="flex justify-center gap-4">
          <button className="w-12 h-12 border border-accent rounded-lg flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors">
            <i className="fab fa-google text-[#DB4437]" />
          </button>
          <button className="w-12 h-12 border border-accent rounded-lg flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors">
            <i className="fab fa-facebook-f text-[#4267B2]" />
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-navy">
        Already have an account?{' '}
        <Link to="/login" className="font-bold hover:underline">Login</Link>
      </p>
    </>
  )
}
