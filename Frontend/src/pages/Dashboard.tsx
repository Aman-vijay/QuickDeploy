import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Github, Rocket, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/Buttons';

// Mock data (unchanged)
const mockProjects = [
  {
    id: 1,
    name: 'React Portfolio',
    repo: 'user/react-portfolio',
    status: 'deployed',
    deployedAt: '2023-05-15',
    deploymentUrl: 'https://react-portfolio.netlify.app',
    buildTime: '45s',
    commits: 124,
    branches: 3,
  },
  {
    id: 2,
    name: 'NodeJS API',
    repo: 'user/node-api',
    status: 'pending',
    lastUpdated: '2023-05-12',
    commits: 87,
    branches: 2,
  },
  {
    id: 3,
    name: 'Vue Dashboard',
    repo: 'user/vue-dashboard',
    status: 'failed',
    lastAttempt: '2023-05-10',
    errorMessage: 'Build failed: Missing dependencies',
    commits: 56,
    branches: 4,
  },
  {
    id: 4,
    name: 'E-commerce Platform',
    repo: 'user/ecommerce-platform',
    status: 'deployed',
    deployedAt: '2023-05-08',
    deploymentUrl: 'https://ecommerce-demo.vercel.app',
    buildTime: '2m 12s',
    commits: 298,
    branches: 5,
  },
];

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    deployed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  const icons = {
    deployed: <CheckCircle size={16} className="inline mr-1" />,
    pending: <Clock size={16} className="inline mr-1" />,
    failed: <AlertCircle size={16} className="inline mr-1" />,
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {icons[status as keyof typeof icons] || null}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const Dashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const totalDeployed = projects.filter((p) => p.status === 'deployed').length;
  const deploymentRate = projects.length > 0 ? (totalDeployed / projects.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* Header Section */}
      <div className="container mx-auto">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900 dark:text-white mb-10 flex items-center gap-2">
            <Github size={28} /> Dashboard
          </h1>

          {/* Stats Summary */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading projects...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-2">
                    <Github size={20} /> {projects.length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">Deployed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-2">
                    <Rocket size={20} /> {totalDeployed}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">Deployment Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {deploymentRate.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">Latest Deploy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {projects.length > 0 ? '2 hours ago' : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Projects Grid */}
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <StatusBadge status={project.status} />
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Repository:</strong> {project.repo}
                      </p>

                      {project.status === 'deployed' && (
  <>
    <p className="text-gray-600 dark:text-gray-400 mb-2">
      <strong>Deployed:</strong> {project.deployedAt}
    </p>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      <strong>Build Time:</strong> {project.buildTime}
    </p>
    <Button
      variant="primary"
      to={project.deploymentUrl}
      icon={<Rocket size={16} />}
    >
      View Deployment
    </Button>
  </>
)}
{project.status === 'failed' && (
  <>
    <p className="text-gray-600 dark:text-gray-400 mb-2">
      <strong>Last Attempt:</strong> {project.lastAttempt}
    </p>
    <p className="text-red-600 dark:text-red-400 mb-4">
      <strong>Error:</strong> {project.errorMessage}
    </p>
    <Button variant="danger">View Logs</Button>
  </>
)}
                      <div className="mt-4 flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                        <span>Commits: {project.commits}</span>
                        <span>Branches: {project.branches}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    No projects found
                  </p>
                  <Button
                    to="/create-project"
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    className="mt-6"
                    >
                    Create New Project
                    </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;