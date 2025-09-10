// Analytics Toggle Component
// Provides easy access to analytics dashboard

import React, { useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import './Analytics.css';

const AnalyticsToggle = ({ position = 'bottom-right' }) => {
    const [isDashboardVisible, setIsDashboardVisible] = useState(false);

    const toggleDashboard = () => {
        setIsDashboardVisible(!isDashboardVisible);
    };

    const positionClasses = {
        'bottom-right': 'analytics-toggle-bottom-right',
        'bottom-left': 'analytics-toggle-bottom-left',
        'top-right': 'analytics-toggle-top-right',
        'top-left': 'analytics-toggle-top-left'
    };

    return (
        <>
            <button
                className={`analytics-toggle ${positionClasses[position]}`}
                onClick={toggleDashboard}
                title="Analytics Dashboard"
            >
                <i className="fas fa-chart-line"></i>
            </button>

            <AnalyticsDashboard
                isVisible={isDashboardVisible}
                onClose={() => setIsDashboardVisible(false)}
            />
        </>
    );
};

export default AnalyticsToggle;
