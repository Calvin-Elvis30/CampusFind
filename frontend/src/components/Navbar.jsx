import { Link } from 'react-router-dom'

export default function Navbar({
  user,
  view,
  onViewChange,
  onReport,
  onLogout,
}) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  const tab = (active) =>
    `rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <header className='sticky top-0 z-30 border-b border-blue-100 bg-white'>
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3'>
        <div className='flex items-center gap-6'>
          <Link
            to='/dashboard'
            className='text-xl font-extrabold text-blue-600'
          >
            CampusFind
          </Link>

          <nav className='hidden items-center gap-1 sm:flex'>
            <button
              className={tab(view === 'all')}
              onClick={() => onViewChange('all')}
            >
              Browse
            </button>
            <button
              className={tab(view === 'mine')}
              onClick={() => onViewChange('mine')}
            >
              My Items
            </button>
          </nav>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={onReport}
            className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700'
          >
            Report Item
          </button>

          <div className='hidden items-center gap-2 sm:flex'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700'>
              {initial}
            </div>
            <span className='text-sm font-semibold text-gray-700'>
              {user?.name}
            </span>
          </div>

          <button
            onClick={onLogout}
            className='text-sm font-medium text-gray-500 transition hover:text-red-500'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className='flex gap-1 border-t border-blue-50 px-4 py-2 sm:hidden'>
        <button
          className={tab(view === 'all')}
          onClick={() => onViewChange('all')}
        >
          Browse
        </button>
        <button
          className={tab(view === 'mine')}
          onClick={() => onViewChange('mine')}
        >
          My Items
        </button>
      </div>
    </header>
  )
}
