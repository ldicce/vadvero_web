
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const meetingSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  data_inicial: z.date({ required_error: 'Data de início é obrigatória' }),
  hora_inicial: z.string().min(1, 'Hora de início é obrigatória'),
  data_final: z.date({ required_error: 'Data de fim é obrigatória' }),
  hora_final: z.string().min(1, 'Hora de fim é obrigatória'),
  mediador: z.string().min(1, 'Nome do mediador é obrigatório'),
  reuniao_presencial: z.boolean(),
  reuniao_online: z.boolean(),
  liberar_votacao_manual: z.boolean(),
  liberar_votacao_inicio_data: z.date().optional(),
  liberar_votacao_inicio_hora: z.string().optional(),
  liberar_votacao_fim_data: z.date().optional(),
  liberar_votacao_fim_hora: z.string().optional(),
  descricao: z.string().optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

interface MeetingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  const form = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      titulo: '',
      hora_inicial: '',
      hora_final: '',
      mediador: '',
      reuniao_presencial: false,
      reuniao_online: false,
      liberar_votacao_manual: false,
      liberar_votacao_inicio_hora: '',
      liberar_votacao_fim_hora: '',
      descricao: '',
    },
  });

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: MeetingFormData) => {
    const dataInicial = new Date(data.data_inicial);
    const [startHour, startMinute] = data.hora_inicial.split(':');
    dataInicial.setHours(parseInt(startHour), parseInt(startMinute));

    const dataFinal = new Date(data.data_final);
    const [endHour, endMinute] = data.hora_final.split(':');
    dataFinal.setHours(parseInt(endHour), parseInt(endMinute));

    let liberarVotacaoInicio, liberarVotacaoFim;
    if (!data.liberar_votacao_manual && data.liberar_votacao_inicio_data && data.liberar_votacao_inicio_hora) {
      liberarVotacaoInicio = new Date(data.liberar_votacao_inicio_data);
      const [vStartHour, vStartMinute] = data.liberar_votacao_inicio_hora.split(':');
      liberarVotacaoInicio.setHours(parseInt(vStartHour), parseInt(vStartMinute));
    }

    if (!data.liberar_votacao_manual && data.liberar_votacao_fim_data && data.liberar_votacao_fim_hora) {
      liberarVotacaoFim = new Date(data.liberar_votacao_fim_data);
      const [vEndHour, vEndMinute] = data.liberar_votacao_fim_hora.split(':');
      liberarVotacaoFim.setHours(parseInt(vEndHour), parseInt(vEndMinute));
    }

    const reuniaoData = {
      titulo: data.titulo,
      descricao: data.descricao || '',
      reuniao_presencial: data.reuniao_presencial,
      reuniao_online: data.reuniao_online,
      data_inicial: dataInicial.toISOString(),
      data_final: dataFinal.toISOString(),
      liberar_votacao_inicio: liberarVotacaoInicio?.toISOString() || null,
      liberar_votacao_fim: liberarVotacaoFim?.toISOString() || null,
      mediador: data.mediador,
      attached_files: attachedFiles,
    };

    onSubmit(reuniaoData);
    form.reset();
    setAttachedFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Reunião</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Reunião</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título da reunião" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_inicial"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hora_inicial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Início</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_final"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Fim</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hora_final"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Fim</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mediador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Mediador</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do mediador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="reuniao_presencial"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Reunião Presencial
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reuniao_online"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Reunião Online
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="liberar_votacao_manual"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue('liberar_votacao_inicio_data', undefined);
                            form.setValue('liberar_votacao_inicio_hora', '');
                            form.setValue('liberar_votacao_fim_data', undefined);
                            form.setValue('liberar_votacao_fim_hora', '');
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Liberar votação manualmente
                    </FormLabel>
                  </FormItem>
                )}
              />

              {!form.watch('liberar_votacao_manual') && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium">Período de Votação</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="liberar_votacao_inicio_data"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Início da Votação</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                  ) : (
                                    <span>Selecione a data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="liberar_votacao_inicio_hora"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de Início da Votação</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="liberar_votacao_fim_data"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Fim da Votação</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                  ) : (
                                    <span>Selecione a data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="liberar_votacao_fim_hora"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de Fim da Votação</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Arquivos Anexados</FormLabel>
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileAttachment}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer border-[#4d8d6e] text-[#4d8d6e] hover:bg-[#4d8d6e] hover:text-white"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Anexar Arquivo
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {attachedFiles.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#4d8d6e]" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Reunião</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite uma descrição para a reunião..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#4d8d6e] hover:bg-[#3a6b54]">
                Criar Reunião
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingForm;
