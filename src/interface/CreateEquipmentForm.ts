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