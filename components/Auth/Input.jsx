import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import { useField } from 'formik'
import PropTypes from 'prop-types'

const Input = ({ type = '', label = '', className = '', ...props }) => {
  const [field, meta] = useField(props)
  const error = meta?.touched && meta?.error

  return (
    <div className={classNames(className, 'flex flex-col space-y-1')}>
      {label ? (
        <label htmlFor="email" className="text-gray-600">
          {label}
        </label>
      ) : null}

      <div className="flex-1">
        {type === 'textarea' ? (
          <textarea
            {...field}
            {...props}
            className={classNames(
              'w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400'
                : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400'
            )}
          />
        ) : (
          <div className="relative">
            <input
              {...field}
              {...props}
              type={type}
              className={classNames(
                'w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400'
              )}
            />
            {error && type !== 'number' ? (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 pr-2">
                <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
              </span>
            ) : null}
          </div>
        )}
      </div>

      {error ? (
        <p name="email" className="text-sm text-red-600 first-letter:uppercase">
          {error}
        </p>
      ) : null}
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
}

export default Input
