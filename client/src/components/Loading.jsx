import React from 'react'
import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="chat-bubble-bot">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          <span className="text-gray-600">AI is thinking...</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Loading