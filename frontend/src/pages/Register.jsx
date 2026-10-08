import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
setForm((prev) => ({
  ...prev,
  [name]: value,
}))

// console.log('body:', req.body)

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/auth/register', form)

      setSuccess('Account created successfully!')
      setTimeout(() => navigate('/login'), 1000)
    } catch (error) {
      setError(
        error.response?.data?.msg || 'Registration failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-blue-50 px-4 py-10'>
      {' '}
      <div className='w-full max-w-md rounded-xl border border-blue-100 bg-white p-7 shadow-sm'>
        {' '}
        <Link to='/' className='text-sm font-bold text-blue-600'>
          CampusFind{' '}
        </Link>
        
        <h1 className='mt-6 text-2xl font-bold text-gray-900'>
          Create an account
        </h1>
        <p className='mt-2 text-sm text-gray-500'>
          Join CampusFind to help reconnect lost items with their owners.
        </p>
        {error && (
          <div className='mt-5 rounded-md bg-red-50 p-3 text-sm text-red-600'>
            {error}
          </div>
        )}
        {success && (
          <div className='mt-5 rounded-md bg-green-50 p-3 text-sm text-green-700'>
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label
                htmlFor='firstName'
                className='mb-1.5 block text-sm font-medium text-gray-700'
              >
                First name
              </label>
              <input
                id='firstName'
                name='firstName'
                value={form.firstName}
                onChange={handleChange}
                placeholder='First name'
                autoComplete='given-name'
                required
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              />
            </div>

            <div>
              <label
                htmlFor='lastName'
                className='mb-1.5 block text-sm font-medium text-gray-700'
              >
                Last name
              </label>
              <input
                id='lastName'
                name='lastName'
                value={form.lastName}
                onChange={handleChange}
                placeholder='Last name'
                autoComplete='family-name'
                required
                className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='email'
              className='mb-1.5 block text-sm font-medium text-gray-700'
            >
              Email address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder='you@example.com'
              autoComplete='email'
              required
              className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='mb-1.5 block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Create a password'
              autoComplete='new-password'
              minLength={6}
              required
              className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            />
            <p className='mt-1 text-xs text-gray-400'>
              Use at least 6 characters.
            </p>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60'
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-semibold text-blue-600 hover:text-blue-700'
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register
