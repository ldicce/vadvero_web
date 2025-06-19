
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, User, Building2, Mail, MapPin } from 'lucide-react';
import { Entity } from '@/types/database';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
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
    uf: ''
  });

  useEffect(() => {
    if (user?.entity_id) {
      loadEntityProfile();
    }
  }, [user]);

  const loadEntityProfile = async () => {
    if (!user?.entity_id) return;
    
    try {
      setIsLoading(true);
      const entityData = await apiService.getEntity(user.entity_id);
      setEntity(entityData);
      setFormData({
        nome: entityData.nome || '',
        email: entityData.email || '',
        cnpj: entityData.cnpj || '',
        telefone1: entityData.telefone1 || '',
        celular1: entityData.celular1 || '',
        cep: entityData.cep || '',
        logradouro: entityData.logradouro || '',
        numero: entityData.numero || '',
        complemento: entityData.complemento || '',
        bairro: entityData.bairro || '',
        cidade: entityData.cidade || '',
        uf: entityData.uf || ''
      });
    } catch (error) {
      console.error('Error loading entity profile:', error);
      toast.error('Erro ao carregar perfil da entidade');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.entity_id) return;

    try {
      const updatedEntity = await apiService.updateEntity(user.entity_id, formData);
      setEntity(updatedEntity);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Error updating entity profile:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleCancel = () => {
    if (entity) {
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
        uf: entity.uf || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Meu Cadastro</h2>
        <div className="text-center py-8">Carregando dados...</div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Meu Cadastro</h2>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Dados da entidade não encontrados.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Meu Cadastro</h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#4d8d6e] hover:bg-[#3a6b54]"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Informações da Entidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Entidade</Label>
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
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData({...formData, cep: e.target.value})}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="logradouro">Endereço</Label>
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
                <div>
                  <Label htmlFor="uf">Estado</Label>
                  <Input
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData({...formData, uf: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
                  Salvar Alterações
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-[#4d8d6e]" />
                    <div>
                      <p className="text-sm text-gray-500">Nome da Entidade</p>
                      <p className="font-medium">{entity.nome}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#4d8d6e]" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{entity.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-[#4d8d6e]" />
                    <div>
                      <p className="text-sm text-gray-500">CNPJ</p>
                      <p className="font-medium">{entity.cnpj}</p>
                    </div>
                  </div>
                  
                  {entity.telefone1 && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-[#4d8d6e]" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{entity.telefone1}</p>
                      </div>
                    </div>
                  )}
                  
                  {entity.celular1 && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-[#4d8d6e]" />
                      <div>
                        <p className="text-sm text-gray-500">Celular</p>
                        <p className="font-medium">{entity.celular1}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-[#4d8d6e]" />
                    <div>
                      <p className="text-sm text-gray-500">Endereço Completo</p>
                      <p className="font-medium">
                        {entity.logradouro}{entity.numero && `, ${entity.numero}`}
                      </p>
                      {entity.complemento && (
                        <p className="font-medium">{entity.complemento}</p>
                      )}
                      <p className="font-medium">
                        {entity.bairro}
                      </p>
                      <p className="font-medium">
                        {entity.cidade} - {entity.uf}
                      </p>
                      <p className="font-medium">CEP: {entity.cep}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Cadastrado em: {new Date(entity.created_at).toLocaleDateString('pt-BR')}
                </p>
                {entity.updated_at !== entity.created_at && (
                  <p className="text-sm text-gray-500">
                    Última atualização: {new Date(entity.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
