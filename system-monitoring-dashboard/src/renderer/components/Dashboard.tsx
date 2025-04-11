import React from 'react';
import SystemInfo from './SystemInfo';
import Notifications from './Notifications';
import Chatbot from './Chatbot';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <h1>System Monitoring Dashboard</h1>
            <SystemInfo />
            <Notifications />
            <Chatbot />
        </div>
    );
};

export default Dashboard;