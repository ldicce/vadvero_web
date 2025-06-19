
interface LocalData {
  entities: any[];
  departments: any[];
  sectors: any[];
  positions: any[];
  users: any[];
  meetings: any[];
  reunioes: any[];
  anexos: any[];
  pautas: any[];
}

export class LocalDataService {
  private static instance: LocalDataService;

  static getInstance(): LocalDataService {
    if (!LocalDataService.instance) {
      LocalDataService.instance = new LocalDataService();
    }
    return LocalDataService.instance;
  }

  constructor() {
    this.initializeLocalData();
  }

  private initializeLocalData() {
    const localData = localStorage.getItem('localData');
    if (!localData) {
      const initialData: LocalData = {
        entities: [],
        departments: [],
        sectors: [],
        positions: [],
        users: [],
        meetings: [],
        reunioes: [],
        anexos: [],
        pautas: []
      };
      localStorage.setItem('localData', JSON.stringify(initialData));
    }
  }

  getLocalData(): LocalData {
    const data = localStorage.getItem('localData');
    return data ? JSON.parse(data) : {
      entities: [],
      departments: [],
      sectors: [],
      positions: [],
      users: [],
      meetings: [],
      reunioes: [],
      anexos: [],
      pautas: []
    };
  }

  saveLocalData(data: LocalData) {
    localStorage.setItem('localData', JSON.stringify(data));
  }
}
