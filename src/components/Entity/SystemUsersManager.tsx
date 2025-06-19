
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Users } from 'lucide-react';
import { User } from '@/types/database';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SystemUsersManager: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (user?.entity_id) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    if (!user?.entity_id) return;
    
    try {
      setIsLoading(true);
      const data = await apiService.getUsersByEntity(user.entity_id);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '' });
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entity_id) return;

    try {
      if (editingUser) {
        await apiService.updateUser(editingUser.id, formData);
        toast.success('Usuário atualizado com sucesso');
      } else {
        await apiService.createUser({
          ...formData,
          role: 'user',
          entity_id: user.entity_id
        });
        toast.success('Usuário criado com sucesso');
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email
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
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    }
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
                <Label htmlFor="name">Nome Completo</Label>
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
              <Button type="submit" className="w-full bg-[#4d8d6e] hover:bg-[#3a6b54]">
                {editingUser ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {users.filter(u => u.role === 'user').map((systemUser) => (
          <Card key={systemUser.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-[#4d8d6e]" />
                {systemUser.name}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(systemUser)}
                  className="border-[#4d8d6e] text-[#4d8d6e] hover:bg-[#4d8d6e] hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(systemUser.id)}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{systemUser.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Cadastrado em: {new Date(systemUser.created_at).toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        ))}
        
        {users.filter(u => u.role === 'user').length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum usuário cadastrado ainda.</p>
              <p className="text-sm text-gray-400 mt-1">
                Clique em "Novo Usuário" para adicionar o primeiro usuário.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SystemUsersManager;
