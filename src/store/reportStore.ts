import { CreateReport, EquipmentReport } from "@/interface/Report";
import { createReports, listReports } from "../service/bosch";
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import pickBy from 'lodash/pickBy'
import { DateTime } from "luxon";

type ReportSearch = {
  type?: string
  equipmentNumber?: string
  name?: string
  brand?: string
  result?: string
  resultDateStart?: Date
  resultDateEnd?: Date
  status?: string
}


interface ReportState {
  reports: EquipmentReport[] | null
  isLoading: boolean
  error: any
  search: ReportSearch
  count: number
  offset: number
  limit: number
  createReports: (reports: CreateReport[]) => Promise<void>
  fetchReports: (options?: { limit?: number, offset?: number, changePage?: boolean, reset?: boolean }) => Promise<void>
  setSearch: (input: ReportSearch) => void
  onPageChange: (page: number) => Promise<void>
  onPageSizeChange: (pageSize: number) => Promise<void>
  resetReportList: () => Promise<void>
}

export const generateReportParam = (search: ReportSearch) => {
  const resultDateStart = search.resultDateStart ? DateTime.fromJSDate(search.resultDateStart).toFormat('dd-MM-yyyy') : ''
  const resultDateEnd = search.resultDateEnd ? DateTime.fromJSDate(search.resultDateEnd).toFormat('dd-MM-yyyy') : ''
  return {
    ...pickBy(search, search => !!search),
    ...resultDateStart && resultDateEnd ? {
      resultDateStart,
      resultDateEnd,
    } : {}
  }
}

const useReportStore = create<ReportState>()(
  devtools((set, get) => ({
    reports: null,
    isLoading: false,
    error: null,
    count: 0,
    offset: 0,
    limit: 10,
    search: {},

    createReports: async (reports: CreateReport[]) => {
      try {
        await createReports(reports)
      } catch (error: any) {
        throw error
      }
    },
    fetchReports: async (options?: { limit?: number, offset?: number, reset?: boolean, changePage?: boolean }) => {
      set({ isLoading: true, error: null });
      try {
        const limit = options?.limit || get().limit
        const offset = options?.offset || get().offset
        const currentReports = get().reports
        const currentSearch = get().search
        const response = await listReports(
          {
            limit,
            offset: options?.reset ? 0 : offset,
            ...generateReportParam(currentSearch)
          }
        );
        set({
          reports: options?.changePage ?
            [...currentReports?.length ? currentReports : [],
            ...response.reports] : response.reports, count: response.count, isLoading: false,
          ...options?.reset ? { offset: 0 } : {}
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw error
      }
    },
    setSearch: (input: ReportSearch) => {
      const currentSearch = get().search
      set({ search: { ...currentSearch, ...input } })
    },
    onPageChange: async (page: number) => {
      const equipments = get().reports
      const limit = get().limit
      const count = get().count
      const fetchReports = get().fetchReports
      if (equipments) {
        if (equipments?.length < page * limit && equipments?.length < count) {
          await fetchReports({ offset: equipments.length, changePage: true, limit: (page * limit) - equipments?.length })
          set({ offset: page - 1 })
        }
        else {
          set({ offset: page - 1 })
        }
      }
    },
    onPageSizeChange: async (pageSize: number) => {
      const { search } = get()
      const response = await listReports({
        limit: pageSize,
        offset: 0,
        ...generateReportParam(search)
      });
      set({ reports: response.reports, count: response.count, offset: 0, limit: pageSize });
    },
    resetReportList: async () => {
      const { limit } = get()
      const response = await listReports(
        {
          limit,
          offset: 0,
        }
      );
      set({ reports: response.reports, count: response.count, offset: 0 })
    }
  }))
)

export default useReportStore