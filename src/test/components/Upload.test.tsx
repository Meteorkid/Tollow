import React from 'react'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { createTestStore } from '../test-utils'
import Upload from '../../features/upload/Upload'
import { useAppStore } from '../../stores/appStore'

// Mock React Router
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock FileUpload component
jest.mock('../../features/upload/FileUpload', () => {
  return function MockFileUpload({ onFileUpload, onBack }: any) {
    return (
      <div data-testid="file-upload">
        <button onClick={() => onFileUpload({ title: 'Test File', content: 'Test content', type: 'text' })}>
          Mock Upload
        </button>
        <button onClick={onBack}>Mock Back</button>
      </div>
    )
  }
})

describe('Upload Component', () => {
  beforeEach(() => {
    createTestStore()
    mockNavigate.mockClear()
  })

  it('renders upload header correctly', () => {
    render(<Upload />)
    
    expect(screen.getByText('📁 文件上传')).toBeInTheDocument()
    expect(screen.getByText('上传您的文档文件进行打字练习')).toBeInTheDocument()
    expect(screen.getByText('← 返回书库')).toBeInTheDocument()
  })

  it('navigates back to library when back button is clicked', () => {
    render(<Upload />)
    
    const backButton = screen.getByText('← 返回书库')
    fireEvent.click(backButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/library')
  })

  it('handles file upload and navigates to practice', async () => {
    render(<Upload />)
    
    const mockUploadButton = screen.getByText('Mock Upload')
    fireEvent.click(mockUploadButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/practice')
    })
  })

  it('updates app store when file is uploaded', async () => {
    render(<Upload />)
    
    const mockUploadButton = screen.getByText('Mock Upload')
    fireEvent.click(mockUploadButton)
    
    await waitFor(() => {
      const { currentText } = useAppStore.getState()
      expect(currentText).toBeTruthy()
      expect(currentText?.title).toBe('Test File')
      expect(currentText?.content).toBe('Test content')
      expect(currentText?.type).toBe('text')
    })
  })

  it('adds file to recent texts when uploaded', async () => {
    render(<Upload />)
    
    const mockUploadButton = screen.getByText('Mock Upload')
    fireEvent.click(mockUploadButton)
    
    await waitFor(() => {
      const { history } = useAppStore.getState()
      expect(history.recentTexts).toHaveLength(1)
      expect(history.recentTexts[0].title).toBe('Test File')
    })
  })

  it('renders FileUpload component', () => {
    render(<Upload />)
    
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
  })
})
