import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, ClipboardList, Library, UserCircle, LogOut, CheckCircle } from 'lucide-react';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-bold text-gray-900">Placement Prep</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/dashboard/practice"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <Code2 className="mr-3 h-5 w-5" />
                        Practice
                    </NavLink>

                    <NavLink
                        to="/dashboard/assessments"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <ClipboardList className="mr-3 h-5 w-5" />
                        Assessments
                    </NavLink>

                    <NavLink
                        to="/dashboard/resources"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <Library className="mr-3 h-5 w-5" />
                        Resources
                    </NavLink>

                    <NavLink
                        to="/dashboard/profile"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <UserCircle className="mr-3 h-5 w-5" />
                        Profile
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-800">Welcome Back, Student</h1>
                    <div className="flex items-center space-x-4">
                        <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                            JD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
