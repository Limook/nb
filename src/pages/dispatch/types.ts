export type DispatchStatus = 'dispatching' | 'dispatched' | 'cancelled' | 'loaded' | 'unloaded' | 'completed';

export interface Dispatch {
  id: number;
  client: string;
  origin: string;
  originDate: string;
  destination: string;
  destinationDate: string;
  spec: string;
  status: DispatchStatus;
  fee: number | string;
  originalFee?: number | string;
  settleMethod: string;
  commission: string;
  settleDate: string;
  cargoItem: string;
  memo: string;
  date: string;
  driverName?: string;
  driverPhone?: string;
  carNumber?: string;
  waypoints?: string[];
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  businessNo: string;
  ceoName: string;
  ceoPhone: string;
  contactName: string;
  contactPhone: string;
  origins: string[];
  destinations: string[];
  items: string[];
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  vNumber: string;
  type: string;
  spec: string;
  bank: string;
}

export interface KeyboardStep {
  name: string;
  field: string;
  guide: string;
  optional: boolean;
  defaultValue: string;
}

export interface FormDataState {
  clientName: string;
  clientPhone: string;
  clientContact: string;
  origin: string;
  originDate: string;
  destination: string;
  destinationDate: string;
  waypoints: string[];
  tonnage: string;
  carType: string;
  weight: string;
  settleMethod: string;
  fee: string;
  commission: string;
  settleDate: string;
  cargoItem: string;
  memo: string;
}
