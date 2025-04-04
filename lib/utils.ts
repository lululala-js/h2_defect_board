import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Enhanced mock data generator with more realistic time-based data
export function generateMockData(count = 50): any[] {
  const vehicleTypes = ["Sedan", "SUV", "Hatchback", "Truck", "EV6", "Sportage", "Sorento", "K5"]
  const colors = ["Red", "Blue", "White", "Black", "Silver", "Gray", "Green", "Yellow"]
  const booths = ["BT 1", "BT 2", "BT 3"]
  const areas = ["DR", "FENDER", "HD", "ROOF", "TRUNK", "BUMPER"]
  const positions = ["FRT", "RR"]
  const sides = ["LH", "RH"]
  const defectTypes = ["DUST", "CRATERING", "SCRATCH", "DENT", "ORANGE_PEEL", "WATER_MARK", "PAINT_RUN"]

  const mockData = []

  // Generate data for the last 45 days
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 45)

  // Create specific time slots for more realistic time distribution
  const timeSlots = [
    // Morning shift
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    // Afternoon shift
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    // Evening shift (less frequent)
    "19:00",
    "20:00",
    "21:00",
  ]

  // Create a weighted distribution for time slots
  // Morning and afternoon shifts are more common
  const getWeightedTimeSlot = () => {
    const rand = Math.random()
    if (rand < 0.45) {
      // 45% morning shift (index 0-9)
      return timeSlots[Math.floor(Math.random() * 10)]
    } else if (rand < 0.9) {
      // 45% afternoon shift (index 10-19)
      return timeSlots[10 + Math.floor(Math.random() * 10)]
    } else {
      // 10% evening shift (index 20-22)
      return timeSlots[20 + Math.floor(Math.random() * 3)]
    }
  }

  // Generate specific dates with more data points
  // This creates clusters of data on certain days for more realistic patterns
  const busyDays = []
  for (let i = 0; i < 10; i++) {
    const randomDay = Math.floor(Math.random() * 45)
    busyDays.push(randomDay)
  }

  for (let i = 0; i < count; i++) {
    // Generate a random date with higher probability for busy days
    let randomDays
    if (Math.random() < 0.6) {
      // 60% of data points on busy days
      randomDays = busyDays[Math.floor(Math.random() * busyDays.length)]
    } else {
      // 40% of data points on other days
      randomDays = Math.floor(Math.random() * 45)
    }

    const date = new Date(startDate)
    date.setDate(startDate.getDate() + randomDays)

    // Get time from weighted distribution
    const timeString = getWeightedTimeSlot()

    // Generate defect area with realistic distribution
    const area = areas[Math.floor(Math.random() * areas.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]
    const side = sides[Math.floor(Math.random() * sides.length)]
    const defectType = defectTypes[Math.floor(Math.random() * defectTypes.length)]

    // Create more realistic distribution of booths
    let booth
    const boothRandom = Math.random()
    if (boothRandom < 0.4) {
      booth = "BT 1"
    } else if (boothRandom < 0.7) {
      booth = "BT 2"
    } else {
      booth = "BT 3"
    }

    mockData.push({
      id: `record-${i}`,
      date: date.toISOString().split("T")[0],
      time: timeString,
      vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      booth: booth,
      defectArea: `${area}_${position}_${side}_${defectType}`,
      defectType: defectType,
      repaintStatus: Math.random() > 0.5 ? "Yes" : "No",
      acceptanceStatus: Math.random() > 0.7 ? "Accepted" : "Rejected",
    })
  }

  return mockData
}

// Format date for display
export function formatDate(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// Format time for display
export function formatTime(timeString: string): string {
  if (!timeString) return ""

  // If the time is already in HH:MM format, just return it
  if (timeString.includes(":")) {
    return timeString
  }

  // Otherwise, assume it's a number and format it
  const hours = Number.parseInt(timeString)
  return `${hours.toString().padStart(2, "0")}:00`
}

