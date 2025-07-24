import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Minimize2, MessageCircle } from 'lucide-react'
import axios from 'axios'
import { translateText } from '../utils/translate';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' }
];

const AITutorChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI tutor powered by advanced AI. I'm here to help you with your learning journey. Ask me about courses, careers, programming, or any study topics! 🚀",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [targetLang, setTargetLang] = useState('en');
  const [apiKey, setApiKey] = useState(''); // Set this from props or context if needed
  const [translatedMessage, setTranslatedMessage] = useState('');
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        message: inputMessage,
        context: 'learning_assistance'
      })

      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.data.response,
        sender: 'ai',
        timestamp: new Date(),
        aiProvider: response.data.data.aiProvider
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.fallbackResponse || "I'm having some technical difficulties. Please try again in a moment! 😊",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  // Translation handler
  const handleTranslate = async (text) => {
    if (targetLang === 'en') {
      setTranslatedMessage(text);
      return;
    }
    try {
      setTranslatedMessage('Translating...');
      const translated = await translateText(text, targetLang, apiKey);
      setTranslatedMessage(translated);
    } catch (err) {
      setTranslatedMessage('Translation failed.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 z-40 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-40 flex flex-col">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Tutor (Enhanced)</span>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-primary-700 p-1 rounded"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-primary-700 p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'ai' && (
                  <Bot className="h-4 w-4 mt-0.5 text-primary-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                    {message.aiProvider && message.sender === 'ai' && (
                      <span className="ml-2 opacity-75">• {message.aiProvider}</span>
                    )}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <User className="h-4 w-4 mt-0.5 text-primary-100" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-primary-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • Powered by OpenAI • Responses may take a moment
        </p>
      </div>

      {/* Translation Feature */}
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor="lang-select" className="text-sm">Translate to:</label>
        <select id="lang-select" value={targetLang} onChange={e => setTargetLang(e.target.value)} className="border rounded px-2 py-1">
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </div>
      {/* Show last AI message with translation option */}
      {messages.length > 0 && messages[messages.length-1].sender === 'ai' && (
        <div className="mt-2">
          <button className="btn-secondary mb-2" onClick={() => handleTranslate(messages[messages.length-1].text)}>
            Translate Last AI Response
          </button>
          {translatedMessage && (
            <div className="bg-gray-100 p-2 rounded text-sm">
              <strong>Translation:</strong> {translatedMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AITutorChatWindow