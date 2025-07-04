import React from 'react'
import { motion } from 'framer-motion'

const subjects = [
  { id: 'general', name: 'General', icon: '🌟', color: 'primary' },
  { id: 'math', name: 'Math', icon: '🧮', color: 'math' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'science' },
  { id: 'history', name: 'History', icon: '📚', color: 'history' },
  { id: 'language', name: 'Language', icon: '✍️', color: 'language' }
]

const SubjectSelector = ({ selectedSubject, onSubjectChange }) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Choose your subject:</p>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <motion.button
            key={subject.id}
            onClick={() => onSubjectChange(subject.id)}
            className={`subject-button ${
              selectedSubject === subject.id
                ? `bg-${subject.color}-500 text-white shadow-lg`
                : `bg-${subject.color}-100 text-${subject.color}-700 hover:bg-${subject.color}-200`
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="mr-1">{subject.icon}</span>
            {subject.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SubjectSelector