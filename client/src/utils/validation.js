// Basic client-side validation
export const validateInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Please enter a valid question' }
  }

  if (input.trim().length < 3) {
    return { isValid: false, error: 'Question is too short' }
  }

  if (input.trim().length > 1000) {
    return { isValid: false, error: 'Question is too long' }
  }

  // Basic inappropriate content detection
  const inappropriateWords = [
    'violence', 'weapon', 'hurt', 'kill', 'hate', 'stupid', 'dumb', 'idiot'
  ]
  
  const lowerInput = input.toLowerCase()
  const hasInappropriateContent = inappropriateWords.some(word => 
    lowerInput.includes(word)
  )

  if (hasInappropriateContent) {
    return { 
      isValid: false, 
      error: 'Please ask educational questions that are appropriate for school' 
    }
  }

  return { isValid: true }
}

// Detect if question is math-related
export const detectMathQuestion = (question) => {
  const mathKeywords = [
    'solve', 'calculate', 'equation', 'formula', 'math', 'algebra', 'geometry',
    'arithmetic', 'fraction', 'decimal', 'percentage', 'graph', 'function',
    'derivative', 'integral', 'theorem', 'proof', 'angle', 'triangle',
    'circle', 'square', 'rectangle', 'volume', 'area', 'perimeter',
    'probability', 'statistics', 'mean', 'median', 'mode', 'sum', 'product',
    'difference', 'quotient', 'multiply', 'divide', 'add', 'subtract',
    'plus', 'minus', 'times', 'equals', 'number', 'digit', 'integer'
  ]
  
  const lowerQuestion = question.toLowerCase()
  return mathKeywords.some(keyword => lowerQuestion.includes(keyword))
}