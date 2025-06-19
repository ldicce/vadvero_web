
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Building2 } from 'lucide-react';
import { Department, Sector } from '@/types/database';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DepartmentManager: React.FC = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [sectorFormData, setSectorFormData] = useState({
    name: ''
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
      const [departmentsData, sectorsData] = await Promise.all([
        apiService.getDepartmentsByEntity(user.entity_id),
        apiService.getSectorsByEntity(user.entity_id)
      ]);
      setDepartments(departmentsData);
      setSectors(sectorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingDepartment(null);
  };

  const resetSectorForm = () => {
    setSectorFormData({ name: '' });
    setSelectedDepartment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entity_id) return;

    try {
      if (editingDepartment) {
        await apiService.updateDepartment(editingDepartment.id, formData);
        toast.success('Departamento atualizado com sucesso');
      } else {
        await apiService.createDepartment({
          ...formData,
          entity_id: user.entity_id
        });
        toast.success('Departamento criado com sucesso');
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Erro ao salvar departamento');
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este departamento?')) {
      return;
    }

    try {
      await apiService.deleteDepartment(id);
      toast.success('Departamento excluído com sucesso');
      await loadData();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Erro ao excluir departamento');
    }
  };

  const handleAddSector = (department: Department) => {
    setSelectedDepartment(department);
    setShowSectorDialog(true);
  };

  const handleSectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entity_id || !selectedDepartment || !sectorFormData.name.trim()) return;

    try {
      await apiService.createSector({
        name: sectorFormData.name.trim(),
        description: `Setor do departamento ${selectedDepartment.name}`,
        department_id: selectedDepartment.id,
        entity_id: user.entity_id
      });
      
      toast.success('Setor criado com sucesso');
      setShowSectorDialog(false);
      resetSectorForm();
      await loadData();
    } catch (error) {
      console.error('Error saving sector:', error);
      toast.error('Erro ao salvar setor');
    }
  };

  const getDepartmentSectors = (departmentId: string) => {
    return sectors.filter(sector => sector.department_id === departmentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Departamentos</h2>
        <div className="text-center py-8">Carregando departamentos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Departamentos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Departamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Editar Departamento' : 'Novo Departamento'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Departamento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({name: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
                {editingDepartment ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {departments.map((department) => {
          const departmentSectors = getDepartmentSectors(department.id);
          
          return (
            <Card key={department.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  {department.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAddSector(department)}
                    size="sm"
                    className="bg-[#4d8d6e] hover:bg-[#3a6b54]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Setor
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(department)}
                    className="border-[#4d8d6e] text-[#4d8d6e] hover:bg-[#4d8d6e] hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(department.id)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                    Setores ({departmentSectors.length}):
                  </h4>
                  {departmentSectors.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {departmentSectors.map((sector) => (
                        <div key={sector.id} className="bg-gray-50 p-2 rounded text-sm">
                          {sector.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhum setor cadastrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {departments.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum departamento cadastrado ainda.</p>
              <p className="text-sm text-gray-400 mt-1">
                Clique em "Novo Departamento" para adicionar o primeiro departamento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Adicionar Setor ao Departamento: {selectedDepartment?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSectorSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sectorName">Nome do Setor</Label>
              <Input
                id="sectorName"
                placeholder="Digite o nome do setor"
                value={sectorFormData.name}
                onChange={(e) => setSectorFormData({name: e.target.value})}
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
              Criar Setor
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManager;
