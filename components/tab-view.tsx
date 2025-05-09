"use client";

import { useState } from "react";
import type { VehicleData } from "@/lib/types";
import BoothChart from "./charts/booth-chart";
import TimeChart from "./charts/time-chart";
import DefectAreaChart from "./charts/defect-area-chart";
import {
  processBoothData,
  processTimeData,
  processDefectAreaData,
} from "@/lib/data-processor";
import { Loader2 } from "lucide-react";

interface TabViewProps {
  data: VehicleData[];
  isLoading: boolean;
}

export default function TabView({ data, isLoading }: TabViewProps) {
  const [activeTab, setActiveTab] = useState<string>("booth");

  const boothData = processBoothData(data);
  const timeData = processTimeData(data);
  const defectAreaData = processDefectAreaData(data);

  return (
    <div className="chart-container silver-gradient">
      <div className="tabs-header">
        <button
          className={`tab ${activeTab === "booth" ? "active" : ""}`}
          onClick={() => setActiveTab("booth")}
          disabled={isLoading}
        >
          상도 통과 부스
        </button>
        <button
          className={`tab ${activeTab === "time" ? "active" : ""}`}
          onClick={() => setActiveTab("time")}
          disabled={isLoading}
        >
          상도 투입 시간
        </button>
        <button
          className={`tab ${activeTab === "defect" ? "active" : ""}`}
          onClick={() => setActiveTab("defect")}
          disabled={isLoading}
        >
          부위별 불량 개수 및 불량 유형
        </button>
      </div>

      <div className="tab-content">
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">데이터 로딩 중...</span>
          </div>
        ) : (
          <>
            {activeTab === "booth" && (
              <div>
                <h2 className="chart-title">상도 통과 부스</h2>
                <BoothChart data={boothData} />
              </div>
            )}

            {activeTab === "time" && (
              <div>
                <h2 className="chart-title">상도 투입 시간</h2>
                <TimeChart data={timeData} />
              </div>
            )}

            {activeTab === "defect" && (
              <div>
                <h2 className="chart-title">부위별 불량 개수 및 불량 유형</h2>
                <DefectAreaChart data={defectAreaData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
