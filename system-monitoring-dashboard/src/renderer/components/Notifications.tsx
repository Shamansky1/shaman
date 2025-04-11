import React from 'react';

interface Notification {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsProps {
    notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
    return (
        <div className="notifications">
            <h2>Notifications</h2>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id} className={`notification ${notification.type}`}>
                        {notification.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;