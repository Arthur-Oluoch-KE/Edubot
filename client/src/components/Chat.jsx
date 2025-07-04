import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Input from './Input'
import Loading from './Loading'
import SubjectSelector from './SubjectSelector'
import { askQuestion } from '../api'
import { validateInput, detectMathQuestion } from '../utils/validation'

const Chat = () => {
  const [messages, setMessages] = useState([
    
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('general')

  const handleSendMessage = async (question) => {
    if (!question.trim()) return

    // Validate input
    const validation = validateInput(question)
    if (!validation.isValid) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        content: validation.error,
        subject: 'general'
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    // Auto-detect math questions if subject is general
    let finalSubject = selectedSubject
    if (selectedSubject === 'general' && detectMathQuestion(question)) {
      finalSubject = 'math'
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      subject: finalSubject
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await askQuestion(question, finalSubject)
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        subject: finalSubject,
        model: response.model
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Sorry, I'm having trouble right now: ${error.message}\n\nPlease try asking your question again! 🤔`,
        subject: 'general'
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowUp = (action, originalMessage) => {
    const followUpQuestions = {
      'explain': `Can you explain "${originalMessage}" in simpler terms?`,
      'hint': `Can you give me a hint about "${originalMessage}"?`,
      'example': `Can you give me an example related to "${originalMessage}"?`,
      'steps': `Can you break down "${originalMessage}" into steps?`
    }
    
    if (followUpQuestions[action]) {
      handleSendMessage(followUpQuestions[action])
    }
  }

  const getBubbleClass = (message) => {
    if (message.type === 'user') return 'chat-bubble-user'
    
    switch (message.subject) {
      case 'math': return 'chat-bubble-math'
      case 'science': return 'chat-bubble-science'
      case 'history': return 'chat-bubble-history'
      case 'language': return 'chat-bubble-language'
      default: return 'chat-bubble-bot'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">EduBot</h3>
              <p className="text-green-500 text-primary-100 text-sm">Dual AI tutoring system</p>
            </div>
          </div>
          <div className="text-white text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-success-400 rounded-full"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-md">
                <div className={getBubbleClass(message)}>
                  {message.model && (
                    <div className="text-xs opacity-70 mb-1">
                      {message.model === 'mathstral' ? '🧮 Mathstral' : '🌟 Grok'}
                    </div>
                  )}
                  <div className="whitespace-pre-line">{message.content}</div>
                </div>
                
                {/* Follow-up buttons for bot messages */}
                {message.type === 'bot' && message.id !== 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    <button
                      onClick={() => handleFollowUp('explain', message.content)}
                      className="follow-up-button bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    >
                      Explain again
                    </button>
                    <button
                      onClick={() => handleFollowUp('hint', message.content)}
                      className="follow-up-button bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                    >
                      Give a hint
                    </button>
                    <button
                      onClick={() => handleFollowUp('example', message.content)}
                      className="follow-up-button bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                    >
                      Show example
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && <Loading />}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <SubjectSelector 
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
        />
        <Input onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </motion.div>
  )
}

export default Chat