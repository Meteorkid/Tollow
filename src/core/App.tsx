import React, { useState } from 'react'
import Header from '../shared/layout/Header'
import BookLibrary from '../features/library/BookLibrary'
import FileUpload from '../features/upload/FileUpload'
import TypingPractice from '../features/typing/TypingPractice'
import { TextContent } from '../types/types'

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover: string
  wordCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  language: string
}

type AppView = 'library' | 'upload' | 'practice'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('library')
  const [currentText, setCurrentText] = useState<TextContent | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book)
    const textContent: TextContent = {
      title: book.title,
      content: generateBookContent(book),
      source: book.title,
      type: 'text'
    }
    setCurrentText(textContent)
    setCurrentView('practice')
  }

  const handleFileUpload = () => {
    setCurrentView('upload')
  }

  const handleFileProcessed = (textContent: TextContent) => {
    setCurrentText(textContent)
    setCurrentView('practice')
  }

  const handleBackToLibrary = () => {
    setCurrentView('library')
    setCurrentText(null)
    setSelectedBook(null)
  }

  const generateBookContent = (book: Book): string => {
    // 生成示例文本内容
    const paragraphs = [
      `《${book.title}》是一部经典文学作品，作者${book.author}以其独特的笔触描绘了一个引人入胜的故事。`,
      '在这个故事中，读者将跟随主人公经历各种挑战和冒险，感受人生的酸甜苦辣。',
      '作者通过细腻的描写和深刻的思想内涵，让读者在阅读过程中获得深刻的思考和感悟。',
      '这部作品不仅具有很高的文学价值，更是一部能够启迪人心的佳作。',
      '无论是初次阅读还是反复品味，都能从中获得新的收获和体会。'
    ]
    return paragraphs.join('\n\n')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'library':
        return <BookLibrary onBookSelect={handleBookSelect} onFileUpload={handleFileUpload} />
      case 'upload':
        return <FileUpload onFileUpload={handleFileProcessed} onBack={() => setCurrentView('library')} />
      case 'practice':
        return currentText ? <TypingPractice textContent={currentText} onBack={handleBackToLibrary} /> : null
      default:
        return null
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        {renderCurrentView()}
      </div>
    </div>
  )
}

export default App
