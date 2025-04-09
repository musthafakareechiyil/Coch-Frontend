import React, { useState, useEffect } from 'react';
import { FiUsers, FiClipboard, FiCheckCircle, FiDatabase, FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [surveyStatus, setSurveyStatus] = useState({ active: 0, completed: 0, deactivated: 0 });
  const [userCount, setUserCount] = useState(0);
  const [surveyGrowth, setSurveyGrowth] = useState({});
  const [growthInterval, setGrowthInterval] = useState('weekly');
  const [completionSummary, setCompletionSummary] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [dataCount, setDataCount] = useState({ total_questions: 0, total_categories: 0, total_responses: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusRes = await fetch('http://localhost:3000/dashboard/survey_status_count');
        const statusData = await statusRes.json();
        setSurveyStatus(statusData);

        const userRes = await fetch('http://localhost:3000/dashboard/user_count');
        const userData = await userRes.json();
        setUserCount(userData.total_users);

        const growthRes = await fetch(`http://localhost:3000/dashboard/survey_growth?interval=${growthInterval}`);
        const growthData = await growthRes.json();
        setSurveyGrowth(growthData);

        const summaryRes = await fetch('http://localhost:3000/dashboard/completion_summary');
        const summaryData = await summaryRes.json();
        setCompletionSummary(summaryData);

        const activitiesRes = await fetch('http://localhost:3000/dashboard/recent_activities');
        const activitiesData = await activitiesRes.json();
        setRecentActivities(activitiesData);

        const dataRes = await fetch('http://localhost:3000/dashboard/data_count');
        const dataData = await dataRes.json();
        setDataCount(dataData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [growthInterval]);

  const handleIntervalChange = (interval) => {
    setGrowthInterval(interval);
  };
  const navigate = useNavigate();

  const calculateGrowth = () => {
    const entries = Object.entries(surveyGrowth);
    if (entries.length === 0) return '+0';
    const sorted = entries.sort((a, b) => new Date(b[0]) - new Date(a[0]));
    const latestValue = sorted[0][1];
    return `+${latestValue}`;
  };

  const filteredAndSortedSurveys = [...completionSummary]
    .filter((survey) => survey.survey_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      return sortDirection === 'asc'
        ? a.completion_rate - b.completion_rate
        : b.completion_rate - a.completion_rate;
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleNavigate = (surveyId) => {
    navigate(`/survey/${surveyId}/kpis`);
  };

  return (
    <div className="min-h-screen bg-gray-50 md:p-1">
      <div className="bg-blue-600 text-white p-2 mb-6 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {recentActivities.map((activity, index) => (
            <span key={index} className="mx-4">
              {activity.message} • {new Date(activity.time).toLocaleString()}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:p-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Survey Status</h3>
              <div className="mt-2">
                <div className="flex items-center text-green-600">
                  <FiClipboard className="mr-2" />
                  <span>Active: {surveyStatus.active}</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <FiCheckCircle className="mr-2" />
                  <span>Completed: {surveyStatus.completed}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiClipboard className="mr-2" />
                  <span>Deactivated: {surveyStatus.deactivated}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiClipboard className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <p className="text-2xl font-bold mt-2">{userCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiUsers className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Survey Growth</h3>
              <p className="text-2xl font-bold mt-2">{calculateGrowth()}</p>
              <div className="flex space-x-2 mt-3">
                {['daily', 'weekly', 'monthly', 'yearly'].map((interval) => (
                  <button
                    key={interval}
                    onClick={() => handleIntervalChange(interval)}
                    className={`text-xs px-2 py-1 rounded ${
                      growthInterval === interval ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {interval.charAt(0).toUpperCase() + interval.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Data Summary</h3>
              <div className="mt-2">
                <p className="text-sm">Questions: {dataCount.total_questions}</p>
                <p className="text-sm">Categories: {dataCount.total_categories}</p>
                <p className="text-sm">Responses: {dataCount.total_responses}</p>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FiDatabase className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Survey Summary</h2>
      <div className="bg-white rounded-lg shadow p-12 mb-8">

        <div className="flex justify-between">
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Survey"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <button
              onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Sort by Completion Rate {sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />}
            </button>
          </div>

        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Survey Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Users</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedSurveys.map((survey) => (
                <tr key={survey.survey_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 underline cursor-pointer"
                    onClick={() => handleNavigate(survey.survey_id)}
                  >
                    {survey.survey_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.total_users}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.completed_users}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${survey.completion_rate}%` }}></div>
                      </div>
                      <span>{survey.completion_rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.slice(0, 5).map((activity, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-gray-800">{activity.message}</p>
              <p className="text-sm text-gray-500">{new Date(activity.time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;