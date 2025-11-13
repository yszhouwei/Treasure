import React from 'react';
import { SearchOutlined, BellOutlined, UserOutlined, HomeOutlined, TeamOutlined, ShopOutlined, ProfileOutlined } from '@ant-design/icons';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-content">
          <div className="logo">Treasure</div>
          <div className="header-actions">
            <button className="icon-button">
              <SearchOutlined />
            </button>
            <button className="icon-button">
              <BellOutlined />
            </button>
            <button className="icon-button">
              <UserOutlined />
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
      <nav className="bottom-nav">
        <button className="nav-item active">
          <HomeOutlined />
          <span>首页</span>
        </button>
        <button className="nav-item">
          <TeamOutlined />
          <span>团队</span>
        </button>
        <button className="nav-item">
          <ShopOutlined />
          <span>商城</span>
        </button>
        <button className="nav-item">
          <ProfileOutlined />
          <span>我的</span>
        </button>
      </nav>
    </div>
  );
};

export default MainLayout;