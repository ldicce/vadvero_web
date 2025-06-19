
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Building2,
  Briefcase,
  UserCog,
  Settings,
  UsersRound
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const adminMenuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'entities', label: 'Entidades', icon: Building2 },
  ];

  const entityMenuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'departments', label: 'Departamentos', icon: Building2 },
    { id: 'sectors', label: 'Setores', icon: Briefcase },
    { id: 'positions', label: 'Cargos', icon: UserCog },
    { id: 'users', label: 'Usuários Sistema', icon: UsersRound },
    { id: 'profile', label: 'Meu Cadastro', icon: Settings },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : entityMenuItems;

  return (
    <div className="w-64 bg-[#4d8d6e] text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-[#3a6b54]">
        <h1 className="text-xl font-bold">Sistema de Reuniões</h1>
        <p className="text-sm text-green-100 mt-1">
          {user?.role === 'admin' ? 'Painel Administrativo' : 'Painel da Entidade'}
        </p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  "hover:bg-[#3a6b54]",
                  activeTab === item.id 
                    ? "bg-[#2f5544] text-white" 
                    : "text-green-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#3a6b54]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#2f5544] rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-green-100">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
