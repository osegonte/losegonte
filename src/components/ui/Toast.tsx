import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertCircle, Info } from 'lucide-react'
import { useEffect } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastProps = {
  message: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const icons = {
    success: <Check size={20} />,
    error: <X size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />
  }

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-orange-600',
    info: 'bg-blue-600'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed top-[120px] left-1/2 transform -translate-x-1/2 z-50 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 max-w-md`}
        >
          {icons[type]}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast