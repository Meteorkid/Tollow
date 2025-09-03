import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useAppStore } from '../stores/appStore'

// 测试用的Provider组件
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

// 自定义渲染函数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// 测试用的store状态
export const createTestStore = () => {
  const initialState = {
    currentView: 'library' as const,
    currentText: null,
    user: null,
    settings: {
      theme: 'light' as const,
      language: 'zh-CN' as const,
      soundEnabled: true,
      keyboardLayout: 'qwerty' as const,
      showProgressBar: true,
      autoSave: true,
    },
    typingState: {
      isStarted: false,
      isPaused: false,
      startTime: 0,
      currentPosition: 0,
      wpm: 0,
      accuracy: 100,
      errors: 0,
    },
    history: {
      recentTexts: [],
      practiceSessions: [],
    },
  }

  // 重置store到初始状态
  useAppStore.setState(initialState)
  
  return initialState
}

// 模拟用户数据
export const mockUser = {
  id: 'test-user-1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: 'https://via.placeholder.com/150',
  preferences: {
    theme: 'light',
    language: 'zh-CN',
    soundEnabled: true,
    keyboardLayout: 'qwerty',
  },
  stats: {
    totalPracticeTime: 3600,
    totalWordsTyped: 10000,
    averageWPM: 45,
    averageAccuracy: 95,
    practiceStreak: 7,
  },
  achievements: [],
  createdAt: new Date('2024-01-01'),
  lastActive: new Date(),
}

// 模拟文本内容
export const mockTextContent = {
  title: '测试文本',
  content: '这是一个用于测试的文本内容，包含了足够多的字符来进行打字练习。',
  source: 'test.txt',
  type: 'text' as const,
}

// 模拟打字统计数据
export const mockTypingStats = {
  wpm: 45,
  accuracy: 95,
  errors: 2,
  totalTime: 120,
  charactersTyped: 90,
  charactersTotal: 95,
}

// 导出所有测试工具
export * from '@testing-library/react'
export { customRender as render }
