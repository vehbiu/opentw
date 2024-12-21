import Link from 'next/link';
import { Trophy, Calendar } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex flex-row justify-between w-full">
            <Link href="/" className="flex items-center">
              <Trophy className="h-6 w-6 text-blue-500" />
              <span className="ml-2 text-xl text-gray-900">TrackWrestling Viewer</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/tournaments" 
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                <Calendar className="h-5 w-5 mr-1" />
                Tournaments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;