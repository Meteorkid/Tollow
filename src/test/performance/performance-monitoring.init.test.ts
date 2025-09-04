import { describe, it, expect, beforeAll } from 'vitest'
import { performanceMonitoring } from '../../services/performanceMonitoringService'

describe('performanceMonitoring initialize', () => {
  beforeAll(async () => {
    await performanceMonitoring.initialize()
  })

  it('should initialize without throwing', async () => {
    expect(typeof performanceMonitoring.getMetrics).toBe('function')
  })
})
