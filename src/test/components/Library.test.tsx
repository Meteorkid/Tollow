import React from 'react'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { createTestStore } from '../test-utils'
import Library from '../../features/library/Library'
import { useAppStore } from '../../stores/appStore'
import { vi } from 'vitest'

// Mock React Router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock logger
vi.mock('../../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Library Component', () => {
  beforeEach(() => {
    createTestStore()
    mockNavigate.mockClear()
  })

  it('renders library header correctly', () => {
    render(<Library />)
    
    expect(screen.getByText('📚 书库')).toBeInTheDocument()
    expect(screen.getByText('选择您喜欢的文本开始打字练习')).toBeInTheDocument()
    expect(screen.getByText('📁 上传文件')).toBeInTheDocument()
  })

  it('displays book cards with correct information', () => {
    render(<Library />)
    
    // 检查书籍信息
    expect(screen.getByText('经典文学作品')).toBeInTheDocument()
    expect(screen.getByText('编程入门指南')).toBeInTheDocument()
    expect(screen.getByText('英语学习材料')).toBeInTheDocument()
    
    // 检查作者信息
    expect(screen.getByText('作者: 经典作家')).toBeInTheDocument()
    expect(screen.getByText('作者: 技术专家')).toBeInTheDocument()
    expect(screen.getByText('作者: 语言教师')).toBeInTheDocument()
  })

  it('navigates to upload page when upload button is clicked', () => {
    render(<Library />)
    
    const uploadButton = screen.getByText('📁 上传文件')
    fireEvent.click(uploadButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/upload')
  })

  it('navigates to practice page when a book is selected', async () => {
    render(<Library />)
    
    const bookCard = screen.getByText('经典文学作品').closest('.book-card')
    expect(bookCard).toBeInTheDocument()
    
    if (bookCard) {
      fireEvent.click(bookCard)
    }
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/practice')
    })
  })

  it('updates app store when book is selected', async () => {
    render(<Library />)
    
    const bookCard = screen.getByText('经典文学作品').closest('.book-card')
    expect(bookCard).toBeInTheDocument()
    
    if (bookCard) {
      fireEvent.click(bookCard)
    }
    
    await waitFor(() => {
      const { currentText } = useAppStore.getState()
      expect(currentText).toBeTruthy()
      expect(currentText?.title).toBe('经典文学作品')
      expect(currentText?.type).toBe('text')
    })
  })

  it('displays book difficulty levels correctly', () => {
    render(<Library />)
    
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('displays word count information', () => {
    render(<Library />)
    
    expect(screen.getByText('5000 字')).toBeInTheDocument()
    expect(screen.getByText('3000 字')).toBeInTheDocument()
    expect(screen.getByText('2000 字')).toBeInTheDocument()
  })

  it('displays language information correctly', () => {
    render(<Library />)
    
    expect(screen.getByText('中文')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('generates appropriate content for different difficulty levels', async () => {
    render(<Library />)
    
    const easyBook = screen.getByText('编程入门指南').closest('.book-card')
    const mediumBook = screen.getByText('经典文学作品').closest('.book-card')
    
    if (easyBook) {
      fireEvent.click(easyBook)
    }
    
    await waitFor(() => {
      const { currentText } = useAppStore.getState()
      expect(currentText?.content).toContain('入门级')
    })
    
    // 重置状态
    useAppStore.getState().setCurrentText(null)
    
    if (mediumBook) {
      fireEvent.click(mediumBook)
    }
    
    await waitFor(() => {
      const { currentText } = useAppStore.getState()
      expect(currentText?.content).toContain('中级')
    })
  })
})
