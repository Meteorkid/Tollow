import React from 'react'
import './Header.css'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">⌨️</span>
            Tollow
          </h1>
          <p className="tagline">通过重新输入整本书来练习打字</p>
          <div className="header-features">
            <span className="feature">提升打字速度</span>
            <span className="feature">提高准确性</span>
            <span className="feature">享受阅读乐趣</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
