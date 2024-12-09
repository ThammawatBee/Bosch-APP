import { CreateEquipmentFormValues, EditEquipmentFormValues, Equipment } from '@/interface/CreateEquipmentForm';
import { listEquipments, createEquipment, editEquipment } from '../service/bosch';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

interface EquipmentState {
  equipments: Equipment[] | null
  isLoading: boolean
  error: any
  fetchEquipments: () => Promise<void>
  createEquipment: (equipment: CreateEquipmentFormValues) => Promise<void>
  editEquipment: (id: string, equipment: EditEquipmentFormValues) => Promise<void>
}

const useEquipmentStore = create<EquipmentState>()(
  devtools((set) => ({
    equipments: null,
    isLoading: false,
    error: null,

    fetchEquipments: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await listEquipments();
        set({ equipments: response.equipments, isLoading: false });
      } catch (error: any) {
        set({ isLoading: false });
        throw error
      }
    },
    createEquipment: async (equipment: CreateEquipmentFormValues) => {
      try {
        await createEquipment(equipment)
        const response = await listEquipments();
        set({ equipments: response.equipments });
      } catch (error: any) {
        throw error
      }
    },
    editEquipment: async (id: string, equipment: EditEquipmentFormValues) => {
      try {
        await editEquipment(id, equipment)
        const response = await listEquipments();
        set({ equipments: response.equipments });
      } catch (error: any) {
        throw error
      }
    }
  }))
);

export default useEquipmentStore