import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import AgendaCalendar from '@/components/Calendar/AgendaCalendar';
import MeetingForm from '@/components/Meeting/MeetingForm';
import MeetingDetailsDialog from '@/components/Meeting/MeetingDetailsDialog';
import DepartmentManager from '@/components/Entity/DepartmentManager';
import SectorManager from '@/components/Entity/SectorManager';
import PositionManager from '@/components/Entity/PositionManager';
import UserProfile from '@/components/Entity/UserProfile';
import SystemUsersManager from '@/components/Entity/SystemUsersManager';
import { Reuniao } from '@/types/database';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EntityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [selectedReuniao, setSelectedReuniao] = useState<Reuniao | null>(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReunioes();
  }, []);

  const loadReunioes = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getReunioes();
      setReunioes(data);
    } catch (error) {
      console.error('Error loading reuniões:', error);
      toast.error('Erro ao carregar reuniões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (date: Date, dayReunioes: Reuniao[]) => {
    if (dayReunioes.length === 1) {
      setSelectedReuniao(dayReunioes[0]);
      setShowMeetingDetails(true);
    } else if (dayReunioes.length > 1) {
      // TODO: Show a list to select which reunião to view
      setSelectedReuniao(dayReunioes[0]);
      setShowMeetingDetails(true);
    }
  };

  const handleCreateReuniao = async (reuniaoData: any) => {
    try {
      console.log('Dados da reunião sendo enviados:', reuniaoData);
      await apiService.createReuniao(reuniaoData);
      toast.success('Reunião criada com sucesso');
      await loadReunioes();
    } catch (error) {
      console.error('Error creating reunião:', error);
      toast.error('Erro ao criar reunião');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'departments':
        return <DepartmentManager />;
      case 'sectors':
        return <SectorManager />;
      case 'positions':
        return <PositionManager />;
      case 'users':
        return <SystemUsersManager />;
      case 'profile':
        return <UserProfile />;
      case 'home':
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            {isLoading ? (
              <div className="text-center py-8">Carregando agenda...</div>
            ) : (
              <AgendaCalendar 
                reunioes={reunioes}
                onDayClick={handleDayClick}
                onCreateReuniao={() => setShowMeetingForm(true)}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1">
        <Header />
        <main className="p-6 ml-64">
          {renderContent()}
        </main>
      </div>

      <MeetingForm
        open={showMeetingForm}
        onOpenChange={setShowMeetingForm}
        onSubmit={handleCreateReuniao}
      />

      <MeetingDetailsDialog
        reuniao={selectedReuniao}
        open={showMeetingDetails}
        onOpenChange={setShowMeetingDetails}
      />
    </div>
  );
};

export default EntityDashboard;
