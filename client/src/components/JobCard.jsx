import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Building, ExternalLink } from 'lucide-react'

const JobCard = ({ job }) => {
  const {
    _id,
    title,
    company,
    location,
    salary,
    jobType,
    requiredSkills,
    applicationDeadline,
    createdAt
  } = job

  const formatSalary = (min, max) => {
    const formatAmount = (amount) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(1)}L`
      }
      return `${amount / 1000}K`
    }
    return `₹${formatAmount(min)} - ₹${formatAmount(max)}`
  }

  const getDaysAgo = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  const getDaysLeft = (date) => {
    const days = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Expired'
    if (days === 0) return 'Today'
    if (days === 1) return '1 day left'
    return `${days} days left`
  }

  const workTypeColors = {
    'Full-time': 'bg-green-100 text-green-800',
    'Part-time': 'bg-blue-100 text-blue-800',
    'Contract': 'bg-purple-100 text-purple-800',
    'Internship': 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={company.logo || 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?w=60'}
            alt={company.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-gray-600 font-medium">{company.name}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">{getDaysAgo(createdAt)}</span>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{location.city}, {location.state}</span>
          </div>
          {location.isRemote && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Remote
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>{formatSalary(salary.min, salary.max)} per year</span>
          </div>
          <div className="flex items-center space-x-1">
            <Building className="h-4 w-4" />
            <span>{jobType}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${workTypeColors[location.workType] || 'bg-gray-100 text-gray-800'}`}>
            {location.workType}
          </span>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span className={getDaysLeft(applicationDeadline) === 'Expired' ? 'text-red-600' : ''}>
              {getDaysLeft(applicationDeadline)}
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {requiredSkills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {requiredSkills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t flex justify-between items-center">
        <Link
          to={`/jobs/${_id}`}
          className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-200"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Details</span>
        </Link>
        
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium">
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default JobCard