import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const MAX_SIZE_MB = 5

const Reportitem = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    category: '',
    location: '',
    status: 'lost',
  })

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Free the preview URL when it changes or the page unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file (JPG, PNG, WEBP).')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be smaller than ${MAX_SIZE_MB}MB.`)
      return
    }

    setImageError('')
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setPreview('')
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imageFile) {
      setImageError('Please upload an image of the item.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const body = new FormData()
      Object.entries(form).forEach(([key, value]) => body.append(key, value))
      body.append('image', imageFile)

      // No Content-Type header: the browser sets the multipart boundary itself
      await api.post('/items', body)

      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.msg || 'Unable to report item. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-gray-50 px-6 py-12'>
      <div className='mx-auto max-w-5xl'>
        {/* Header */}
        <div className='mb-10'>
          <p className='text-sm font-semibold uppercase tracking-wider text-blue-600'>
            CampusFind
          </p>

          <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900'>
            Report an Item
          </h1>

          <p className='mt-3 max-w-2xl text-gray-600'>
            Help someone reconnect with their lost belongings by providing some
            information about the item.
          </p>
        </div>

        {/* Form Card */}
        <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
          <div className='grid lg:grid-cols-2'>
            {/* Left side */}
            <div className='bg-gray-900 p-8 text-white lg:p-10'>
              <h2 className='text-2xl font-bold'>Tell us about the item</h2>

              <p className='mt-3 leading-7 text-gray-300'>
                The more accurate information you provide, the easier it becomes
                for the owner to identify their belongings.
              </p>

              <div className='mt-10 space-y-6'>
                <div>
                  <div className='mb-2 text-2xl'>📍</div>
                  <h3 className='font-semibold'>Where was it found?</h3>
                  <p className='mt-1 text-sm text-gray-400'>
                    Give a clear campus location.
                  </p>
                </div>

                <div>
                  <div className='mb-2 text-2xl'>🔍</div>
                  <h3 className='font-semibold'>Describe it clearly</h3>
                  <p className='mt-1 text-sm text-gray-400'>
                    Use details that can help identify the item.
                  </p>
                </div>

                <div>
                  <div className='mb-2 text-2xl'>📷</div>
                  <h3 className='font-semibold'>Add a photo</h3>
                  <p className='mt-1 text-sm text-gray-400'>
                    A photo makes the report much easier to recognize.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <form onSubmit={handleSubmit} className='space-y-6 p-8 lg:p-10'>
              {/* Error */}
              {error && (
                <div className='rounded-lg bg-red-50 p-4 text-sm text-red-600'>
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor='name'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  Item name
                </label>

                <input
                  id='name'
                  name='name'
                  type='text'
                  value={form.name}
                  onChange={handleChange}
                  placeholder='e.g. Black HP Laptop'
                  required
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor='category'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  Category
                </label>

                <select
                  id='category'
                  name='category'
                  value={form.category}
                  onChange={handleChange}
                  required
                  className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                >
                  <option value=''>Select a category</option>
                  <option value='gadget'>Gadget</option>
                  <option value='documents'>Documents</option>
                  <option value='clothing'>Clothing</option>
                  <option value='accessories'>Accessories</option>
                  <option value='keys'>Keys</option>
                  <option value='books'>Books</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor='status'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  Status
                </label>

                <select
                  id='status'
                  name='status'
                  value={form.status}
                  onChange={handleChange}
                  className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                >
                  <option value='lost'>Lost</option>
                  <option value='found'>Found</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor='location'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  Location
                </label>

                <input
                  id='location'
                  name='location'
                  type='text'
                  value={form.location}
                  onChange={handleChange}
                  placeholder='e.g. Hostel R'
                  required
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                />
              </div>

              {/* Image upload */}
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Item image
                </label>

                {preview ? (
                  <div className='overflow-hidden rounded-lg border border-gray-300'>
                    <img
                      src={preview}
                      alt='Selected item preview'
                      className='h-56 w-full object-cover'
                    />
                    <div className='flex items-center justify-between bg-white px-4 py-2.5 text-sm'>
                      <span className='truncate pr-4 text-gray-600'>
                        {imageFile?.name}
                      </span>
                      <button
                        type='button'
                        onClick={removeImage}
                        className='font-semibold text-red-500 hover:text-red-600'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor='image'
                    className='flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 px-4 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50'
                  >
                    <span className='text-sm font-semibold text-blue-600'>
                      Click to upload an image
                    </span>
                    <span className='mt-1 text-xs text-gray-500'>
                      JPG, PNG or WEBP, up to {MAX_SIZE_MB}MB
                    </span>
                  </label>
                )}

                <input
                  id='image'
                  ref={fileInputRef}
                  name='image'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='sr-only'
                />

                {imageError && (
                  <p className='mt-2 text-xs text-red-600'>{imageError}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={loading}
                className='w-full rounded-lg bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Submitting...' : 'Report Item'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Reportitem
