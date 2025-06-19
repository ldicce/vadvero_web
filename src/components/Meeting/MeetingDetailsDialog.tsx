
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Reuniao, PautaReuniao, AnexoReuniao } from '@/types/database';
import { Plus, MapPin, User, Clock, FileText } from 'lucide-react';
import { apiService } from '@/services/api';

interface MeetingDetailsDialogProps {
  reuniao: Reuniao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MeetingDetailsDialog: React.FC<MeetingDetailsDialogProps> = ({
  reuniao,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('pautas');
  const [pautas, setPautas] = useState<PautaReuniao[]>([]);
  const [anexos, setAnexos] = useState<AnexoReuniao[]>([]);

  useEffect(() => {
    if (reuniao?.id) {
      loadPautas();
      loadAnexos();
    }
  }, [reuniao?.id]);

  const loadPautas = async () => {
    if (!reuniao?.id) return;
    try {
      const data = await apiService.getPautasByReuniao(reuniao.id);
      setPautas(data);
    } catch (error) {
      console.error('Error loading pautas:', error);
    }
  };

  const loadAnexos = async () => {
    if (!reuniao?.id) return;
    try {
      const data = await apiService.getAnexosByReuniao(reuniao.id);
      setAnexos(data);
    } catch (error) {
      console.error('Error loading anexos:', error);
    }
  };

  if (!reuniao) return null;

  const tabButtonClass = (isActive: boolean) => 
    `py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
      isActive
        ? 'border-[#4d8d6e] text-[#4d8d6e]'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{reuniao.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meeting Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#4d8d6e]" />
                Informações da Reunião
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data e Hora</p>
                  <p className="text-lg">
                    {format(new Date(reuniao.data_inicial), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} 
                    {' até '}
                    {format(new Date(reuniao.data_final), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                {reuniao.mediador && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mediador</p>
                    <p className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-[#4d8d6e]" />
                      {reuniao.mediador}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {reuniao.reuniao_presencial && (
                  <Badge variant="outline" className="border-[#4d8d6e] text-[#4d8d6e]">Presencial</Badge>
                )}
                {reuniao.reuniao_online && (
                  <Badge variant="secondary" className="bg-[#4d8d6e]/10 text-[#4d8d6e]">Online</Badge>
                )}
              </div>

              {reuniao.liberar_votacao_inicio && reuniao.liberar_votacao_fim && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Período de Votação</p>
                  <p className="text-lg">
                    {format(new Date(reuniao.liberar_votacao_inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} 
                    {' até '}
                    {format(new Date(reuniao.liberar_votacao_fim), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              )}

              {reuniao.descricao && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Descrição</p>
                  <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                    {reuniao.descricao}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pautas')}
                className={tabButtonClass(activeTab === 'pautas')}
              >
                Pautas ({pautas.length})
              </button>
              <button
                onClick={() => setActiveTab('anexos')}
                className={tabButtonClass(activeTab === 'anexos')}
              >
                Anexos ({anexos.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'pautas' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#4d8d6e]" />
                    Pautas da Reunião
                  </CardTitle>
                  <Button size="sm" className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pauta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pautas.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma pauta cadastrada para esta reunião
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pautas.map((pauta, index) => (
                      <div key={pauta.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">
                          Pauta {index + 1}: {pauta.descricao}
                        </h4>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'anexos' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#4d8d6e]" />
                  Anexos da Reunião
                </CardTitle>
              </CardHeader>
              <CardContent>
                {anexos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum anexo cadastrado para esta reunião
                  </p>
                ) : (
                  <div className="space-y-4">
                    {anexos.map((anexo) => (
                      <div key={anexo.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">{anexo.arquivo}</h4>
                        {anexo.descricao && (
                          <p className="text-gray-600">{anexo.descricao}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDetailsDialog;
