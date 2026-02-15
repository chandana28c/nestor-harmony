import React from 'react';
import './Input.css';

export const Input = ({ label, placeholder, value, onChange, type = 'text' }) => {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                className="input-field"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};
