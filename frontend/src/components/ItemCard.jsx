import api from '../services/api'
const API_ORIGIN = new URL(api.defaults.baseURL, window.location.origin).origin

const ItemCard = ({ item }) => {
  // Works for both full URLs and relative upload paths like /uploads/xyz.jpg
  const imageSrc = item.image?.startsWith('http')
    ? item.image
    : `${API_ORIGIN}${item.image}`

  return (
    <article className='group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg'>
      {/* Image */}
      <div className='relative h-56 overflow-hidden bg-gray-100'>
        <img
          src={imageSrc}
          alt={item.name}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
        />

        {/* Status */}
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            item.status === 'lost'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* Content */}
      <div className='p-5'>
        <div className='mb-3'>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600'>
            {item.category}
          </span>
        </div>

        <h3 className='text-lg font-bold text-gray-900'>{item.name}</h3>

        <p className='mt-2 text-sm text-gray-500'>📍 {item.location}</p>

        <button className='mt-5 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'>
          View Details
        </button>
      </div>
    </article>
  )
}

export default ItemCard
