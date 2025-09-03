import React from 'react'
import { useAppStore } from '../../stores/appStore'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'
import { logger } from '../../utils/logger'

const Profile: React.FC = () => {
  const { user, updateUser } = useAppStore()
  
  // 性能监控
  usePerformanceMonitor('Profile')
  
  if (!user) {
    return (
      <div className="profile-error">
        <h2>❌ 用户未登录</h2>
        <p>请先登录以查看个人资料</p>
      </div>
    )
  }

  const handleUpdateProfile = (updates: Partial<typeof user>) => {
    try {
      updateUser(updates)
      logger.info('个人资料更新成功', { updates })
    } catch (error) {
      logger.error('个人资料更新失败', { error })
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>👤 个人资料</h1>
        <p>管理您的个人信息和偏好设置</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h3>基本信息</h3>
          <div className="profile-info">
            <div className="avatar">
              <img src={user.avatar} alt={user.username} />
            </div>
            <div className="user-details">
              <h4>{user.username}</h4>
              <p>{user.email}</p>
              <p>注册时间: {user.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>打字统计</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{user.stats.totalPracticeTime}</span>
              <span className="stat-label">总练习时间(秒)</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.totalWordsTyped}</span>
              <span className="stat-label">总打字字数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.averageWPM}</span>
              <span className="stat-label">平均WPM</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.averageAccuracy}%</span>
              <span className="stat-label">平均准确率</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.practiceStreak}</span>
              <span className="stat-label">连续练习天数</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>成就</h3>
          <div className="achievements">
            {user.achievements.length > 0 ? (
              user.achievements.map((achievement, index) => (
                <div key={index} className="achievement">
                  <span className="achievement-icon">🏆</span>
                  <span className="achievement-name">{achievement.name}</span>
                </div>
              ))
            ) : (
              <p>暂无成就，继续练习吧！</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
