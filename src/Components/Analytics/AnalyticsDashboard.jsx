// Analytics Dashboard Component
// Displays comprehensive analytics data and reports

import React, { useState, useEffect } from 'react';
import { getAutoAnalytics } from '../../utils/autoAnalytics';
import { getAnalyticsLogger } from '../../utils/analyticsLogger';

const AnalyticsDashboard = ({ isVisible = false, onClose }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isVisible) {
            loadAnalyticsData();
        }
    }, [isVisible]);

    const loadAnalyticsData = () => {
        setIsLoading(true);
        try {
            const autoAnalytics = getAutoAnalytics();
            const logger = getAnalyticsLogger();

            if (autoAnalytics) {
                const report = autoAnalytics.getReport();
                setAnalyticsData(report);
            } else if (logger) {
                const report = logger.getAnalyticsReport();
                setAnalyticsData(report);
            }
        } catch (error) {
            console.error('Failed to load analytics data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const exportData = () => {
        try {
            const autoAnalytics = getAutoAnalytics();
            if (autoAnalytics) {
                autoAnalytics.exportData();
            }
        } catch (error) {
            console.error('Failed to export analytics data:', error);
        }
    };

    if (!isVisible) return null;

    if (isLoading) {
        return (
            <div className="analytics-dashboard-overlay">
                <div className="analytics-dashboard">
                    <div className="analytics-loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading analytics data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="analytics-dashboard-overlay">
                <div className="analytics-dashboard">
                    <div className="analytics-error">
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>No analytics data available</p>
                    </div>
                </div>
            </div>
        );
    }

    const { session_summary, user_behavior, action_timeline, performance_metrics, error_events, conversion_events } = analyticsData;

    return (
        <div className="analytics-dashboard-overlay">
            <div className="analytics-dashboard">
                <div className="analytics-header">
                    <h2>Analytics Dashboard</h2>
                    <div className="analytics-actions">
                        <button onClick={loadAnalyticsData} className="btn btn-sm btn-outline">
                            <i className="fas fa-refresh"></i> Refresh
                        </button>
                        <button onClick={exportData} className="btn btn-sm btn-primary">
                            <i className="fas fa-download"></i> Export
                        </button>
                        <button onClick={onClose} className="btn btn-sm btn-secondary">
                            <i className="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>

                <div className="analytics-tabs">
                    <button
                        className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab ${selectedTab === 'actions' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('actions')}
                    >
                        Actions
                    </button>
                    <button
                        className={`tab ${selectedTab === 'performance' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('performance')}
                    >
                        Performance
                    </button>
                    <button
                        className={`tab ${selectedTab === 'errors' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('errors')}
                    >
                        Errors
                    </button>
                    <button
                        className={`tab ${selectedTab === 'conversions' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('conversions')}
                    >
                        Conversions
                    </button>
                </div>

                <div className="analytics-content">
                    {selectedTab === 'overview' && (
                        <div className="analytics-overview">
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <h3>Session Duration</h3>
                                    <p className="metric-value">{Math.round(session_summary.duration / 1000)}s</p>
                                </div>
                                <div className="metric-card">
                                    <h3>Total Actions</h3>
                                    <p className="metric-value">{session_summary.total_actions}</p>
                                </div>
                                <div className="metric-card">
                                    <h3>Engagement Score</h3>
                                    <p className="metric-value">{session_summary.engagement_score}/100</p>
                                </div>
                                <div className="metric-card">
                                    <h3>Pages Visited</h3>
                                    <p className="metric-value">{user_behavior.pages_visited}</p>
                                </div>
                            </div>

                            <div className="action-distribution">
                                <h3>Action Distribution</h3>
                                <div className="distribution-chart">
                                    {Object.entries(user_behavior.action_distribution).map(([action, count]) => (
                                        <div key={action} className="distribution-item">
                                            <span className="action-name">{action.replace(/_/g, ' ')}</span>
                                            <div className="action-bar">
                                                <div
                                                    className="action-fill"
                                                    style={{
                                                        width: `${(count / session_summary.total_actions) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="action-count">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'actions' && (
                        <div className="analytics-actions">
                            <h3>Action Timeline</h3>
                            <div className="action-timeline">
                                {action_timeline.slice(-20).map((action, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-time">
                                            {new Date(action.timestamp).toLocaleTimeString()}
                                        </div>
                                        <div className="timeline-content">
                                            <div className="timeline-action">{action.type}</div>
                                            <div className="timeline-data">
                                                {JSON.stringify(action.data, null, 2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'performance' && (
                        <div className="analytics-performance">
                            <h3>Performance Metrics</h3>
                            <div className="performance-metrics">
                                {performance_metrics.map((metric, index) => (
                                    <div key={index} className="performance-item">
                                        <div className="metric-name">{metric.data.metric_name}</div>
                                        <div className="metric-value">
                                            {metric.data.metric_value} {metric.data.metric_unit}
                                        </div>
                                        <div className="metric-time">
                                            {new Date(metric.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'errors' && (
                        <div className="analytics-errors">
                            <h3>Error Events</h3>
                            <div className="error-list">
                                {error_events.map((error, index) => (
                                    <div key={index} className="error-item">
                                        <div className="error-type">{error.data.error_type}</div>
                                        <div className="error-message">{error.data.error_message}</div>
                                        <div className="error-time">
                                            {new Date(error.timestamp).toLocaleTimeString()}
                                        </div>
                                        {error.data.error_context && (
                                            <div className="error-context">
                                                <pre>{JSON.stringify(error.data.error_context, null, 2)}</pre>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'conversions' && (
                        <div className="analytics-conversions">
                            <h3>Conversion Events</h3>
                            <div className="conversion-list">
                                {conversion_events.map((conversion, index) => (
                                    <div key={index} className="conversion-item">
                                        <div className="conversion-type">{conversion.data.conversion_type}</div>
                                        <div className="conversion-value">{conversion.data.conversion_value}</div>
                                        <div className="conversion-time">
                                            {new Date(conversion.timestamp).toLocaleTimeString()}
                                        </div>
                                        <div className="conversion-path">
                                            Path: {conversion.data.conversion_path?.join(' → ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
