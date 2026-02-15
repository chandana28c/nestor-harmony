import React, { useState } from 'react';
import './ProofFooter.css';

export const ProofFooter = () => {
    const [checks, setChecks] = useState({
        uiBuilt: false,
        logicWorking: false,
        testPassed: false,
        deployed: false
    });

    const toggleCheck = (key) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <footer className="proof-footer">
            <div className="proof-container">
                <label className="proof-item">
                    <input
                        type="checkbox"
                        checked={checks.uiBuilt}
                        onChange={() => toggleCheck('uiBuilt')}
                    />
                    <span className="proof-label">UI Built</span>
                </label>
                <label className="proof-item">
                    <input
                        type="checkbox"
                        checked={checks.logicWorking}
                        onChange={() => toggleCheck('logicWorking')}
                    />
                    <span className="proof-label">Logic Working</span>
                </label>
                <label className="proof-item">
                    <input
                        type="checkbox"
                        checked={checks.testPassed}
                        onChange={() => toggleCheck('testPassed')}
                    />
                    <span className="proof-label">Test Passed</span>
                </label>
                <label className="proof-item">
                    <input
                        type="checkbox"
                        checked={checks.deployed}
                        onChange={() => toggleCheck('deployed')}
                    />
                    <span className="proof-label">Deployed</span>
                </label>
            </div>
        </footer>
    );
};
