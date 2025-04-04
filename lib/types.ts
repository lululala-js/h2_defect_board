export interface VehicleData {
  id: string
  date: string
  time: string
  vehicleType: string
  color: string
  booth: string
  defectArea: string
  defectType: string
  repaintStatus?: string
  acceptanceStatus?: string
}

export interface FilterCriteria {
  startDate: string
  endDate: string
  vehicleType: string
  color: string
  repaintStatus: string
  acceptanceStatus: string
}

export interface BoothData {
  booth: string
  count: number
}

export interface TimeData {
  time: string
  date: string
  fullDate: string // Added for sorting
  count: number
}

export interface DefectAreaData {
  id: string
  area: string
  count: number
  fullPath: string
}

