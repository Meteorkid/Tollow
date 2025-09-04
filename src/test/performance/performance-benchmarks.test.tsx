import React from 'react'
import { render } from '@testing-library/react'
import { createTestStore } from '../test-utils'
import Library from '../../features/library/Library'
import Upload from '../../features/upload/Upload'
import Practice from '../../features/typing/Practice'
import Profile from '../../features/profile/Profile'
import Settings from '../../features/settings/Settings'
import { describe, it, expect, beforeEach } from 'vitest'

// 性能基准配置
const PERFORMANCE_THRESHOLDS = {
  // 组件首次渲染时间阈值（毫秒）
  FIRST_RENDER: 100,
  // 组件重新渲染时间阈值（毫秒）
  RE_RENDER: 50,
  // 内存使用阈值（MB）
  MEMORY_USAGE: 50,
  // 组件挂载时间阈值（毫秒）
  MOUNT_TIME: 200,
}

// 性能测量工具
const measurePerformance = (component: React.ReactElement, testName: string) => {
  const startTime = performance.now()
  const startMemory = (performance as any).memory?.usedJSHeapSize || 0
  
  const { unmount } = render(component)
  
  const mountTime = performance.now() - startTime
  const endMemory = (performance as any).memory?.usedJSHeapSize || 0
  const memoryUsage = (endMemory - startMemory) / (1024 * 1024) // 转换为MB
  
  unmount()
  
  return {
    mountTime,
    memoryUsage,
    testName,
  }
}

// 批量性能测试
const runPerformanceTests = (components: Array<{ component: React.ReactElement; name: string }>) => {
  const results: Array<{ mountTime: number; memoryUsage: number; testName: string; passed: boolean }> = []
  
  components.forEach(({ component, name }) => {
    const result = measurePerformance(component, name)
    const passed = result.mountTime <= PERFORMANCE_THRESHOLDS.FIRST_RENDER
    
    results.push({
      ...result,
      passed,
    })
    
    // 输出性能结果
    console.log(`Performance Test: ${name}`)
    console.log(`  Mount Time: ${result.mountTime.toFixed(2)}ms`)
    console.log(`  Memory Usage: ${result.memoryUsage.toFixed(2)}MB`)
    console.log(`  Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`)
  })
  
  return results
}

describe('Performance Benchmarks', () => {
  beforeEach(() => {
    createTestStore()
  })

  it('should meet first render performance thresholds', () => {
    const components = [
      { component: React.createElement(Library), name: 'Library' },
      { component: React.createElement(Upload), name: 'Upload' },
      { component: React.createElement(Practice), name: 'Practice' },
      { component: React.createElement(Profile), name: 'Profile' },
      { component: React.createElement(Settings), name: 'Settings' },
    ]
    
    const results = runPerformanceTests(components)
    
    // 检查所有组件都通过了性能测试
    const failedTests = results.filter(result => !result.passed)
    
    if (failedTests.length > 0) {
      console.warn('Performance test failures:', failedTests)
    }
    
    expect(failedTests.length).toBe(0)
  })

  it('should meet memory usage thresholds', () => {
    const components = [
      { component: React.createElement(Library), name: 'Library' },
      { component: React.createElement(Upload), name: 'Upload' },
      { component: React.createElement(Practice), name: 'Practice' },
      { component: React.createElement(Profile), name: 'Profile' },
      { component: React.createElement(Settings), name: 'Settings' },
    ]
    
    const results = runPerformanceTests(components)
    
    // 检查内存使用是否在阈值内
    const memoryFailures = results.filter(result => result.memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_USAGE)
    
    if (memoryFailures.length > 0) {
      console.warn('Memory usage failures:', memoryFailures)
    }
    
    expect(memoryFailures.length).toBe(0)
  })

  it('should meet mount time thresholds', () => {
    const components = [
      { component: React.createElement(Library), name: 'Library' },
      { component: React.createElement(Upload), name: 'Upload' },
      { component: React.createElement(Practice), name: 'Practice' },
      { component: React.createElement(Profile), name: 'Profile' },
      { component: React.createElement(Settings), name: 'Settings' },
    ]
    
    const results = runPerformanceTests(components)
    
    // 检查挂载时间是否在阈值内
    const mountFailures = results.filter(result => result.mountTime > PERFORMANCE_THRESHOLDS.MOUNT_TIME)
    
    if (mountFailures.length > 0) {
      console.warn('Mount time failures:', mountFailures)
    }
    
    expect(mountFailures.length).toBe(0)
  })

  it('should have consistent performance across multiple renders', () => {
    const component = React.createElement(Library)
    const iterations = 5
    const times: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      const { unmount } = render(component)
      const renderTime = performance.now() - startTime
      times.push(renderTime)
      unmount()
    }
    
    // 计算平均渲染时间
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
    
    // 检查平均时间是否在阈值内
    expect(averageTime).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.FIRST_RENDER)
    
    // 检查时间一致性（标准差不应过大）
    const variance = times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / times.length
    const standardDeviation = Math.sqrt(variance)
    
    // 标准差不应超过平均时间的50%
    expect(standardDeviation).toBeLessThanOrEqual(averageTime * 0.5)
  })
})
