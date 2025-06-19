
import { BaseApiService } from './base-api';
import { LocalDataService } from './local-data';

export class EntityService extends BaseApiService {
  private localDataService = LocalDataService.getInstance();

  async getEntities() {
    try {
      const response = await fetch(`${this.baseURL}/entities`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entities');
      }

      const entities = await response.json();
      return entities;
    } catch (error) {
      console.error('Error fetching entities:', error);
      // Fallback to localStorage if backend is not available
      await new Promise(resolve => setTimeout(resolve, 200));
      const data = this.localDataService.getLocalData();
      return data.entities;
    }
  }

  async getEntity(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/entities/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Entity not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching entity:', error);
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 200));
      const data = this.localDataService.getLocalData();
      const entity = data.entities.find(e => e.id === id);
      if (!entity) throw new Error('Entity not found');
      return entity;
    }
  }

  async createEntity(entityData: any) {
    try {
      console.log('Creating entity with data:', entityData);
      
      const response = await fetch(`${this.baseURL}/entities`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(entityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.error || 'Failed to create entity');
      }

      const result = await response.json();
      console.log('Entity created successfully:', result);
      return result.empresa || result;
    } catch (error) {
      console.error('Error creating entity:', error);
      // Fallback to localStorage if backend is not available
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = this.localDataService.getLocalData();
      const newEntity = {
        ...entityData,
        id: this.generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      data.entities.push(newEntity);
      this.localDataService.saveLocalData(data);
      return newEntity;
    }
  }

  async updateEntity(id: string, entityData: any) {
    try {
      const response = await fetch(`${this.baseURL}/entities/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(entityData),
      });

      if (!response.ok) {
        throw new Error('Failed to update entity');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating entity:', error);
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = this.localDataService.getLocalData();
      const index = data.entities.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Entity not found');
      
      data.entities[index] = {
        ...data.entities[index],
        ...entityData,
        updated_at: new Date().toISOString()
      };
      this.localDataService.saveLocalData(data);
      return data.entities[index];
    }
  }

  async deleteEntity(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/entities/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete entity');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting entity:', error);
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = this.localDataService.getLocalData();
      const index = data.entities.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Entity not found');
      
      data.entities.splice(index, 1);
      this.localDataService.saveLocalData(data);
      return { message: 'Entity deleted successfully' };
    }
  }
}
