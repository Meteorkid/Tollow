import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../styles/index.css'

// 导入国际化配置
import './i18n'
import { initializeLanguage } from '../i18n'

// 导入分析服务
import { analytics } from '../services/analyticsService'
import { performanceMonitoring } from '../services/performanceMonitoringService'
import { securityService } from '../services/securityService'

// 导入错误监控
import { errorMonitoring } from '../services/errorMonitoringService'

// 初始化应用
async function initializeApp() {
  try {
    // 初始化国际化
    await initializeLanguage()
    
    // 初始化分析服务
    await analytics.initialize()
    
    // 初始化性能监控
    await performanceMonitoring.initialize()
    
    // 初始化安全服务
    await securityService.initialize()
    
    // 初始化错误监控
    errorMonitoring.addBreadcrumb('app_start', 'application', { timestamp: new Date().toISOString() })
    
    console.log('🚀 Tollow 应用初始化完成')
  } catch (error) {
    console.error('❌ 应用初始化失败:', error)
  }
}

// 启动应用
initializeApp().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
