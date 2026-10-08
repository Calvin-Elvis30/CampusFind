import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const Login = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await api.post('/auth/login', form)

      // Save the JWT token for authenticated requests
      localStorage.setItem('token', data.msg.token)


      // Redirect to the dashboard page
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          'Login failed. Check your details and try again.',
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
        <h1 className='mt-6 text-2xl font-bold text-gray-900'>Welcome back</h1>
        <p className='mt-2 text-sm text-gray-500'>
          Log in to manage your lost and found reports.
        </p>
        {error && (
          <div className='mt-5 rounded-md bg-red-50 p-3 text-sm text-red-600'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
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
              placeholder='Enter your password'
              autoComplete='current-password'
              required
              className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-500'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='font-semibold text-blue-600 hover:text-blue-700'
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Login
