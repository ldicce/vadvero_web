
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Mail } from 'lucide-react';
import { User, Entity } from '@/types/database';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

const SystemUserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'entity' as 'admin' | 'entity' | 'user',
    entity_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersData, entitiesData] = await Promise.all([
        apiService.getUsers(),
        apiService.getEntities()
      ]);
      setUsers(usersData);
      setEntities(entitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'entity', entity_id: '' });
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await apiService.updateUser(editingUser.id, formData);
        toast.success('Usuário atualizado com sucesso');
      } else {
        await apiService.createUser(formData);
        toast.success('Usuário criado com sucesso. Email de acesso enviado!');
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      entity_id: user.entity_id || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      await apiService.deleteUser(id);
      toast.success('Usuário excluído com sucesso');
      await loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const sendAccessEmail = async (userId: string) => {
    try {
      await apiService.sendAccessEmail(userId);
      toast.success('Email de acesso reenviado com sucesso');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Erro ao enviar email');
    }
  };

  const getEntityName = (entityId?: string) => {
    if (!entityId) return 'N/A';
    const entity = entities.find(e => e.id === entityId);
    return entity?.nome || 'Entidade não encontrada';
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      entity: 'Entidade',
      user: 'Usuário'
    };
    return roles[role as keyof typeof roles] || role;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Usuários do Sistema</h2>
        <div className="text-center py-8">Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Usuários do Sistema</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              <div>
                <Label htmlFor="role">Perfil</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="entity">Entidade</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role !== 'admin' && (
                <div>
                  <Label htmlFor="entity">Entidade</Label>
                  <Select value={formData.entity_id} onValueChange={(value) => setFormData({...formData, entity_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma entidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
                {editingUser ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendAccessEmail(user.id)}
                  title="Reenviar email de acesso"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Perfil:</strong> {getRoleLabel(user.role)}</p>
                </div>
                <div>
                  <p><strong>Entidade:</strong> {getEntityName(user.entity_id)}</p>
                  <p><strong>Criado em:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SystemUserManager;
