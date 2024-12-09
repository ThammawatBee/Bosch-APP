import { CreateEquipmentFormValues, EditEquipmentFormValues, Equipment } from '@/interface/CreateEquipmentForm';
import axiosInstance from './axios';

export const listEquipments = async () => {
  try {
    const response = await axiosInstance.get('/equipments');
    return response as unknown as { equipments: Equipment[] };
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
    return response;
  } catch (error) {
    console.error('Error edit equipment:', error);
    throw error;
  }
}
