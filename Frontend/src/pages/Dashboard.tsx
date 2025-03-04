import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Github, Rocket, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/Buttons';
import axios from 'axios';

interface User {
  username: string;
  email?: string | null;
  avatarUrl?: string | null;
}

interface Project {
  id: number;
  name: string;
  repo: string;
  status: string;
  createdAt: string;
  commits?: number;
  branches?: number;
}

interface ApiUserResponse {
  user: User;
}

interface ApiReposResponse {
  repos: Array<{
    id: number;
    name: string;
    full_name: string;
    created_at: string;
    size: number;
  }>;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded JWT:', decoded);
        setUser({
          username: decoded.username,
          email: null,
          avatarUrl: null,
        });

        const userUrl = 'http://localhost:8000/api/auth/me';
        const reposUrl = 'http://localhost:8000/api/auth/github/repos';
        console.log('Fetching from URLs:', { userUrl, reposUrl });
        console.log('Using token:', token);

        const [userResponse, projectsResponse] = await Promise.all([
          axios.get<ApiUserResponse>(userUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<ApiReposResponse>(reposUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log('User Response:', userResponse.data);
        console.log('Projects Response:', projectsResponse.data);

        setUser(userResponse.data.user);
        setProjects(
          projectsResponse.data.repos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            repo: repo.full_name,
            status: 'deployed',
            createdAt: repo.created_at,
            commits: repo.size,
            branches: 1,
          }))
        );

        setIsVisible(true);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const totalDeployed = projects.filter((p) => p.status === 'deployed').length;
  const deploymentRate = projects.length > 0 ? (totalDeployed / projects.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto">
        {/* Rest of your UI remains unchanged */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {user && (
            <div className="mb-10 flex items-center gap-4">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
                />
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Github size={28} /> Welcome, {user.username}!
                </h1>
                {user.email && (
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                )}
              </div>
            </div>
          )}
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
                  <p className="text-gray-600 dark:text-gray-400">Latest Project</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {projects.length > 0
                      ? new Date(
                          projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                            .createdAt
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
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
                            <strong>Created:</strong>{' '}
                            {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => window.open(`https://github.com/${project.repo}`, '_blank')}
                            icon={<Rocket size={16} />}
                          >
                            View Repository
                          </Button>
                        </>
                      )}
                      <div className="mt-4 flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                        <span>Commits: {project.commits || 'N/A'}</span>
                        <span>Branches: {project.branches || 'N/A'}</span>
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
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/create-project')}
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