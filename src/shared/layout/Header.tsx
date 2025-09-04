import React from 'react'
import '../../styles/Header.css'
import { Link, useLocation } from 'react-router-dom'

const Header: React.FC = () => {
  const { pathname } = useLocation()
  const nav = [
    { to: '/library', label: '书库' },
    { to: '/upload', label: '上传' },
    { to: '/practice', label: '练习' },
    { to: '/analytics', label: '分析' },
  ]

  return (
    <header className="header">
      <div className="container header-bar">
        <Link to="/library" className="brand">
          <span className="logo-icon">⌨️</span>
          <span className="brand-name">Tollow</span>
        </Link>
        <nav className="nav">
          {nav.map(item => (
            <Link key={item.to} to={item.to} className={`nav-link ${pathname === item.to ? 'active' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
