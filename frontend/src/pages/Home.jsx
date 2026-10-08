import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

//local imports
import api from '../services/api'
import homepage from '../assets/homepage.webp'

const Home = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')


  useEffect(() => {
    const getItems = async () => {
      try {
        const { data } = await api.get('/items')
        setItems(data.msg)
      } catch (error) {
        console.error('HOME ERROR:', error)
      } finally {
        setLoading(false)
      }
    }

    getItems()
  }, [])

  // Search + filter
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase())

      const matchesFilter = filter === 'all' || item.status === filter

      return matchesSearch && matchesFilter
    })
  }, [items, search, filter])

  const lostCount = items.filter((item) => item.status === 'lost').length

  const foundCount = items.filter((item) => item.status === 'found').length

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const scrollToItems = () => {
    document
      .getElementById('recent-items')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='min-h-screen bg-[#fafafa] text-gray-900'>
      {/* ================= NAVBAR ================= */}
      <nav className='sticky top-0 z-50 h-14 border-b border-gray-200 bg-white'>
        <div className='mx-auto flex h-full max-w-[1400px] items-center justify-between px-6'>
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-2'
          >
            <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white'>
              Q
            </div>

            <span className='text-sm font-bold text-gray-900'>CampusFind</span>
          </button>

          {/* Navigation */}
          <div className='hidden items-center gap-7 text-xs text-gray-500 md:flex'>
            <button
              onClick={() => navigate('/')}
              className='transition hover:text-gray-900'
            >
              Home
            </button>

            <button
              onClick={scrollToItems}
              className='transition hover:text-gray-900'
            >
              Browse
            </button>

            <button
              onClick={scrollToItems}
              className='transition hover:text-gray-900'
            >
              Dashboard
            </button>
          </div>

          {/* Right */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/report')}
              className='flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700'
            >
              <span className='text-sm'>+</span>
              Report
            </button>

            <button className='hidden text-gray-400 transition hover:text-gray-700 sm:block'>
              ♧
            </button>

            <button className='hidden text-gray-400 transition hover:text-gray-700 sm:block'>
              ♙
            </button>

            <button className='hidden text-gray-400 transition hover:text-gray-700 sm:block'>
              ◐
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        className='relative flex min-h-[390px] items-center justify-center overflow-hidden bg-gray-900'
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, 0.48),
              rgba(0, 0, 0, 0.48)
            ),
            url("${homepage}")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='relative z-10 mx-auto w-full max-w-3xl px-6 text-center text-white'>
          <h1 className='text-4xl font-bold leading-tight tracking-tight sm:text-5xl'>
            Lost something?
            <br />
            <span className='text-white/95'>We'll help you find it.</span>
          </h1>

          <p className='mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80'>
            Report lost or found items and reconnect your campus community with
            their belongings.
          </p>

          {/* Search */}
          <div className='mx-auto mt-6 flex max-w-[560px] overflow-hidden rounded-full bg-white p-1 shadow-xl'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  scrollToItems()
                }
              }}
              placeholder='Search for items...'
              className='min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400'
            />

            <button
              onClick={scrollToItems}
              className='rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold text-white transition hover:bg-gray-800'
            >
              Search
            </button>
          </div>

          {/* Lost / Found buttons */}
          <div className='mt-4 flex justify-center gap-3'>
            <button
              onClick={() => {
                setFilter('lost')
                scrollToItems()
              }}
              className={`rounded-full border px-5 py-2 text-xs font-medium backdrop-blur-sm transition ${
                filter === 'lost'
                  ? 'border-white bg-white text-gray-900'
                  : 'border-white/40 bg-black/20 text-white hover:bg-white/20'
              }`}
            >
              I Lost Something
            </button>

            <button
              onClick={() => {
                setFilter('found')
                scrollToItems()
              }}
              className={`rounded-full border px-5 py-2 text-xs font-medium backdrop-blur-sm transition ${
                filter === 'found'
                  ? 'border-white bg-white text-gray-900'
                  : 'border-white/40 bg-black/20 text-white hover:bg-white/20'
              }`}
            >
              I Found Something
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className='border-b border-gray-200 bg-white'>
        <div className='mx-auto grid max-w-[900px] grid-cols-3'>
          <div className='py-7 text-center'>
            <p className='text-2xl font-bold text-gray-900'>{items.length}</p>

            <p className='mt-1 text-[9px] font-medium uppercase tracking-wider text-gray-400'>
              Total Items
            </p>
          </div>

          <div className='border-x border-gray-100 py-7 text-center'>
            <p className='text-2xl font-bold text-gray-900'>{lostCount}</p>

            <p className='mt-1 text-[9px] font-medium uppercase tracking-wider text-gray-400'>
              Lost
            </p>
          </div>

          <div className='py-7 text-center'>
            <p className='text-2xl font-bold text-gray-900'>{foundCount}</p>

            <p className='mt-1 text-[9px] font-medium uppercase tracking-wider text-gray-400'>
              Found
            </p>
          </div>
        </div>
      </section>

      {/* ================= RECENT ITEMS ================= */}
      <section id='recent-items' className='mx-auto max-w-[1400px] px-6 py-10'>
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-bold text-gray-900'>Recent Items</h2>

            <p className='mt-1 text-xs text-gray-400'>
              Recently reported lost and found items
            </p>
          </div>

          <button
            onClick={() => {
              setFilter('all')
              setSearch('')
            }}
            className='flex items-center gap-1 text-xs text-gray-500 transition hover:text-gray-900'
          >
            View All
            <span>→</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className='py-16 text-center text-sm text-gray-400'>
            Loading items...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredItems.length === 0 && (
          <div className='rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center'>
            <div className='text-4xl'>📦</div>

            <h3 className='mt-4 text-lg font-semibold'>No items found</h3>

            <p className='mt-2 text-sm text-gray-400'>
              Try another search or report an item.
            </p>

            <button
              onClick={() => navigate('/report')}
              className='mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700'
            >
              Report an Item
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && filteredItems.length > 0 && (
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredItems.slice(0, 8).map((item) => (
              <article
                key={item._id}
                className='group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                {/* Image */}
                <div className='relative h-44 overflow-hidden bg-gray-100'>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center text-4xl'>
                      📦
                    </div>
                  )}

                  {/* Status */}
                  <span
                    className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-semibold ${
                      item.status === 'lost'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {item.status === 'lost' ? 'Lost' : 'Found'}
                  </span>
                </div>

                {/* Information */}
                <div className='p-4'>
                  <h3 className='truncate text-sm font-semibold text-gray-900'>
                    {item.name}
                  </h3>

                  <div className='mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-gray-400'>
                    <span>📍 {item.location}</span>

                    <span>📅 {formatDate(item.createdAt)}</span>
                  </div>

                  {/* Category */}
                  <div className='mt-3'>
                    <span className='rounded-md bg-gray-100 px-2.5 py-1 text-[9px] font-medium capitalize text-gray-500'>
                      {item.category}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= FOOTER ================= */}
      <footer className='border-t border-gray-200 bg-white px-6 py-8'>
        <div className='mx-auto flex max-w-[1400px] items-center justify-between'>
          <p className='text-xs text-gray-400'>© 2026 CampusFind</p>

          <p className='text-xs text-gray-400'>
            Helping students find what they've lost.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
