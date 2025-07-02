import React, { useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { useDocuments } from '../hooks/useDocuments';
import { 
  DocumentIcon, 
  FolderIcon, 
  UsersIcon, 
  ClockIcon,
  TrendingUpIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Dashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const { documents, isLoading } = useDocuments();

  // Mock data for charts
  const documentsByCategory = [
    { name: 'Specifications', value: 25, color: COLORS[0] },
    { name: 'Drawings', value: 18, color: COLORS[1] },
    { name: 'Documentation', value: 15, color: COLORS[2] },
    { name: 'Reports', value: 12, color: COLORS[3] },
    { name: 'Contracts', value: 8, color: COLORS[4] },
  ];

  const uploadTrend = [
    { month: 'Jan', uploads: 45 },
    { month: 'Feb', uploads: 52 },
    { month: 'Mar', uploads: 38 },
    { month: 'Apr', uploads: 61 },
    { month: 'May', uploads: 55 },
    { month: 'Jun', uploads: 67 },
  ];

  const recentDocuments = documents.slice(0, 5);

  const stats = [
    {
      name: 'Total Documents',
      value: '1,247',
      change: '+12%',
      changeType: 'increase',
      icon: DocumentIcon,
    },
    {
      name: 'Active Projects',
      value: '23',
      change: '+3%',
      changeType: 'increase',
      icon: FolderIcon,
    },
    {
      name: 'Team Members',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: UsersIcon,
    },
    {
      name: 'Pending Reviews',
      value: '18',
      change: '-5%',
      changeType: 'decrease',
      icon: ClockIcon,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your documents today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upload Trend</h3>
            <TrendingUpIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={uploadTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uploads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Documents by Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Documents by Category</h3>
            <FolderIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={documentsByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {documentsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {documentsByCategory.map((category, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentDocuments.map((document) => (
            <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📄</div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{document.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {document.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        By {document.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(document.uploadDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};