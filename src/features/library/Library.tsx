import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { useAppStore } from '../../stores/appStore'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'
import { logger } from '../../utils/logger'

const Library: React.FC = () => {
  const navigate = useNavigate()
  const { currentText, setCurrentText, addRecentText } = useAppStore()
  
  // 性能监控
  usePerformanceMonitor('Library')
  
  // 模拟书籍数据
  const books = [
    {
      id: '1',
      title: '经典文学作品',
      author: '经典作家',
      description: '一部经典文学作品，适合打字练习',
      cover: '📚',
      wordCount: 5000,
      difficulty: 'Medium' as const,
      language: 'zh-CN',
    },
    {
      id: '2',
      title: '编程入门指南',
      author: '技术专家',
      description: '编程基础知识，技术文档打字练习',
      cover: '💻',
      wordCount: 3000,
      difficulty: 'Easy' as const,
      language: 'zh-CN',
    },
    {
      id: '3',
      title: '英语学习材料',
      author: '语言教师',
      description: '英语学习文本，提升英文打字能力',
      cover: '🌍',
      wordCount: 2000,
      difficulty: 'Easy' as const,
      language: 'en-US',
    },
  ]

  const handleBookSelect = (book: typeof books[0]) => {
    try {
      const textContent = {
        title: book.title,
        content: generateBookContent(book),
        source: book.title,
        type: 'text' as const,
      }
      
      setCurrentText(textContent)
      addRecentText(textContent)
      
      logger.info('选择书籍', { bookId: book.id, bookTitle: book.title })
      
      navigate(ROUTES.PRACTICE)
    } catch (error) {
      logger.error('选择书籍失败', { error, book })
    }
  }

  const handleFileUpload = () => {
    navigate(ROUTES.UPLOAD)
  }

  const generateBookContent = (book: typeof books[0]): string => {
    const paragraphs = [
      `《${book.title}》是一部${book.difficulty === 'Easy' ? '入门级' : book.difficulty === 'Medium' ? '中级' : '高级'}作品，作者${book.author}以其独特的笔触描绘了一个引人入胜的故事。`,
      '在这个故事中，读者将跟随主人公经历各种挑战和冒险，感受人生的酸甜苦辣。',
      '作者通过细腻的描写和深刻的思想内涵，让读者在阅读过程中获得深刻的思考和感悟。',
      '这部作品不仅具有很高的文学价值，更是一部能够启迪人心的佳作。',
      '无论是初次阅读还是反复品味，都能从中获得新的收获和体会。'
    ]
    return paragraphs.join('\n\n')
  }

  return (
    <div className="library">
      <div className="library-header">
        <h1>📚 书库</h1>
        <p>选择您喜欢的文本开始打字练习</p>
        <button onClick={handleFileUpload} className="btn btn-primary">
          📁 上传文件
        </button>
      </div>

      <div className="library-content">
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookSelect(book)}>
              <div className="book-cover">{book.cover}</div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">作者: {book.author}</p>
                <p className="book-description">{book.description}</p>
                <div className="book-meta">
                  <span className="difficulty difficulty-{book.difficulty.toLowerCase()}">
                    {book.difficulty}
                  </span>
                  <span className="word-count">{book.wordCount} 字</span>
                  <span className="language">{book.language === 'zh-CN' ? '中文' : 'English'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Library
