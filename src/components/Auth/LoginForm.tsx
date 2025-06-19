
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Building2, Lock, Mail, Eye, EyeOff, UserCheck, Shield } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        toast.error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro ao fazer login - Verifique suas credenciais');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (userType: 'admin' | 'entity') => {
    if (userType === 'admin') {
      setEmail('admin@sistema.com');
      setPassword('admin123');
    } else {
      setEmail('entidade@empresa.com');
      setPassword('entidade123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4d8d6e] to-[#3a6b54] items-center justify-center p-12">
        <div className="text-center text-white">
          <Building2 className="h-20 w-20 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">Sistema de Reuniões</h1>
          <p className="text-xl opacity-90 mb-8">
            Gerencie suas reuniões e pautas de forma simples e eficiente
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Funcionalidades:</h3>
            <ul className="text-left space-y-2">
              <li>• Agenda de reuniões intuitiva</li>
              <li>• Gestão de pautas e considerações</li>
              <li>• Anexos de documentos</li>
              <li>• Controle de departamentos</li>
              <li>• Votações online e presenciais</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-[#4d8d6e]" />
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Reuniões</h1>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Login
              </CardTitle>
              <p className="text-gray-600">Faça login com suas credenciais</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Login Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 text-center">Acesso rápido:</p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fillCredentials('admin')}
                    className="flex-1 h-10 text-xs"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fillCredentials('entity')}
                    className="flex-1 h-10 text-xs"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Entidade
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="pl-10 h-12 border-gray-300 focus:border-[#4d8d6e] focus:ring-[#4d8d6e]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#4d8d6e] focus:ring-[#4d8d6e]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#4d8d6e] hover:bg-[#3a6b54] text-white font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
              
              <div className="text-center space-y-2">
                <div className="text-xs text-gray-500">
                  <p className="font-semibold">Credenciais de teste:</p>
                  <p>Admin: admin@sistema.com / admin123</p>
                  <p>Entidade: entidade@empresa.com / entidade123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
