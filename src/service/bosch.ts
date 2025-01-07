import { CreateEquipmentFormValues, EditEquipmentFormValues, Equipment, ListEquipmentOptions, ListInspectionEquipmentOptions, ListReportOptions } from '@/interface/CreateEquipmentForm';

import axiosInstance from './axios';
import { CreateReport, EquipmentReport } from '@/interface/Report';

export const listEquipments = async (options?: ListEquipmentOptions) => {
  try {
    const response = await axiosInstance.get('/equipments', { params: options });
    return response as unknown as { equipments: Equipment[], count: number };
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
};

export const createEquipment = async (data: CreateEquipmentFormValues) => {
  try {
    const response = await axiosInstance.post('/equipment', data);
    return response;
  } catch (error) {
    console.error('Error create equipment:', error);
    throw error;
  }
}

export const editEquipment = async (id: string, data: EditEquipmentFormValues) => {
  try {
    const response = await axiosInstance.patch(`/equipment/${id}`, data);
    return response as unknown as { equipment: Equipment };;
  } catch (error) {
    console.error('Error edit equipment:', error);
    throw error;
  }
}

export const listInspectionEquipments = async (inspectDate: string, options?: ListInspectionEquipmentOptions) => {
  try {
    const response = await axiosInstance.get('/inspection-equipments', { params: { ...options, inspectDate } });
    return response as unknown as { equipments: Equipment[], count: number };
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
}

export const listReports = async (options?: ListReportOptions) => {
  try {
    const response = await axiosInstance.get('/reports', { params: options });
    return response as unknown as { reports: EquipmentReport[], count: number };
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

export const createReports = async (reports: CreateReport[]) => {
  const response = await axiosInstance.post(`/report`, { reports });
  return response;
}

export const checkEquipmentExpiredDate = async () => {
  const response = await axiosInstance.patch(`/equipment/expired-date`);
  return response;
}
