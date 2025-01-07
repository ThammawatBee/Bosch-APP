export interface CreateEquipmentFormValues {
  equipmentNumber: string
  type: string
  brand: string
  name: string
  nextInspection: string
  inspectionPeriod: number
  expiredDate: string
  status: string
}

export interface EditEquipmentFormValues {
  brand: string
  name: string
  nextInspection: string
  expiredDate: string
  status: string,
  equipmentNumber: string
  inspectionPeriod: number
}

export interface Equipment {
  id: string
  equipmentNumber: string
  type: string
  brand: string
  name: string
  nextInspection: string
  inspectionPeriod: number
  expiredDate: string
  status: string
}

export interface ListEquipmentOptions {
  type?: string
  equipmentNumber?: string
  name?: string
  brand?: string
  status?: string
  inspectionDayStart?: string
  inspectionDayEnd?: string
  expiredDayStart?: string
  expiredDayEnd?: string
  offset?: number
  limit?: number
}

export interface ListInspectionEquipmentOptions {
  type?: string
  equipmentNumber?: string
  name?: string
  brand?: string
  status?: string
  offset?: number
  limit?: number
}

export interface ListReportOptions {
  type?: string
  equipmentNumber?: string
  name?: string
  brand?: string
  result?: string
  resultDateStart?: string
  resultDateEnd?: string
  offset?: number
  limit?: number
}