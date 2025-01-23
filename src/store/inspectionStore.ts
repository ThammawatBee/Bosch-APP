import { Equipment } from "@/interface/CreateEquipmentForm"
import { listInspectionEquipments } from "../service/bosch";
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DateTime } from "luxon";
import pickBy from 'lodash/pickBy'

type InspectionSearch = {
  type?: string
  equipmentNumber?: string
  name?: string
  brand?: string
  status?: string
  area?: string
}

interface InspectionState {
  equipments: Equipment[] | null
  isLoading: boolean
  error: any
  count: number
  offset: number
  limit: number
  search: InspectionSearch
  inspectDate: Date


  fetchInspectionEquipments: (options?: { limit?: number, offset?: number, changePage?: boolean, reset?: boolean }) => Promise<void>
  setSearch: (input: InspectionSearch) => void
  onPageChange: (page: number) => Promise<void>
  setInspectDate: (date: Date) => void
  onPageSizeChange: (pageSize: number) => Promise<void>
}

const useInspectionEquipmentStore = create<InspectionState>()(
  devtools((set, get) => ({
    equipments: null,
    isLoading: false,
    error: null,
    count: 0,
    offset: 0,
    limit: 10,
    inspectDate: new Date(),
    search: {},

    fetchInspectionEquipments: async (options?: { limit?: number, offset?: number, reset?: boolean, changePage?: boolean }) => {
      set({ isLoading: true, error: null });
      try {
        const limit = options?.limit || get().limit
        const offset = options?.offset || get().offset
        const currentEquipments = get().equipments
        const inspectDate = get().inspectDate
        const currentSearch = get().search
        const response = await listInspectionEquipments(DateTime.fromJSDate(inspectDate).toFormat('dd-MM-yyyy'), {
          limit,
          offset: options?.reset ? 0 : offset,
          ...pickBy(currentSearch, search => !!search),
        });
        set({
          equipments: options?.changePage ?
            [...currentEquipments?.length ? currentEquipments : [],
            ...response.equipments] : response.equipments, count: response.count, isLoading: false,
          ...options?.reset ? { offset: 0 } : {},
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw error
      }
    },
    setSearch: (input: InspectionSearch) => {
      const currentSearch = get().search
      set({ search: { ...currentSearch, ...input } })
    },
    setInspectDate: (date: Date) => {
      set({ inspectDate: date })
    },
    onPageChange: async (page: number) => {
      const equipments = get().equipments
      const limit = get().limit
      const count = get().count
      const fetchInspectionEquipments = get().fetchInspectionEquipments
      if (equipments) {
        if (equipments?.length < page * limit && equipments?.length < count) {
          await fetchInspectionEquipments({ offset: equipments.length, changePage: true, limit: (page * limit) - equipments?.length })
          set({ offset: page - 1 })
        }
        else {
          set({ offset: page - 1 })
        }
      }
    },
    onPageSizeChange: async (pageSize: number) => {
      const { search, inspectDate } = get()
      const response = await listInspectionEquipments(DateTime.fromJSDate(inspectDate).toFormat('dd-MM-yyyy'), {
        limit: pageSize,
        offset: 0,
        ...pickBy(search, search => !!search),
      });
      set({ equipments: response.equipments, count: response.count, offset: 0, limit: pageSize });
    }
  }))
);

export default useInspectionEquipmentStore