import React, { useState, useEffect } from 'react'
import { ProcessedFile } from '../../types/types'

interface FilePreviewProps {
  file: ProcessedFile
  onClose: () => void
  onStartTyping: () => void
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose, onStartTyping }) => {
  const [previewContent, setPreviewContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 生成预览内容（前500字符）
    const content = file.content.length > 500 
      ? file.content.substring(0, 500) + '...'
      : file.content
    setPreviewContent(content)
    setIsLoading(false)
  }, [file])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'txt': return '📄'
      case 'epub': return '📚'
      case 'doc': return '📝'
      case 'docx': return '📝'
      case 'pdf': return '📋'
      case 'rtf': return '📄'
      case 'odt': return '📄'
      case 'html': return '🌐'
      case 'md': return '📝'
      default: return '📄'
    }
  }

  const getFileTypeName = (type: string) => {
    switch (type) {
      case 'txt': return '纯文本文件'
      case 'epub': return '电子书'
      case 'doc': return 'Word文档'
      case 'docx': return 'Word文档'
      case 'pdf': return 'PDF文档'
      case 'rtf': return '富文本文件'
      case 'odt': return 'OpenDocument'
      case 'html': return '网页文件'
      case 'md': return 'Markdown文件'
      default: return '未知格式'
    }
  }

  const formatFileSize = (content: string) => {
    const bytes = new Blob([content]).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (isLoading) {
    return (
      <div className="file-preview-overlay">
        <div className="file-preview-loading">
          <div className="spinner"></div>
          <p>正在加载预览...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="file-preview-overlay" onClick={onClose}>
      <div className="file-preview-modal" onClick={e => e.stopPropagation()}>
        <div className="file-preview-header">
          <div className="file-info">
            <span className="file-icon">{getFileIcon(file.type)}</span>
            <div className="file-details">
              <h3>{file.title}</h3>
              <p className="file-meta">
                {getFileTypeName(file.type)} • {formatFileSize(file.content)} • {file.content.length} 字符
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="file-preview-content">
          <div className="preview-text">
            <pre>{previewContent}</pre>
          </div>
          
          {file.content.length > 500 && (
            <div className="preview-note">
              <p>⚠️ 预览仅显示前500字符，完整内容将在打字练习中显示</p>
            </div>
          )}
        </div>

        <div className="file-preview-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          <button className="btn btn-primary" onClick={onStartTyping}>
            开始打字练习
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilePreview
