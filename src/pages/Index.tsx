
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import EntityDashboard from '@/components/Dashboard/EntityDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  console.log('Index component - user:', user, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Usuários admin veem o painel administrativo
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Usuários de entidade veem o painel da entidade
  if (user.role === 'entity') {
    return <EntityDashboard />;
  }

  // Fallback para outros tipos de usuário
  return <EntityDashboard />;
};

export default Index;
