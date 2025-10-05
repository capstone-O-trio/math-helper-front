import React from 'react';
import './App.css';
import HandTracker from './components/HandTracker';

const App: React.FC = () => {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h1>Mediapipe + React 손 추적</h1>
      <p>브라우저에서 카메라 권한을 허용하세요.</p>
      <HandTracker />
    </div>
  );
};

export default App;