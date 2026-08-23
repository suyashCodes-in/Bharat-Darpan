import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginForm() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPw]   = useState(false)
  const [message, setMessage]       = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
    setMessage('Login submitted! (Backend integration pending.)')
  }

  const inputCls = "w-full px-4 py-2.5 rounded border border-accent bg-[#F9F9F9] text-navy text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
  const labelCls = "block text-xs text-navy mb-1"

  return (
    <>
      <h2 className="font-heading text-3xl text-navy mb-8">Login to Continue</h2>

      <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className={labelCls}>Email or Username</label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className={labelCls}>Password</label>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="············"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`${inputCls} pr-10`}
            required
          />
          <button
            type="button"
            id="login-toggle-pw"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-[30px] text-gray-400 hover:text-navy transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
          </button>
        </div>

        <a href="#" className="block text-xs text-navy text-right hover:underline mb-2">
          Forgot your password?
        </a>

        <button
          id="login-submit-btn"
          type="submit"
          className="w-full bg-navy text-cream font-bold py-3 rounded hover:opacity-90 transition-opacity"
        >
          SIGN IN
        </button>
      </form>

      {message && (
        <p className="text-green-600 text-sm text-center mt-3">{message}</p>
      )}

      {/* Social SSO */}
      <div className="text-center mt-6 mb-6">
        <p className="text-xs text-gray-400 mb-4">Or Sign in With</p>
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
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold hover:underline">Sign Up Here</Link>
      </p>
    </>
  )
}
