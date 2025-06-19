
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fileService, AttachedFile } from '@/services/fileService';

interface MeetingAttachmentsProps {
  files: AttachedFile[];
  readOnly?: boolean;
}

const MeetingAttachments: React.FC<MeetingAttachmentsProps> = ({ 
  files, 
  readOnly = false 
}) => {
  const handleDownload = (file: AttachedFile) => {
    fileService.downloadFile(file.id);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('doc')) return '📝';
    if (type.includes('xls') || type.includes('sheet')) return '📊';
    return '📎';
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>{readOnly ? 'Nenhum arquivo anexado' : 'Anexe arquivos durante a criação da reunião'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getFileIcon(file.type)}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{file.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>Enviado por {file.uploadedBy}</span>
                <span>•</span>
                <span>{format(new Date(file.uploadedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(file)}
            className="hover:bg-[#4d8d6e] hover:text-white hover:border-[#4d8d6e]"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MeetingAttachments;
