import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Input = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full p-2 text-sm sm:p-3 sm:text-base rounded-md border"
      whileHover={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me about math, science, history, or language arts!"
        className="w-full p-4 pl-14 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 active:ring-blue-300"
        disabled={disabled}
        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
      />
      <motion.button
        type="submit"
        disabled={disabled || !message.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </motion.button>
    </motion.form>
  )
}

export default Input