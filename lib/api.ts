import type { ApiResponse, VehicleData, FilterCriteria } from "./types";

// API 기본 URL - 실제 환경에 맞게 수정 필요
const API_BASE_URL = "http://localhost:8080";

// 검사 데이터 가져오기
export async function fetchInspectionData(
  filters?: Partial<FilterCriteria>
): Promise<ApiResponse> {
  try {
    // 필터 파라미터 구성
    const params = new URLSearchParams();

    if (filters) {
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.vehicleType)
        params.append("vehicleType", filters.vehicleType);
      if (filters.color) params.append("color", filters.color);
      if (filters.isRepainted !== null)
        params.append("isRepainted", (filters.isRepainted || "").toString());
      if (filters.isAccepted !== null)
        params.append("isAccepted", (filters.isAccepted || "").toString());
    }

    // API 요청
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(
      `${API_BASE_URL}/api/inspection${queryString}`
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);

    // 오류 발생 시 목업 데이터 반환 (개발 중에만 사용)
    return generateMockApiResponse();
  }
}

// 개발용 목업 데이터 생성 함수
function generateMockApiResponse(): ApiResponse {
  const vehicleTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Truck",
    "EV6",
    "Sportage",
    "Sorento",
    "K5",
  ];
  const colors = [
    "Red",
    "Blue",
    "White",
    "Black",
    "Silver",
    "Gray",
    "Green",
    "Yellow",
  ];
  const booths = ["BT 1", "BT 2", "BT 3"];
  const areas = ["DR", "FENDER", "HD", "ROOF", "TRUNK", "BUMPER"];
  const positions = ["FRT", "RR"];
  const sides = ["LH", "RH"];
  const defectTypes = [
    "DUST",
    "CRATERING",
    "SCRATCH",
    "DENT",
    "ORANGE_PEEL",
    "WATER_MARK",
    "PAINT_RUN",
  ];

  const mockData: VehicleData[] = [];

  // 현재 날짜 기준 45일 전부터 데이터 생성
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 45);

  // 특정 시간대 생성
  const timeSlots = [
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
    "19:00",
    "20:00",
    "21:00",
  ];

  // 가중치 적용된 시간대 선택 함수
  const getWeightedTimeSlot = () => {
    const rand = Math.random();
    if (rand < 0.45) {
      // 45% 오전 교대 (인덱스 0-9)
      return timeSlots[Math.floor(Math.random() * 10)];
    } else if (rand < 0.9) {
      // 45% 오후 교대 (인덱스 10-19)
      return timeSlots[10 + Math.floor(Math.random() * 10)];
    } else {
      // 10% 저녁 교대 (인덱스 20-22)
      return timeSlots[20 + Math.floor(Math.random() * 3)];
    }
  };

  // 특정 날짜에 데이터 집중
  const busyDays = [];
  for (let i = 0; i < 10; i++) {
    const randomDay = Math.floor(Math.random() * 45);
    busyDays.push(randomDay);
  }

  for (let i = 0; i < 200; i++) {
    // 랜덤 날짜 생성 (바쁜 날에 더 많은 데이터 생성)
    let randomDays;
    if (Math.random() < 0.6) {
      // 60%의 데이터는 바쁜 날에 집중
      randomDays = busyDays[Math.floor(Math.random() * busyDays.length)];
    } else {
      // 40%의 데이터는 다른 날에 분산
      randomDays = Math.floor(Math.random() * 45);
    }

    const date = new Date(startDate);
    date.setDate(startDate.getDate() + randomDays);

    // 가중치 적용된 시간대 선택
    const timeString = getWeightedTimeSlot();

    // 결함 영역 생성
    const area = areas[Math.floor(Math.random() * areas.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const defectType =
      defectTypes[Math.floor(Math.random() * defectTypes.length)];

    // 부스 분포 조정
    let booth;
    const boothRandom = Math.random();
    if (boothRandom < 0.4) {
      booth = "BT 1";
    } else if (boothRandom < 0.7) {
      booth = "BT 2";
    } else {
      booth = "BT 3";
    }

    mockData.push({
      id: `record-${i}`,
      date: date.toISOString().split("T")[0],
      time: timeString,
      vehicleType:
        vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      booth: booth,
      defectArea: `${area}_${position}_${side}_${defectType}`,
      defectType: defectType,
      isRepainted: Math.random() > 0.5,
      isAccepted: Math.random() > 0.3,
    });
  }

  return {
    success: true,
    data: {
      inspectionData: mockData,
      filterOptions: {
        vehicleTypes: vehicleTypes,
        colors: colors,
      },
    },
  };
}
