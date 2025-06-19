
import { BaseApiService } from './base-api';
import { LocalDataService } from './local-data';

export class MeetingService extends BaseApiService {
  private localDataService = LocalDataService.getInstance();

  async getMeetingsByEntity(entityId: string) {
    try {
      const response = await fetch(`${this.baseURL}/meeting/entity/${entityId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching meetings:', error);
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 200));
      const data = this.localDataService.getLocalData();
      return data.meetings.filter(m => m.entity_id === entityId);
    }
  }

  async createMeeting(meetingData: any) {
    try {
      const response = await fetch(`${this.baseURL}/meeting`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating meeting:', error);
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = this.localDataService.getLocalData();
      const newMeeting = {
        ...meetingData,
        id: this.generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      data.meetings.push(newMeeting);
      this.localDataService.saveLocalData(data);
      return newMeeting;
    }
  }

  async updateMeeting(id: string, meetingData: any) {
    try {
      const response = await fetch(`${this.baseURL}/meeting/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        throw new Error('Failed to update meeting');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating meeting:', error);
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = this.localDataService.getLocalData();
      const index = data.meetings.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Meeting not found');
      
      data.meetings[index] = {
        ...data.meetings[index],
        ...meetingData,
        updated_at: new Date().toISOString()
      };
      this.localDataService.saveLocalData(data);
      return data.meetings[index];
    }
  }

  async deleteMeeting(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/meeting/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete meeting');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      // Fallback to localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = this.localDataService.getLocalData();
      const index = data.meetings.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Meeting not found');
      
      data.meetings.splice(index, 1);
      this.localDataService.saveLocalData(data);
      return { message: 'Meeting deleted successfully' };
    }
  }
}
