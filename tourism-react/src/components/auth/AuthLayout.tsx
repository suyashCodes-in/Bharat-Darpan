interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#E7D8C1] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-accent flex overflow-hidden min-h-[550px]">

        {/* Left panel — illustration */}
        <div
          className="auth-left-panel w-1/2 bg-cream flex flex-col items-center justify-center text-center px-10 py-12 gap-6"
        >
          <div>
            <h1 className="font-heading text-[1.6rem] text-navy leading-tight">
              Experience the Incredible Bharat
            </h1>
            <p className="text-[0.85rem] text-navy/70 mt-1 italic">
              — We plan, you enjoy! —
            </p>
          </div>
          <img
            src="/image.png"
            alt="Travel illustration"
            className="w-4/5 rounded-[47%] object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <p className="italic text-navy/80 text-[1.1rem]">
            Travel smarter, explore deeper!
          </p>
        </div>

        {/* Right panel — form */}
        <div className="w-1/2 flex items-center justify-center px-10 py-12">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
