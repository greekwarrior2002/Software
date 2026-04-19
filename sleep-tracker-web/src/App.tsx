import { Routes, Route, NavLink } from 'react-router-dom'
import SleepPage from './pages/SleepPage'
import LifestylePage from './pages/LifestylePage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <div className="app">
      <nav className="bottom-nav">
        <NavLink to="/"          end><span>🛏</span><span>Sleep</span></NavLink>
        <NavLink to="/lifestyle"    ><span>🌿</span><span>Lifestyle</span></NavLink>
        <NavLink to="/analytics"    ><span>📈</span><span>Analytics</span></NavLink>
        <NavLink to="/settings"     ><span>⚙️</span><span>Settings</span></NavLink>
      </nav>
      <main className="page">
        <Routes>
          <Route path="/"          element={<SleepPage />} />
          <Route path="/lifestyle" element={<LifestylePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings"  element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
