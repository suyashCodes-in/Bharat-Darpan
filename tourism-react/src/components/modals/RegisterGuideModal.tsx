import { useState } from 'react'
import type { GuideFormData } from '../../types'

const EMPTY: GuideFormData = {
  name: '', email: '', phone: '', aadhar: '',
  location: '', languages: '', experience: '', expertise: '', about: '',
}

const EXPERTISE_OPTIONS = [
  { value: 'history',     label: 'History & Heritage' },
  { value: 'culture',     label: 'Culture & Traditions' },
  { value: 'food',        label: 'Food & Local Cuisine' },
  { value: 'adventure',   label: 'Adventure & Nature' },
  { value: 'spiritual',   label: 'Spiritual & Religious' },
  { value: 'photography', label: 'Photography Tours' },
]

export default function RegisterGuideModal() {
  const [form, setForm] = useState<GuideFormData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof GuideFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Guide registration:', form)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-check-circle text-5xl text-green-500 mb-4 block" />
        <h2 className="font-heading text-2xl text-navy mb-2">Registration Submitted!</h2>
        <p className="text-gray-600">We'll review your application and get back to you shortly.</p>
      </div>
    )
  }

  const inputCls = "w-full px-4 py-3 border border-accent rounded-md bg-white text-navy text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
  const labelCls = "block text-navy font-semibold text-xs mb-1"

  return (
    <>
      <h2 className="font-heading text-2xl text-navy mb-1">Register as a Guide</h2>
      <p className="text-gray-500 text-sm mb-5">
        Join Bharat Darpan and help travelers discover India through authentic local experiences.
      </p>
      <form id="guide-registration-form" onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: 'guide-name',      field: 'name',       label: 'Full Name',            type: 'text',  placeholder: 'Enter your full name' },
          { id: 'guide-email',     field: 'email',      label: 'Email Address',        type: 'email', placeholder: 'example@gmail.com' },
          { id: 'guide-phone',     field: 'phone',      label: 'Phone Number',         type: 'tel',   placeholder: 'Enter your phone number' },
          { id: 'guide-aadhar',    field: 'aadhar',     label: 'Aadhar ID',            type: 'tel',   placeholder: 'Enter your Aadhar Id' },
          { id: 'guide-location',  field: 'location',   label: 'City / Location',      type: 'text',  placeholder: 'e.g. Agra' },
          { id: 'guide-languages', field: 'languages',  label: 'Languages You Speak',  type: 'text',  placeholder: 'Hindi, English, Punjabi...' },
          { id: 'guide-exp',       field: 'experience', label: 'Years of Experience',  type: 'number',placeholder: 'e.g. 5' },
        ].map(f => (
          <div key={f.id}>
            <label htmlFor={f.id} className={labelCls}>{f.label}</label>
            <input
              id={f.id}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.field as keyof GuideFormData]}
              onChange={set(f.field as keyof GuideFormData)}
              className={inputCls}
              required
              min={f.type === 'number' ? 0 : undefined}
            />
          </div>
        ))}

        <div>
          <label htmlFor="guide-expertise" className={labelCls}>Area of Expertise</label>
          <select
            id="guide-expertise"
            value={form.expertise}
            onChange={set('expertise')}
            className={inputCls}
            required
          >
            <option value="" disabled>Select your expertise</option>
            {EXPERTISE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="guide-about" className={labelCls}>About Yourself</label>
          <textarea
            id="guide-about"
            rows={4}
            placeholder="Tell travelers about yourself and your guiding experience..."
            value={form.about}
            onChange={set('about')}
            className={`${inputCls} resize-y`}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accent text-navy font-bold py-3 rounded hover:bg-cream transition-colors mt-2"
        >
          Register as Guide
        </button>
      </form>
    </>
  )
}
