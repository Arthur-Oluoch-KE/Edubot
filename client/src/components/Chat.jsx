import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from './Input';
import Loading from './Loading';
import SubjectSelector from './SubjectSelector';
import { askQuestion } from '../api';
import { validateInput, detectMathQuestion } from '../utils/validation';

const Chat = () => {
   const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('edubotMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
    
  const handleSendMessage = async (question) => {
    if (!question.trim()) return;

    // Validate input
    const validation = validateInput(question);
    if (!validation.isValid) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        content: validation.error,
        subject: 'general',
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Auto-detect math questions if subject is general
    let finalSubject = selectedSubject;
    if (selectedSubject === 'general' && detectMathQuestion(question)) {
      finalSubject = 'math';
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      subject: finalSubject,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askQuestion(question, finalSubject);
      console.log('API response:', response); // Debug

      // Handle response (string or object with answer)
      const answer = typeof response === 'string' ? response : response.answer || 'No response received';
      const model = finalSubject === 'math' ? 'mathstral' : 'grok'; // Fallback model assignment

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: answer,
        subject: finalSubject,
        model,
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error.message); // Debug
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Sorry, I'm having trouble right now: ${error.message}\n\nPlease try asking your question again! 🤔`,
        subject: 'general',
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = (action, originalMessage) => {
    const followUpQuestions = {
      'explain': `Can you explain "${originalMessage}" in simpler terms?`,
      'hint': `Can you give me a hint about "${originalMessage}"?`,
      'example': `Can you give an example related to "${originalMessage}"?`,
      'steps': `Can you break down "${originalMessage}" into steps?`,
    };
    
    if (followUpQuestions[action]) {
      handleSendMessage(followUpQuestions[action]);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('edubotMessages');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black rounded-3xl shadow-2xl w-full max-w-4xl mx-auto sm:mx-4 my-4 min-h-[80vh] flex flex-col"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">EduBot</h3>
              <p className="text-green-400 text-xs sm:text-sm">Dual AI tutoring system</p>
            </div>
          </div>
          <div className="text-white text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 text-sm sm:text-base"
            >
              How can I help you today!
            </motion.div>
          )}
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="w-full max-w-[90%] sm:max-w-xs">
                <div className={
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white rounded-lg p-2 sm:p-3 ml-auto text-sm sm:text-base'
                    : message.subject === 'math' 
                      ? 'bg-green-200 text-black rounded-lg p-2 sm:p-3 mr-auto text-sm sm:text-base'
                      : message.subject === 'science'
                        ? 'bg-blue-200 text-black rounded-lg p-2 sm:p-3 mr-auto text-sm sm:text-base'
                        : message.subject === 'history'
                          ? 'bg-yellow-200 text-black rounded-lg p-2 sm:p-3 mr-auto text-sm sm:text-base'
                          : message.subject === 'language'
                            ? 'bg-purple-200 text-black rounded-lg p-2 sm:p-3 mr-auto text-sm sm:text-base'
                            : 'bg-gray-200 text-black rounded-lg p-2 sm:p-3 mr-auto text-sm sm:text-base'
                }>
                  {message.model && (
                    <div className="text-xs opacity-70 mb-1">
                      {message.model === 'mathstral' ? '🧮 Mistralai' : '🌟 Open Router'}
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
                    className="flex flex-wrap gap-2 mt-2 justify-start sm:justify-start"
                  >
                    <button
                      onClick={() => handleFollowUp('explain', message.content)}
                      className="px-2 py-1 rounded-md text-xs sm:text-sm border bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    >
                      Explain again
                    </button>
                    <button
                      onClick={() => handleFollowUp('hint', message.content)}
                      className="px-2 py-1 rounded-md text-xs sm:text-sm border bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                    >
                      Give a hint
                    </button>
                    <button
                      onClick={() => handleFollowUp('example', message.content)}
                      className="px-2 py-1 rounded-md text-xs sm:text-sm border bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
          <div className="w-full sm:w-auto">
            <SubjectSelector 
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
            />
          </div>
          <button
            onClick={handleClearHistory}
            className="px-2 py-1 rounded-md text-xs sm:text-sm border bg-red-50 text-red-600 border-red-200 hover:bg-red-100 w-full sm:w-auto"
          >
            Clear Chat History
          </button>
        </div>
        <Input onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </motion.div>
  );
};

export default Chat;