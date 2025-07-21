import { Link } from 'react-router-dom'
import { Clock, Users, Star, BookOpen } from 'lucide-react'

const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    description,
    thumbnail,
    category,
    level,
    duration,
    instructor,
    rating,
    enrolledStudents,
    isFree,
    price
  } = course

  const levelColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      <div className="relative mb-4">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>
            {level}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          {isFree ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
              Free
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              ₹{price}
            </span>
          )}
        </div>
      </div>

      <div className="mb-3">
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>{enrolledStudents}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <img
            src={instructor.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=40'}
            alt={instructor.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700">
            {instructor.name}
          </span>
        </div>
        
        <Link
          to={`/courses/${_id}`}
          className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-200"
        >
          <BookOpen className="h-4 w-4" />
          <span>Learn More</span>
        </Link>
      </div>
    </div>
  )
}

export default CourseCard