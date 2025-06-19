
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, UserCog } from 'lucide-react';
import { Position, Sector, Department } from '@/types/database';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PositionManager: React.FC = () => {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    sector_id: ''
  });

  useEffect(() => {
    if (user?.entity_id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.entity_id) return;
    
    try {
      setIsLoading(true);
      const [positionsData, sectorsData, departmentsData] = await Promise.all([
        apiService.getPositionsByEntity(user.entity_id),
        apiService.getSectorsByEntity(user.entity_id),
        apiService.getDepartmentsByEntity(user.entity_id)
      ]);
      setPositions(positionsData);
      setSectors(sectorsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', sector_id: '' });
    setEditingPosition(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entity_id) return;

    try {
      if (editingPosition) {
        await apiService.updatePosition(editingPosition.id, formData);
        toast.success('Cargo atualizado com sucesso');
      } else {
        await apiService.createPosition({
          ...formData,
          entity_id: user.entity_id
        });
        toast.success('Cargo criado com sucesso');
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Erro ao salvar cargo');
    }
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      sector_id: position.sector_id
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cargo?')) {
      return;
    }

    try {
      await apiService.deletePosition(id);
      toast.success('Cargo excluído com sucesso');
      await loadData();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Erro ao excluir cargo');
    }
  };

  const getSectorName = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    return sector?.name || 'Setor não encontrado';
  };

  const getDepartmentName = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (!sector) return 'Departamento não encontrado';
    
    const department = departments.find(d => d.id === sector.department_id);
    return department?.name || 'Departamento não encontrado';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Cargos</h2>
        <div className="text-center py-8">Carregando cargos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Cargos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cargo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPosition ? 'Editar Cargo' : 'Novo Cargo'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sector">Setor</Label>
                <Select value={formData.sector_id} onValueChange={(value) => setFormData({...formData, sector_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Nome do Cargo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
                {editingPosition ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                {position.name}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(position)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(position.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                <p><strong>Setor:</strong> {getSectorName(position.sector_id)}</p>
                <p><strong>Departamento:</strong> {getDepartmentName(position.sector_id)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PositionManager;
