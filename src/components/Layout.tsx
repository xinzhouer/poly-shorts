import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlayCircle, User, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Player page handles its own layout (full screen)
  const isPlayer = location.pathname.startsWith('/player');

  if (isPlayer) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex justify-center">
      <div className="w-full max-w-md bg-neutral-900 min-h-screen relative flex flex-col shadow-2xl shadow-black">
        <main className="flex-1 overflow-y-auto pb-0 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
