import React, { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '../../stores/appStore'
import { analytics, UserMetrics } from '../../services/analyticsService'
import { logger } from '../../utils/logger'

interface AnalyticsDashboardProps {
  className?: string
  showRealTime?: boolean
  refreshInterval?: number
}

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }>
}

interface TimeSeriesData {
  timestamp: string
  value: number
  label: string
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = '',
  showRealTime = true,
  refreshInterval = 30000,
}) => {
  const { user } = useAppStore()
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // 获取用户指标
  const fetchMetrics = useMemo(() => async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userMetrics = analytics.getUserMetrics(user?.id)
      setMetrics(userMetrics)
      setLastUpdate(new Date())

      logger.debug('Analytics metrics fetched', { metrics: userMetrics })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取指标失败'
      setError(errorMessage)
      logger.error('Failed to fetch analytics metrics', { error: err })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // 初始化数据获取
  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  // 实时更新
  useEffect(() => {
    if (!showRealTime) return

    const interval = setInterval(fetchMetrics, refreshInterval)
    return () => clearInterval(interval)
  }, [showRealTime, refreshInterval, fetchMetrics])

  // 生成图表数据
  const generateChartData = (): ChartData => {
    if (!metrics) return { labels: [], datasets: [] }

    const labels = ['会话数', '页面浏览', '事件数', '平均会话时长', '平均页面时长']
    const data = [
      metrics.totalSessions,
      metrics.totalPageViews,
      metrics.totalEvents,
      Math.round(metrics.averageSessionDuration / 1000), // 转换为秒
      Math.round(metrics.averagePageViewDuration / 1000), // 转换为秒
    ]

    return {
      labels,
      datasets: [
        {
          label: '用户指标',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
      ],
    }
  }

  // 生成时间序列数据
  const generateTimeSeriesData = (): TimeSeriesData[] => {
    if (!metrics) return []

    const now = new Date()
    const data: TimeSeriesData[] = []

    // 生成过去7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      data.push({
        timestamp: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100), // 模拟数据
        label: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      })
    }

    return data
  }

  // 格式化时间
  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds % 60}秒`
    } else {
      return `${seconds}秒`
    }
  }

  // 格式化百分比
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  // 获取指标状态
  const getMetricStatus = (value: number, threshold: number): 'good' | 'warning' | 'poor' => {
    if (value >= threshold) return 'good'
    if (value >= threshold * 0.7) return 'warning'
    return 'poor'
  }

  if (isLoading) {
    return (
      <div className={`analytics-dashboard loading ${className}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载分析数据中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`analytics-dashboard error ${className}`}>
        <div className="error-content">
          <h3>❌ 加载失败</h3>
          <p>{error}</p>
          <button onClick={fetchMetrics} className="btn btn-primary">
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className={`analytics-dashboard empty ${className}`}>
        <div className="empty-content">
          <h3>📊 暂无数据</h3>
          <p>开始使用应用以收集分析数据</p>
        </div>
      </div>
    )
  }

  const chartData = generateChartData()
  const timeSeriesData = generateTimeSeriesData()

  return (
    <div className={`analytics-dashboard ${className}`}>
      <div className="dashboard-header">
        <h2>📊 数据分析仪表板</h2>
        <div className="header-actions">
          <button
            onClick={fetchMetrics}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? '刷新中...' : '刷新数据'}
          </button>
          <span className="last-update">
            最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
          </span>
        </div>
      </div>

      <div className="dashboard-content">
        {/* 关键指标卡片 */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3>总会话数</h3>
              <div className="metric-value">{metrics.totalSessions}</div>
              <div className="metric-description">用户访问次数</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👁️</div>
            <div className="metric-content">
              <h3>页面浏览</h3>
              <div className="metric-value">{metrics.totalPageViews}</div>
              <div className="metric-description">页面查看次数</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <h3>总事件数</h3>
              <div className="metric-value">{metrics.totalEvents}</div>
              <div className="metric-description">用户交互次数</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <h3>平均会话时长</h3>
              <div className="metric-value">
                {formatDuration(metrics.averageSessionDuration)}
              </div>
              <div className="metric-description">用户停留时间</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📱</div>
            <div className="metric-content">
              <h3>平均页面时长</h3>
              <div className="metric-value">
                {formatDuration(metrics.averagePageViewDuration)}
              </div>
              <div className="metric-description">页面停留时间</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h3>跳出率</h3>
              <div className={`metric-value ${getMetricStatus(metrics.bounceRate, 30)}`}>
                {formatPercentage(metrics.bounceRate)}
              </div>
              <div className="metric-description">单页访问比例</div>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>📈 用户行为趋势</h3>
            <div className="chart">
              <div className="chart-placeholder">
                <p>图表组件将在这里显示</p>
                <small>支持 Chart.js, Recharts 等图表库</small>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>🕒 时间分布</h3>
            <div className="chart">
              <div className="time-series-chart">
                {timeSeriesData.map((item, index) => (
                  <div key={index} className="time-series-item">
                    <div className="time-label">{item.label}</div>
                    <div className="time-bar">
                      <div
                        className="time-bar-fill"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <div className="time-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 详细数据表格 */}
        <div className="data-table-section">
          <h3>📋 详细数据</h3>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>指标</th>
                  <th>数值</th>
                  <th>状态</th>
                  <th>描述</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>总会话数</td>
                  <td>{metrics.totalSessions}</td>
                  <td>
                    <span className={`status ${getMetricStatus(metrics.totalSessions, 1)}`}>
                      {metrics.totalSessions > 0 ? '正常' : '无数据'}
                    </span>
                  </td>
                  <td>用户访问应用的总次数</td>
                </tr>
                <tr>
                  <td>总页面浏览</td>
                  <td>{metrics.totalPageViews}</td>
                  <td>
                    <span className={`status ${getMetricStatus(metrics.totalPageViews, 1)}`}>
                      {metrics.totalPageViews > 0 ? '正常' : '无数据'}
                    </span>
                  </td>
                  <td>用户查看页面的总次数</td>
                </tr>
                <tr>
                  <td>总事件数</td>
                  <td>{metrics.totalEvents}</td>
                  <td>
                    <span className={`status ${getMetricStatus(metrics.totalEvents, 1)}`}>
                      {metrics.totalEvents > 0 ? '正常' : '无数据'}
                    </span>
                  </td>
                  <td>用户交互的总次数</td>
                </tr>
                <tr>
                  <td>平均会话时长</td>
                  <td>{formatDuration(metrics.averageSessionDuration)}</td>
                  <td>
                    <span className={`status ${getMetricStatus(metrics.averageSessionDuration, 60000)}`}>
                      {metrics.averageSessionDuration > 60000 ? '良好' : '较短'}
                    </span>
                  </td>
                  <td>用户平均停留时间</td>
                </tr>
                <tr>
                  <td>平均页面时长</td>
                  <td>{formatDuration(metrics.averagePageViewDuration)}</td>
                  <td>
                    <span className={`status ${getMetricStatus(metrics.averagePageViewDuration, 30000)}`}>
                      {metrics.averagePageViewDuration > 30000 ? '良好' : '较短'}
                    </span>
                  </td>
                  <td>页面平均停留时间</td>
                </tr>
                <tr>
                  <td>跳出率</td>
                  <td>{formatPercentage(metrics.bounceRate)}</td>
                  <td>
                    <span className={`status ${getMetricStatus(100 - metrics.bounceRate, 70)}`}>
                      {metrics.bounceRate < 30 ? '优秀' : metrics.bounceRate < 50 ? '良好' : '需改进'}
                    </span>
                  </td>
                  <td>单页访问的比例</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 建议和洞察 */}
        <div className="insights-section">
          <h3>💡 洞察和建议</h3>
          <div className="insights-grid">
            {metrics.bounceRate > 50 && (
              <div className="insight-card warning">
                <h4>⚠️ 跳出率较高</h4>
                <p>当前跳出率为 {formatPercentage(metrics.bounceRate)}，建议优化页面内容和用户体验。</p>
              </div>
            )}

            {metrics.averageSessionDuration < 60000 && (
              <div className="insight-card warning">
                <h4>⏱️ 会话时长较短</h4>
                <p>平均会话时长较短，建议增加内容吸引力和交互功能。</p>
              </div>
            )}

            {metrics.totalEvents < metrics.totalPageViews && (
              <div className="insight-card info">
                <h4>📱 交互率较低</h4>
                <p>页面浏览较多但交互较少，建议增加互动元素。</p>
              </div>
            )}

            {metrics.totalSessions > 10 && (
              <div className="insight-card success">
                <h4>🎉 用户活跃度高</h4>
                <p>用户频繁访问，说明应用价值得到认可。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
