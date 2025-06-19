import { AuthService } from './auth-service';
import { EntityService } from './entity-service';
import { UserService } from './user-service';
import { OrganizationService } from './organization-service';
import { MeetingService } from './meeting-service';
import { ReuniaoService } from './reuniao-service';

class ApiService {
  private authService = new AuthService();
  private entityService = new EntityService();
  private userService = new UserService();
  private organizationService = new OrganizationService();
  private meetingService = new MeetingService();
  private reuniaoService = new ReuniaoService();

  // Auth methods
  async login(email: string, password: string) {
    const result = await this.authService.login(email, password);
    // Sync token across all services
    this.entityService.setToken(this.authService['token']);
    this.userService.setToken(this.authService['token']);
    this.organizationService.setToken(this.authService['token']);
    this.meetingService.setToken(this.authService['token']);
    this.reuniaoService.setToken(this.authService['token']);
    return result;
  }

  setToken(token: string) {
    this.authService.setToken(token);
    this.entityService.setToken(token);
    this.userService.setToken(token);
    this.organizationService.setToken(token);
    this.meetingService.setToken(token);
    this.reuniaoService.setToken(token);
  }

  removeToken() {
    this.authService.removeToken();
    this.entityService.removeToken();
    this.userService.removeToken();
    this.organizationService.removeToken();
    this.meetingService.removeToken();
    this.reuniaoService.removeToken();
  }

  // Entity methods
  async getEntities() {
    return this.entityService.getEntities();
  }

  async getEntity(id: string) {
    return this.entityService.getEntity(id);
  }

  async createEntity(entityData: any) {
    return this.entityService.createEntity(entityData);
  }

  async updateEntity(id: string, entityData: any) {
    return this.entityService.updateEntity(id, entityData);
  }

  async deleteEntity(id: string) {
    return this.entityService.deleteEntity(id);
  }

  // User methods
  async getUsers() {
    return this.userService.getUsers();
  }

  async getUsersByEntity(entityId: string) {
    return this.userService.getUsersByEntity(entityId);
  }

  async createUser(userData: any) {
    return this.userService.createUser(userData);
  }

  async updateUser(id: string, userData: any) {
    return this.userService.updateUser(id, userData);
  }

  async deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }

  async sendAccessEmail(userId: string) {
    return this.userService.sendAccessEmail(userId);
  }

  // Department methods
  async getDepartmentsByEntity(entityId: string) {
    return this.organizationService.getDepartmentsByEntity(entityId);
  }

  async createDepartment(departmentData: any) {
    return this.organizationService.createDepartment(departmentData);
  }

  async updateDepartment(id: string, departmentData: any) {
    return this.organizationService.updateDepartment(id, departmentData);
  }

  async deleteDepartment(id: string) {
    return this.organizationService.deleteDepartment(id);
  }

  // Sector methods
  async getSectorsByEntity(entityId: string) {
    return this.organizationService.getSectorsByEntity(entityId);
  }

  async createSector(sectorData: any) {
    return this.organizationService.createSector(sectorData);
  }

  async updateSector(id: string, sectorData: any) {
    return this.organizationService.updateSector(id, sectorData);
  }

  async deleteSector(id: string) {
    return this.organizationService.deleteSector(id);
  }

  // Position methods
  async getPositionsByEntity(entityId: string) {
    return this.organizationService.getPositionsByEntity(entityId);
  }

  async createPosition(positionData: any) {
    return this.organizationService.createPosition(positionData);
  }

  async updatePosition(id: string, positionData: any) {
    return this.organizationService.updatePosition(id, positionData);
  }

  async deletePosition(id: string) {
    return this.organizationService.deletePosition(id);
  }

  // Meeting methods
  async getMeetingsByEntity(entityId: string) {
    return this.meetingService.getMeetingsByEntity(entityId);
  }

  async createMeeting(meetingData: any) {
    return this.meetingService.createMeeting(meetingData);
  }

  async updateMeeting(id: string, meetingData: any) {
    return this.meetingService.updateMeeting(id, meetingData);
  }

  async deleteMeeting(id: string) {
    return this.meetingService.deleteMeeting(id);
  }

  // Reunião methods
  async getReunioes() {
    return this.reuniaoService.getReunioes();
  }

  async createReuniao(reuniaoData: any) {
    return this.reuniaoService.createReuniao(reuniaoData);
  }

  async updateReuniao(id: string, reuniaoData: any) {
    return this.reuniaoService.updateReuniao(id, reuniaoData);
  }

  async deleteReuniao(id: string) {
    return this.reuniaoService.deleteReuniao(id);
  }

  // Anexo methods
  async getAnexosByReuniao(reuniaoId: string) {
    return this.reuniaoService.getAnexosByReuniao(reuniaoId);
  }

  async createAnexo(anexoData: any) {
    return this.reuniaoService.createAnexo(anexoData);
  }

  async deleteAnexo(id: string) {
    return this.reuniaoService.deleteAnexo(id);
  }

  // Pauta methods
  async getPautasByReuniao(reuniaoId: string) {
    return this.reuniaoService.getPautasByReuniao(reuniaoId);
  }

  async createPauta(pautaData: any) {
    return this.reuniaoService.createPauta(pautaData);
  }

  async updatePauta(id: string, pautaData: any) {
    return this.reuniaoService.updatePauta(id, pautaData);
  }

  async deletePauta(id: string) {
    return this.reuniaoService.deletePauta(id);
  }
}

export const apiService = new ApiService();
