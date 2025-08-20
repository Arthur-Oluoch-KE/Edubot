import React from 'react'
import { motion } from 'framer-motion'
import Chat from './components/Chat'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 max-w-5xl"
      >
        <motion.header 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            🤖 EduBot
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your AI-powered homework helper with specialized tutors!
          </p>
          <p className="text-md text-gray-500">
            EduBot is your go-to for Math and general questions, delivering clear, reliable answers to help you learn and grow!🌟
          </p>
        </motion.header>
        
        <Chat />
      </motion.div>
    </div>
  )
}

export default App