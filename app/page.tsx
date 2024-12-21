import React from 'react';
import { ArrowRight, Clock, Layout, RefreshCw, Filter } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Stay up to date with live tournament progress, mat assignments, and bout schedules. Automatic refreshing keeps you informed."
    },
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Clean Interface",
      description: "Modern, intuitive design makes it easy to browse tournament information, schedules, and results at a glance."
    },
    {
      icon: <Filter className="w-8 h-8" />,
      title: "Smart Filtering",
      description: "Filter matches by mat number, status, or school to quickly find the information most relevant to you."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Enhanced Background */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute top-0 inset-x-0 h-screen overflow-hidden">
          {/* Primary gradient orb */}
          <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl 
                        animate-pulse transform -translate-y-1/2 -translate-x-1/4" />
          
          {/* Secondary gradient orb */}
          <div className="absolute w-96 h-96 bg-gradient-to-l from-indigo-500 to-pink-400 rounded-full opacity-15 blur-xl 
                        animate-pulse delay-1000 transform translate-x-1/3 -translate-y-1/3" />
          
          {/* Accent circles */}
          <div className="absolute w-64 h-64 bg-gradient-to-br from-cyan-300 to-teal-500 rounded-full opacity-10 blur-lg 
                        animate-bounce transform -translate-x-1/2" />
          
          <div className="absolute right-0 w-72 h-72 bg-gradient-to-bl from-violet-400 to-fuchsia-500 rounded-full opacity-10 
                        blur-lg animate-bounce delay-700 transform translate-x-1/4" />
          
          {/* Small floating particles */}
          {/* <div className="absolute w-8 h-8 bg-white rounded-full opacity-20 blur-sm animate-ping 
                        transform translate-x-1/4 translate-y-1/4" />
          <div className="absolute w-6 h-6 bg-white rounded-full opacity-20 blur-sm animate-ping delay-300 
                        transform translate-x-3/4 translate-y-1/2" />
          <div className="absolute w-4 h-4 bg-white rounded-full opacity-20 blur-sm animate-ping delay-700 
                        transform translate-x-2/3 translate-y-1/3" /> */}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              A Better Way to Track Wrestling
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Browse wrestling tournaments, track matches, and follow results with a modern, fast, and easy-to-use interface. Say goodbye to slow loading times and confusing navigation.
            </p>
            <Link 
              href="/tournaments"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white text-lg font-medium rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Browse Tournaments
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
            >
              <div className="text-blue-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What's the Benefit?
            </h2>
            <p className="text-xl text-gray-600">
              We're here to show you TrackWrestling data, in a better format. We are completely free to use.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Auto-Refreshing Data
                  </h3>
                  <p className="text-gray-600">
                    Don't waste time searching through pages of results. We automatically update match statuses and results every 20 seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Layout className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Modern Interface
                  </h3>
                  <p className="text-gray-600">
                    A clean, modern design that makes it easy to find the information you need without the clutter.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Filter className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Smart Filtering
                  </h3>
                  <p className="text-gray-600">
                    Filter matches by mat, status, or school to quickly find exactly what you're looking for.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-8 shadow-inner">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-semibold text-gray-900">Mat 1 - Bout 42</div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    In Progress
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500">157 lbs - Quarter Finals</div>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="font-medium text-gray-900">John Smith</div>
                      <div className="text-sm text-gray-500">State University • Jr • 24-3</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Mike Johnson</div>
                      <div className="text-sm text-gray-500">Tech College • Sr • 22-5</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Want to see it in action?
        </h2>
        <Link 
          href="/tournaments"
          className="inline-flex items-center px-8 py-4 bg-blue-500 text-white text-lg font-medium rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Find your Tournament
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;