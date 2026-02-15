import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Video, BarChart3, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <CheckCircle className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold tracking-tight text-primary">Placement Prep</span>
                        </div>
                        <div className="flex items-center">
                            <Link to="/dashboard" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Log in
                            </Link>
                            <Link
                                to="/dashboard"
                                className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Ace Your Placement</span>{' '}
                                    <span className="block text-primary xl:inline">Prepare for Success</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Practice questions, mock interviews, and detailed assessments to help you land your dream job at top product companies.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link
                                            to="/dashboard"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-indigo-700 md:py-4 md:text-lg transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-indigo-50 flex items-center justify-center">
                    {/* Abstract visual representation */}
                    <div className="grid grid-cols-2 gap-4 p-8 opacity-50">
                        <div className="h-32 w-32 bg-primary/20 rounded-2xl animate-pulse"></div>
                        <div className="h-32 w-32 bg-primary/40 rounded-full"></div>
                        <div className="h-32 w-32 bg-primary/30 rounded-lg transform rotate-12"></div>
                        <div className="h-32 w-32 bg-primary/10 rounded-xl"></div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-gray-50 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to prepare
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        <Code className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Practice Problems</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    Solve hundreds of coding problems from top tech companies with detailed solutions.
                                </dd>
                            </div>

                            <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        <Video className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Mock Interviews</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    Simulate real interview scenarios with AI-driven feedback on your performance.
                                </dd>
                            </div>

                            <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        <BarChart3 className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Track Progress</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    Visualize your growth with detailed analytics and personalized study plans.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-gray-400">
                            &copy; 2024 Placement Prep. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
