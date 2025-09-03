import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { useAppStore } from '../../stores/appStore'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'
import { logger } from '../../utils/logger'
import TypingPractice from './TypingPractice'

const Practice: React.FC = () => {
  const navigate = useNavigate()
  const { currentText, setCurrentText } = useAppStore()
  
  // 性能监控
  usePerformanceMonitor('Practice')
  
  const handleBack = () => {
    setCurrentText(null)
    navigate(ROUTES.LIBRARY)
  }

  if (!currentText) {
    return (
      <div className="practice-error">
        <h2>❌ 没有可练习的文本</h2>
        <p>请先选择一本书或上传文件</p>
        <button onClick={handleBack} className="btn btn-primary">
          返回书库
        </button>
      </div>
    )
  }

  return (
    <div className="practice-page">
      <div className="practice-header">
        <button onClick={handleBack} className="btn btn-secondary">
          ← 返回书库
        </button>
        <h1>⌨️ 打字练习</h1>
        <p>正在练习: {currentText.title}</p>
      </div>
      
      <TypingPractice textContent={currentText} onBack={handleBack} />
    </div>
  )
}

export default Practice
