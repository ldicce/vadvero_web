
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash } from 'lucide-react';
import { Entity } from '@/types/database';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

const EntityList: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Dados da empresa
    nome: '',
    email: '',
    cnpj: '',
    telefone1: '',
    celular1: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    // Dados do usuário da empresa
    usuario_nome: '',
    usuario_email: '',
    usuario_senha: ''
  });

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getEntities();
      setEntities(data);
    } catch (error) {
      console.error('Error loading entities:', error);
      toast.error('Erro ao carregar entidades');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      cnpj: '',
      telefone1: '',
      celular1: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      usuario_nome: '',
      usuario_email: '',
      usuario_senha: ''
    });
    setEditingEntity(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEntity) {
        // Para edição, apenas dados da empresa
        const empresaData = {
          nome: formData.nome,
          email: formData.email,
          cnpj: formData.cnpj,
          telefone1: formData.telefone1,
          celular1: formData.celular1,
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf
        };
        await apiService.updateEntity(editingEntity.id, empresaData);
        toast.success('Entidade atualizada com sucesso');
      } else {
        await apiService.createEntity(formData);
        toast.success('Entidade e usuário criados com sucesso');
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadEntities();
    } catch (error) {
      console.error('Error saving entity:', error);
      toast.error('Erro ao salvar entidade');
    }
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setFormData({
      nome: entity.nome || '',
      email: entity.email || '',
      cnpj: entity.cnpj || '',
      telefone1: entity.telefone1 || '',
      celular1: entity.celular1 || '',
      cep: entity.cep || '',
      logradouro: entity.logradouro || '',
      numero: entity.numero || '',
      complemento: entity.complemento || '',
      bairro: entity.bairro || '',
      cidade: entity.cidade || '',
      uf: entity.uf || '',
      usuario_nome: '',
      usuario_email: '',
      usuario_senha: ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta entidade? Isso também excluirá todos os usuários associados.')) {
      return;
    }

    try {
      await apiService.deleteEntity(id);
      toast.success('Entidade excluída com sucesso');
      await loadEntities();
    } catch (error) {
      console.error('Error deleting entity:', error);
      toast.error('Erro ao excluir entidade');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Gestão de Entidades</h2>
        <div className="text-center py-8">Carregando entidades...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Gestão de Entidades</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
              <Plus className="h-4 w-4 mr-2" />
              Nova Entidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntity ? 'Editar Entidade' : 'Nova Entidade'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados da Empresa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Dados da Empresa</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Empresa</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone1">Telefone</Label>
                    <Input
                      id="telefone1"
                      value={formData.telefone1}
                      onChange={(e) => setFormData({...formData, telefone1: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="celular1">Celular</Label>
                    <Input
                      id="celular1"
                      value={formData.celular1}
                      onChange={(e) => setFormData({...formData, celular1: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({...formData, cep: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input
                      id="logradouro"
                      value={formData.logradouro}
                      onChange={(e) => setFormData({...formData, logradouro: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData({...formData, uf: e.target.value})}
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              {/* Dados do Usuário da Empresa - apenas para criação */}
              {!editingEntity && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dados do Usuário da Empresa</h3>
                  
                  <div>
                    <Label htmlFor="usuario_nome">Nome do Usuário</Label>
                    <Input
                      id="usuario_nome"
                      value={formData.usuario_nome}
                      onChange={(e) => setFormData({...formData, usuario_nome: e.target.value})}
                      required={!editingEntity}
                    />
                  </div>

                  <div>
                    <Label htmlFor="usuario_email">Email do Usuário</Label>
                    <Input
                      id="usuario_email"
                      type="email"
                      value={formData.usuario_email}
                      onChange={(e) => setFormData({...formData, usuario_email: e.target.value})}
                      required={!editingEntity}
                    />
                  </div>

                  <div>
                    <Label htmlFor="usuario_senha">Senha do Usuário</Label>
                    <Input
                      id="usuario_senha"
                      type="password"
                      value={formData.usuario_senha}
                      onChange={(e) => setFormData({...formData, usuario_senha: e.target.value})}
                      required={!editingEntity}
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
                {editingEntity ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {entities.map((entity) => (
          <Card key={entity.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">{entity.nome}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(entity)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(entity.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Email:</strong> {entity.email}</p>
                  <p><strong>CNPJ:</strong> {entity.cnpj}</p>
                  <p><strong>Telefone:</strong> {entity.telefone1}</p>
                  <p><strong>Celular:</strong> {entity.celular1}</p>
                </div>
                <div>
                  <p><strong>Endereço:</strong> {entity.logradouro}, {entity.numero}</p>
                  <p><strong>Bairro:</strong> {entity.bairro}</p>
                  <p><strong>Cidade:</strong> {entity.cidade} - {entity.uf}</p>
                  <p><strong>CEP:</strong> {entity.cep}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EntityList;
