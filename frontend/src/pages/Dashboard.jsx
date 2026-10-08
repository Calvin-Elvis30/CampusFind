import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api' 
import Navbar from '../components/Navbar'
import ItemCard from '../components/ItemCard'

const CATEGORIES = [
  'Accessories',
  'Bags',
  'Electronics',
  'Books',
  'Clothing',
  'Documents',
  'Keys',
  'Other',
]

// Ignored when matching, so "I lost my blue backpack near the cafeteria"
// still works as a natural sentence
const STOP_WORDS = new Set([
  'i',
  'my',
  'me',
  'a',
  'an',
  'the',
  'is',
  'was',
  'near',
  'at',
  'in',
  'on',
  'of',
  'and',
  'to',
  'it',
  'yesterday',
  'today',
  'around',
  'some',
  'have',
  'has',
  'by',
  'for',
  'with',
])

const TYPE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch {
      return null
    }
  })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [view, setView] = useState('all') // all | mine
  const [typeFilter, setTypeFilter] = useState('all') // all | lost | found
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [query, setQuery] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login', { replace: true })
  }

  // Guard: no token, back to login
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login', { replace: true })
  }, [navigate])

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/items', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        setItems(Array.isArray(data) ? data : data.items || data.msg || [])
      } catch (err) {
        if (err.response?.status === 401) return handleLogout()
        setError(err.response?.data?.msg || 'Failed to load items')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Live filtering: runs on every keystroke
  const visibleItems = useMemo(() => {
    const myId = user?._id || user?.id

    const words = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w && !STOP_WORDS.has(w))

    const scored = items
      .filter((item) => {
        if (view === 'mine') {
          const ownerId = item.user?._id || item.user || item.userId
          if (!myId || ownerId !== myId) return false
        }
        if (typeFilter !== 'all' && item.type?.toLowerCase() !== typeFilter)
          return false
        if (categoryFilter !== 'all' && item.category !== categoryFilter)
          return false
        return true
      })
      .map((item) => {
        if (words.length === 0) return { item, score: 0 }
        const haystack = [
          item.title,
          item.description,
          item.location,
          item.category,
          item.type,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        const score = words.reduce(
          (n, w) => n + (haystack.includes(w) ? 1 : 0),
          0,
        )
        return { item, score }
      })

    // With a search: keep matches only, best matches first
    if (words.length > 0) {
      return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((s) => s.item)
    }
    return scored.map((s) => s.item)
  }, [items, view, typeFilter, categoryFilter, query, user])

  const handleSubmit = (e) => {
    e.preventDefault() // results are already live; this just dismisses the keyboard
    searchRef.current?.blur()
  }

  return (
    <div className='min-h-screen bg-blue-50/60'>
      <Navbar
        user={user}
        view={view}
        onViewChange={setView}
        onReport={() => navigate('/report')}
        onLogout={handleLogout}
      />

      <main className='mx-auto max-w-6xl px-4 py-8'>
        {/* Heading + search */}
        <section className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
            {view === 'mine' ? 'My Items' : 'Lost something? Found something?'}
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            {view === 'mine'
              ? 'Everything you have reported, lost or found.'
              : 'Search the reports below or describe what you are looking for.'}
          </p>

          <form onSubmit={handleSubmit} className='mt-5 flex gap-2'>
            <div className='relative flex-1'>
              <input
                ref={searchRef}
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: 'I lost my blue backpack near the cafeteria'"
                className='w-full rounded-lg border border-blue-200 bg-white px-4 py-3 pr-16 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              />
              {query && (
                <button
                  type='button'
                  onClick={() => setQuery('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-800'
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type='submit'
              className='rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700'
            >
              Search
            </button>
          </form>
        </section>

        {/* Filters */}
        <section className='mb-6 flex flex-wrap items-center justify-between gap-3'>
          <div className='inline-flex rounded-lg border border-blue-200 bg-white p-1'>
            {TYPE_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
                  typeFilter === t.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-3'>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            >
              <option value='all'>All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {!loading && !error && (
              <span className='text-sm text-gray-500'>
                {visibleItems.length}{' '}
                {visibleItems.length === 1 ? 'result' : 'results'}
              </span>
            )}
          </div>
        </section>

        {/* Results */}
        {loading ? (
          <div className='flex justify-center py-20'>
            <div className='h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600' />
          </div>
        ) : error ? (
          <p className='py-20 text-center text-sm text-red-500'>{error}</p>
        ) : visibleItems.length === 0 ? (
          <div className='rounded-xl border border-dashed border-blue-200 bg-white py-16 text-center'>
            <p className='font-semibold text-gray-700'>
              {view === 'mine' && !query
                ? "You haven't reported any items yet."
                : 'No items match your search.'}
            </p>
            <p className='mt-1 text-sm text-gray-500'>
              {query
                ? 'Try fewer or different words.'
                : 'Reports will show up here.'}
            </p>
            <button
              onClick={() => navigate('/report')}
              className='mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700'
            >
              Report an item
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {visibleItems.map((item) => (
              <ItemCard key={item._id || item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
