// src/pages/GitHubCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import axios from 'axios';

interface AuthResponse {
  token: string;
  message: string;
}

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = localStorage.getItem('latestCSRFToken');

    console.log('URL Parameters:', { code, state });
    console.log('Stored State:', storedState);

    if (!code || !state || state !== storedState) {
      console.error('Invalid state or code', {
        codeExists: !!code,
        stateExists: !!state,
        stateMatches: state === storedState,
      });
      navigate('/login');
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        const payload = { code };
        console.log('Sending POST request with payload:', payload);
        const response = await axios.post<AuthResponse>(
          'http://localhost:8000/api/auth/github/callback',
        
          payload,


          { withCredentials: true 
            
          }
          
        );

        console.log('Backend Response:', response.data);

        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem('token', token);
          localStorage.removeItem('latestCSRFToken');
          // Dispatch event to notify other components of login
          window.dispatchEvent(new Event('authStateChange'));
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.error('Error exchanging code:', error.response?.data || error.message);
        navigate('/login');
      }
    };

    exchangeCodeForToken();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-600 dark:text-gray-400">Processing GitHub login...</p>
    </div>
  );
};

export default GitHubCallback;