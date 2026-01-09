import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Workout } from './pages/Workout';
import { Templates } from './pages/Templates';
import { History } from './pages/History';
import { WorkoutDetail } from './pages/WorkoutDetail';
import { Progress } from './pages/Progress';
import { Export } from './pages/Export';
import { Settings } from './pages/Settings';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="workout" element={<Workout />} />
          <Route path="templates" element={<Templates />} />
          <Route path="history" element={<History />} />
          <Route path="history/:id" element={<WorkoutDetail />} />
          <Route path="progress" element={<Progress />} />
          <Route path="export" element={<Export />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
