import React from 'react';
import './TopBar.css';

export const TopBar = ({ projectName, currentStep, totalSteps, status }) => {
    return (
        <header className="top-bar">
            <div className="top-bar-left">
                <span className="project-name">{projectName}</span>
            </div>
            <div className="top-bar-center">
                <span className="progress-indicator">Step {currentStep} / {totalSteps}</span>
            </div>
            <div className="top-bar-right">
                <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                </span>
            </div>
        </header>
    );
};
