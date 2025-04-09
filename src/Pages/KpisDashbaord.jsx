import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiActivity, FiTrendingUp, FiAward, FiPieChart } from 'react-icons/fi';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const KpisDashboard = () => {
  const { id } = useParams();
  const [averageScores, setAverageScores] = useState([]);
  const [completionRate, setCompletionRate] = useState({});
  const [engagementIndex, setEngagementIndex] = useState(0);
  const [performanceBrackets, setPerformanceBrackets] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all KPI data
        const [
          scoresRes,
          completionRes,
          engagementRes,
          performanceRes
        ] = await Promise.all([
          fetch(`http://localhost:3000/surveys/${id}/kpis/average_scores_per_category`),
          fetch(`http://localhost:3000/surveys/${id}/kpis/completion_rate`),
          fetch(`http://localhost:3000/surveys/${id}/kpis/engagement_index`),
          fetch(`http://localhost:3000/surveys/${id}/kpis/performance_brackets`)
        ]);

        const scoresData = await scoresRes.json();
        console.log(scoresData, "scores data")
        const completionData = await completionRes.json();
        const engagementData = await engagementRes.json();
        const performanceData = await performanceRes.json();

        setAverageScores(scoresData);
        setCompletionRate(completionData);
        setEngagementIndex(engagementData.engagement_index);
        setPerformanceBrackets(performanceData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Data for category scores bar chart
  const categoryScoresData = {
    labels: averageScores.map(cat => cat.category_name),
    datasets: [
      {
        label: 'Average Score (out of 5)',
        data: averageScores.map(cat => cat.average_score),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(124, 58, 237, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for completion rate doughnut
  const completionRateData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completionRate.completed_users, completionRate.total_users - completionRate.completed_users],
        backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(229, 231, 235, 0.7)'],
        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(209, 213, 219, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Data for performance brackets doughnut
  const performanceBracketsData = {
    labels: Object.keys(performanceBrackets).map(key => 
      key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ),
    datasets: [
      {
        data: Object.values(performanceBrackets).map(bracket => bracket.percentage),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',    // Red for Poor
          'rgba(245, 158, 11, 0.7)',    // Yellow for Average
          'rgba(16, 185, 129, 0.7)',    // Green for Good
          'rgba(59, 130, 246, 0.7)'     // Blue for Very Proficient
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Classification colors
  const getClassificationColor = (classification) => {
    switch (classification.toLowerCase()) {
      case 'poor':
        return 'text-red-600';
      case 'average':
        return 'text-yellow-600';
      case 'good':
        return 'text-green-600';
      case 'very proficient':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Survey KPI's Dashboard</h1>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Completion Rate Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Completion Rate</h3>
              <p className="text-2xl font-bold mt-2">{completionRate.completion_rate}%</p>
              <p className="text-sm text-gray-500 mt-1">
                {completionRate.completed_users} of {completionRate.total_users} users
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 h-40">
            <Doughnut 
              data={completionRateData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Engagement Index Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Engagement Index</h3>
              <p className="text-2xl font-bold mt-2">{engagementIndex}</p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${engagementIndex}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {engagementIndex >= 75 ? 'High' : engagementIndex >= 50 ? 'Medium' : 'Low'} Engagement
                </p>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiActivity className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="radial-progress" style={{ "--value": engagementIndex, "--size": "8rem" }}>
              <span className="text-gray-700 font-medium">{engagementIndex}%</span>
            </div>
          </div>
        </div>

        {/* Performance Brackets Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Performance Distribution</h3>
              <div className="mt-2 space-y-1">
                {Object.entries(performanceBrackets).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${getClassificationColor(key).replace('text', 'bg')}`}></span>
                    <span className="text-sm capitalize">
                      {key.replace('_', ' ')}: {value.percentage}% ({value.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiAward className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 h-40">
            <Doughnut 
              data={performanceBracketsData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Category Scores Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Scores by Category</h2>
        <div className="h-80">
          <Bar 
            data={categoryScoresData} 
            options={{ 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 1
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }} 
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {averageScores.map((category) => (
            <div key={category.category_id} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800">{category.category_name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{category.average_score.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Avg. Score (out of 5)</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getClassificationColor(category.classification)}`}>
                    {category.classification}
                  </p>
                  <p className="text-sm text-gray-500">{category.percentage}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Survey Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiTrendingUp className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Overall Classification</h3>
              <p className="text-xl font-bold mt-1">
                {engagementIndex >= 75 ? 'Excellent' : 
                 engagementIndex >= 50 ? 'Good' : 
                 engagementIndex >= 25 ? 'Average' : 'Needs Improvement'}
              </p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiPieChart className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Highest Rated Category</h3>
              <p className="text-xl font-bold mt-1">
                {averageScores.reduce((max, cat) => max.average_score > cat.average_score ? max : cat).category_name}
              </p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FiActivity className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Engagement Level</h3>
              <p className="text-xl font-bold mt-1">
                {engagementIndex >= 75 ? 'High' : 
                 engagementIndex >= 50 ? 'Medium' : 'Low'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpisDashboard;