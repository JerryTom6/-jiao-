
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Publish from './pages/Publish';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ListingDetail from './pages/ListingDetail';
import ChatDetail from './pages/ChatDetail';
import CitySelect from './pages/CitySelect';
import OrderConfirm from './pages/OrderConfirm';
import Wallet from './pages/Wallet';
import MyPosts from './pages/MyPosts';
import Favorites from './pages/Favorites';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import { UserRole } from './types';
import { wx, STORAGE_KEYS } from './services/storage';

function App() {
  const [userRole, setUserRole] = useState<UserRole>('parent');

  // Initialize role from Storage
  useEffect(() => {
    const savedRole = wx.getStorage(STORAGE_KEYS.USER_ROLE);
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  const switchRole = () => {
    const newRole = userRole === 'parent' ? 'tutor' : 'parent';
    setUserRole(newRole);
    wx.setStorage(STORAGE_KEYS.USER_ROLE, newRole);
  };

  return (
    <Router>
      <Routes>
        <Route path="/city-select" element={<CitySelect />} />
        <Route path="/chat/:id" element={<ChatDetail userRole={userRole} />} />
        <Route path="/listing/:id" element={<ListingDetail userRole={userRole} />} />
        <Route path="/order-confirm/:id" element={<OrderConfirm />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* New Pages */}
        <Route path="/my-posts" element={<MyPosts userRole={userRole} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/templates" element={<Templates />} />
        
        {/* Main Tabs wrapped in Layout */}
        <Route path="/" element={<Layout><Home userRole={userRole} switchRole={switchRole} /></Layout>} />
        <Route path="/publish" element={<Layout><Publish userRole={userRole} /></Layout>} />
        <Route path="/messages" element={<Layout><Messages /></Layout>} />
        <Route path="/profile" element={<Layout><Profile userRole={userRole} /></Layout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
