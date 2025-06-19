
interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  meetingId: string;
  fileData: string; // base64 string
}

class FileService {
  private storageKey = 'meeting_files';

  getFilesByMeeting(meetingId: string): AttachedFile[] {
    const files = this.getAllFiles();
    return files.filter(file => file.meetingId === meetingId);
  }

  getAllFiles(): AttachedFile[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveFile(file: Omit<AttachedFile, 'id'>): AttachedFile {
    const files = this.getAllFiles();
    const newFile: AttachedFile = {
      ...file,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36)
    };
    
    files.push(newFile);
    localStorage.setItem(this.storageKey, JSON.stringify(files));
    return newFile;
  }

  deleteFile(fileId: string): void {
    const files = this.getAllFiles();
    const filtered = files.filter(file => file.id !== fileId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  downloadFile(fileId: string): void {
    const files = this.getAllFiles();
    const file = files.find(f => f.id === fileId);
    
    if (file) {
      const link = document.createElement('a');
      link.href = file.fileData;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export const fileService = new FileService();
export type { AttachedFile };
