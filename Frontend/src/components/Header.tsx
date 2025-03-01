import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Github } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold transition-transform hover:scale-105 duration-300"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-extrabold text-lg">Q</span>
          </div>
          <span className="text-gray-900 dark:text-white">Quick<span className="text-blue-600">Deploy</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6">
            <Link 
              to="/"
              className={`text-sm font-medium transition-all duration-300 ${isActive('/') ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
            >
              Home
            </Link>
           
          </nav>
          
          <div className="flex items-center space-x-4">
            {location.pathname !== '/dashboard' ? (
              <>
                {location.pathname !== '/login' && (
                  <Link 
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <Github size={16} />
                    Login with Github
                  </Link>
                )}
                {location.pathname === '/login' && (
                  <Link 
                    to="/"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    Back to Home
                  </Link>
                )}
              </>
            ) : (
              <Link 
                to="/"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
              >
                Logout
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md py-4 px-4 transform origin-top transition-all duration-300 ease-in-out">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/"
              className={`text-sm font-medium transition-all duration-300 ${isActive('/') ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          
            
            {location.pathname !== '/dashboard' ? (
              location.pathname !== '/login' && (
                <Link 
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Github size={16} />
                  Login with Github
                </Link>
              )
            ) : (
              <Link 
                to="/"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Logout
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;