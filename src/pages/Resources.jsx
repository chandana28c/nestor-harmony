import React from 'react';

const Resources = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-lg">System Design Guide</h3>
                    <p className="text-gray-500 mt-2">Comprehensive guide for interviews.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-lg">Data Structures PDF</h3>
                    <p className="text-gray-500 mt-2">Cheat sheet for common structures.</p>
                </div>
            </div>
        </div>
    );
};

export default Resources;
