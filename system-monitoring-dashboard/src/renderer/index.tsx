Sure, here's the contents for the file: /system-monitoring-dashboard/system-monitoring-dashboard/src/renderer/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';
import './styles/index.css';

const App = () => {
    return (
        <div>
            <Dashboard />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));