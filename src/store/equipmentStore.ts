import { CreateEquipmentFormValues, EditEquipmentFormValues, Equipment } from '@/interface/CreateEquipmentForm';
import { listEquipments, createEquipment, editEquipment } from '../service/bosch';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DateTime } from 'luxon';
import omit from 'lodash/omit'
import pickBy from 'lodash/pickBy'

type EquipmentSearch = {
  type?: string
  equipmentNumber?: string
  name?: string
  brand?: string
  status?: string
  inspectionDayStart?: Date
  inspectionDayEnd?: Date
  expiredDayStart?: Date
  expiredDayEnd?: Date
  area?: string
}

interface EquipmentState {
  equipments: Equipment[] | null
  count: number
  isLoading: boolean
  error: any
  offset: number
  limit: number
  fetchEquipments: (options?: { limit?: number, offset?: number, changePage?: boolean, reset?: boolean }) => Promise<void>
  createEquipment: (equipment: CreateEquipmentFormValues) => Promise<void>
  editEquipment: (id: string, equipment: EditEquipmentFormValues) => Promise<void>
  search: EquipmentSearch
  setSearch: (input: EquipmentSearch) => void
  onPageChange: (page: number) => Promise<void>
  onPageSizeChange: (pageSize: number) => Promise<void>
}

export const generateEquipmentParam = (search: EquipmentSearch) => {
  const { inspectionDayStart, inspectionDayEnd, expiredDayStart, expiredDayEnd } = getDateSearchOption(search)
  return {
    ...pickBy(omit(search, ['inspectionDayStart', 'inspectionDayEnd', 'expiredDayStart', 'expiredDayEnd']), (search) => !!search),
    ...inspectionDayStart && inspectionDayEnd ? {
      inspectionDayStart,
      inspectionDayEnd,
    } : {},
    ...expiredDayStart && expiredDayEnd ? {
      expiredDayStart,
      expiredDayEnd,
    } : {},
  }
}

const getDateSearchOption = (search: EquipmentSearch) => {
  let inspectionDayStart = search.inspectionDayStart ? DateTime.fromJSDate(search.inspectionDayStart).toFormat('dd-MM-yyyy') : ''
  let inspectionDayEnd = search.inspectionDayEnd ? DateTime.fromJSDate(search.inspectionDayEnd).toFormat('dd-MM-yyyy') : ''
  let expiredDayStart = search.expiredDayStart ? DateTime.fromJSDate(search.expiredDayStart).toFormat('dd-MM-yyyy') : ''
  let expiredDayEnd = search.expiredDayEnd ? DateTime.fromJSDate(search.expiredDayEnd).toFormat('dd-MM-yyyy') : ''
  return { inspectionDayStart, inspectionDayEnd, expiredDayStart, expiredDayEnd }
}

const useEquipmentStore = create<EquipmentState>()(
  devtools((set, get) => ({
    equipments: null,
    count: 0,
    offset: 0,
    limit: 10,
    isLoading: false,
    error: null,
    search: {},

    fetchEquipments: async (options?: { limit?: number, offset?: number, reset?: boolean, changePage?: boolean }) => {
      set({ isLoading: true, error: null });
      try {
        const currentSearch = get().search
        const limit = options?.limit || get().limit
        const offset = options?.offset || get().offset
        const currentEquipments = get().equipments
        const response = await listEquipments({
          limit,
          offset: options?.reset ? 0 : offset,
          ...generateEquipmentParam(currentSearch),
        });
        set({
          equipments: options?.changePage ?
            [...currentEquipments?.length ? currentEquipments : [],
            ...response.equipments] : response.equipments, count: response.count, isLoading: false,
          ...options?.reset ? { offset: 0 } : {}
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw error
      }
    },
    createEquipment: async (equipment: CreateEquipmentFormValues) => {
      const { limit } = get()
      try {
        await createEquipment(equipment)
        const response = await listEquipments({
          limit,
          offset: 0,
        });
        set({ equipments: response.equipments, count: response.count, offset: 0, search: {} });
      } catch (error: any) {
        throw error
      }
    },
    editEquipment: async (id: string, equipment: EditEquipmentFormValues) => {
      try {
        const { equipments } = get()
        const result = await editEquipment(id, equipment)
        const updateEquipment = result.equipment
        set({ equipments: equipments?.map(equipment => equipment.id === updateEquipment.id ? updateEquipment : equipment) });
      } catch (error: any) {
        throw error
      }
    },
    setSearch: (input: EquipmentSearch) => {
      const currentSearch = get().search
      set({ search: { ...currentSearch, ...input } })
    },
    onPageChange: async (page: number) => {
      const equipments = get().equipments
      const limit = get().limit
      const count = get().count
      const fetchEquipments = get().fetchEquipments
      if (equipments) {
        if (equipments?.length < page * limit && equipments?.length < count) {
          await fetchEquipments({ offset: equipments.length, changePage: true, limit: (page * limit) - equipments?.length })
          set({ offset: page - 1 })
        }
        else {
          set({ offset: page - 1 })
        }
      }
    },
    onPageSizeChange: async (pageSize: number) => {
      const { search } = get()
      const response = await listEquipments({
        limit: pageSize,
        offset: 0,
        ...generateEquipmentParam(search)
      });
      set({ equipments: response.equipments, count: response.count, offset: 0, limit: pageSize });
    }
  }))
);

export default useEquipmentStore