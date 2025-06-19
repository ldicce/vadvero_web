
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Bem-vindo, {user?.name}
          </h2>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? 'Gerencie entidades e configurações do sistema' 
              : 'Gerencie suas reuniões e equipe'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
