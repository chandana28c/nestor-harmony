import React from 'react';

const Profile = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                        JD
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">John Doe</h3>
                        <p className="text-gray-500">student@example.com</p>
                    </div>
                </div>
                <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Settings</h4>
                    <p className="text-sm text-gray-500">Account preferences and notifications.</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
