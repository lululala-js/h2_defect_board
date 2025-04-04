import * as XLSX from "xlsx"
import type { VehicleData } from "./types"

export async function parseFile(file: File): Promise<VehicleData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error("Failed to read file"))
          return
        }

        let parsedData: VehicleData[] = []

        if (file.name.endsWith(".csv")) {
          parsedData = parseCSV(data as string)
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          parsedData = parseExcel(data)
        } else {
          reject(new Error("Unsupported file format"))
          return
        }

        resolve(parsedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  })
}

function parseCSV(csvData: string): VehicleData[] {
  // Simple CSV parsing logic - in a real app, you might want to use a more robust CSV parser
  const lines = csvData.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const values = line.split(",").map((v) => v.trim())
      const record: any = { id: `record-${index}` }

      headers.forEach((header, i) => {
        if (i < values.length) {
          // Map CSV headers to our data model
          switch (header.toLowerCase()) {
            case "date":
            case "날짜":
              record.date = values[i]
              break
            case "time":
            case "시간":
              record.time = values[i]
              break
            case "vehicle type":
            case "차종":
              record.vehicleType = values[i]
              break
            case "color":
            case "칼라":
              record.color = values[i]
              break
            case "booth":
            case "부스":
              record.booth = values[i]
              break
            case "defect area":
            case "불량 부위":
              record.defectArea = values[i]
              break
            case "defect type":
            case "불량 유형":
              record.defectType = values[i]
              break
            case "repaint status":
            case "재도장 여부":
              record.repaintStatus = values[i]
              break
            case "acceptance status":
            case "합인 여부":
              record.acceptanceStatus = values[i]
              break
            default:
              // For any other headers, just add them as is
              record[header] = values[i]
          }
        }
      })

      return record as VehicleData
    })
}

function parseExcel(data: ArrayBuffer | string): VehicleData[] {
  const workbook = XLSX.read(data, { type: "array" })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]

  // Convert to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet)

  // Map Excel data to our data model
  return jsonData.map((row: any, index) => {
    const record: any = { id: `record-${index}` }

    // Map Excel columns to our data model
    Object.keys(row).forEach((key) => {
      const lowerKey = key.toLowerCase()
      if (lowerKey.includes("date") || lowerKey.includes("날짜")) {
        record.date = formatExcelDate(row[key])
      } else if (lowerKey.includes("time") || lowerKey.includes("시간")) {
        record.time = typeof row[key] === "string" ? row[key] : `${row[key]}:00`
      } else if (lowerKey.includes("vehicle") || lowerKey.includes("차종")) {
        record.vehicleType = row[key]
      } else if (lowerKey.includes("color") || lowerKey.includes("칼라")) {
        record.color = row[key]
      } else if (lowerKey.includes("booth") || lowerKey.includes("부스")) {
        record.booth = row[key]
      } else if (lowerKey.includes("defect area") || lowerKey.includes("불량 부위")) {
        record.defectArea = row[key]
      } else if (lowerKey.includes("defect type") || lowerKey.includes("불량 유형")) {
        record.defectType = row[key]
      } else if (lowerKey.includes("repaint") || lowerKey.includes("재도장")) {
        record.repaintStatus = row[key]
      } else if (lowerKey.includes("acceptance") || lowerKey.includes("합인")) {
        record.acceptanceStatus = row[key]
      } else {
        // For any other columns, just add them as is
        record[key] = row[key]
      }
    })

    return record as VehicleData
  })
}

function formatExcelDate(excelDate: any): string {
  // If it's already a string, return it
  if (typeof excelDate === "string") {
    return excelDate
  }

  // If it's a number (Excel date), convert it to a JS date
  if (typeof excelDate === "number") {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000))
    return date.toISOString().split("T")[0] // Format as YYYY-MM-DD
  }

  // If it's a Date object
  if (excelDate instanceof Date) {
    return excelDate.toISOString().split("T")[0] // Format as YYYY-MM-DD
  }

  // Default fallback
  return String(excelDate)
}

