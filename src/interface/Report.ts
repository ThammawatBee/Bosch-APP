export interface CreateReport {
  equipmentNumber: string
  result: string
  resultDate: string
  nokReason: string
  investigatedBy: string
}

export interface ReportFromFile {
  ['Equipment number']: string
  Result: string
  ResultDate: string
  nokReason: string
  ['Staff name']: string
}

export interface EquipmentReport {
  id: string
  result: "OK" | "NOK"
  resultDate: string
  type: string
  equipmentNumber: string
  name: string
  brand: string
  inspectionPeriod: number
  nextInspection: string
  expiredDate: string
  equipmentId: string
  nokReason: string
  investigatedBy?: string
}