import React, { useState, useMemo } from 'react';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Treasure from './pages/Treasure';
import Group from './pages/Group';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import './App.css';

type TabKey = 'home' | 'discover' | 'treasure' | 'group' | 'profile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const content = useMemo(() => {
    switch (activeTab) {
      case 'discover':
        return <Discover />;
      case 'treasure':
        return <Treasure />;
      case 'group':
        return <Group />;
      case 'profile':
        return <Profile />;
      case 'home':
      default:
        return <Home />;
    }
  }, [activeTab]);

  return (
    <div className="App">
      {content}
      <BottomNav activeTab={activeTab} onChange={(tab) => setActiveTab(tab as TabKey)} />
    </div>
  );
};

export default App;