
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Briefcase } from 'lucide-react';
import { Sector, Department, Position } from '@/types/database';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SectorManager: React.FC = () => {
  const { user } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [isSectorDialogOpen, setIsSectorDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    positionNames: ['']
  });
  const [sectorFormData, setSectorFormData] = useState({
    name: '',
    department_id: ''
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
      const [sectorsData, departmentsData, positionsData] = await Promise.all([
        apiService.getSectorsByEntity(user.entity_id),
        apiService.getDepartmentsByEntity(user.entity_id),
        apiService.getPositionsByEntity(user.entity_id)
      ]);
      setSectors(sectorsData);
      setDepartments(departmentsData);
      setPositions(positionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ positionNames: [''] });
    setSelectedSector(null);
  };

  const resetSectorForm = () => {
    setSectorFormData({ name: '', department_id: '' });
  };

  const addPositionField = () => {
    setFormData(prev => ({
      ...prev,
      positionNames: [...prev.positionNames, '']
    }));
  };

  const removePositionField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      positionNames: prev.positionNames.filter((_, i) => i !== index)
    }));
  };

  const updatePositionName = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      positionNames: prev.positionNames.map((name, i) => i === index ? value : name)
    }));
  };

  const handleAddPositions = (sector: Sector) => {
    setSelectedSector(sector);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entity_id || !selectedSector) return;

    try {
      const validPositionNames = formData.positionNames.filter(name => name.trim() !== '');
      
      for (const positionName of validPositionNames) {
        await apiService.createPosition({
          name: positionName.trim(),
          description: `Cargo do setor ${selectedSector.name}`,
          sector_id: selectedSector.id,
          entity_id: user.entity_id
        });
      }
      
      toast.success(`${validPositionNames.length} cargos criados com sucesso`);
      setIsDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error saving positions:', error);
      toast.error('Erro ao salvar cargos');
    }
  };

  const handleSectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entity_id || !sectorFormData.name.trim() || !sectorFormData.department_id) return;

    try {
      await apiService.createSector({
        name: sectorFormData.name.trim(),
        description: `Setor criado individualmente`,
        department_id: sectorFormData.department_id,
        entity_id: user.entity_id
      });
      
      toast.success('Setor criado com sucesso');
      setIsSectorDialogOpen(false);
      resetSectorForm();
      await loadData();
    } catch (error) {
      console.error('Error saving sector:', error);
      toast.error('Erro ao salvar setor');
    }
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department?.name || 'Departamento não encontrado';
  };

  const getSectorPositions = (sectorId: string) => {
    return positions.filter(position => position.sector_id === sectorId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Setores</h2>
        <div className="text-center py-8">Carregando setores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Setores</h2>
        <Dialog open={isSectorDialogOpen} onOpenChange={setIsSectorDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetSectorForm} className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Setor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSectorSubmit} className="space-y-4">
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Select value={sectorFormData.department_id} onValueChange={(value) => setSectorFormData({...sectorFormData, department_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sectorName">Nome do Setor</Label>
                <Input
                  id="sectorName"
                  value={sectorFormData.name}
                  onChange={(e) => setSectorFormData({...sectorFormData, name: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
                Cadastrar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sectors.map((sector) => {
          const sectorPositions = getSectorPositions(sector.id);
          
          return (
            <Card key={sector.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  {sector.name}
                </CardTitle>
                <Button
                  onClick={() => handleAddPositions(sector)}
                  size="sm"
                  className="bg-[#4d8d6e] hover:bg-[#3a6b54]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Cargos
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Departamento:</strong> {getDepartmentName(sector.department_id)}
                </p>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                    Cargos ({sectorPositions.length}):
                  </h4>
                  {sectorPositions.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {sectorPositions.map((position) => (
                        <div key={position.id} className="bg-gray-50 p-2 rounded text-sm">
                          {position.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhum cargo cadastrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Adicionar Cargos ao Setor: {selectedSector?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Cargos para este Setor</Label>
                <Button type="button" onClick={addPositionField} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Cargo
                </Button>
              </div>
              <div className="space-y-2">
                {formData.positionNames.map((positionName, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Nome do cargo ${index + 1}`}
                      value={positionName}
                      onChange={(e) => updatePositionName(index, e.target.value)}
                    />
                    {formData.positionNames.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePositionField(index)}
                        size="sm"
                        variant="outline"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
              Criar Cargos
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectorManager;
