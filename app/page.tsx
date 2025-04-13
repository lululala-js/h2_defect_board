"use client";

import { useEffect, useState } from "react";
import FileUpload from "@/components/file-upload";
import FilterForm from "@/components/filter-form";
import TabView from "@/components/tab-view";
import { filterData } from "@/lib/data-processor";
import { fetchInspectionData } from "@/lib/api";
import type { VehicleData, FilterCriteria } from "@/lib/types";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState<VehicleData[]>([]);
  const [filteredData, setFilteredData] = useState<VehicleData[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    vehicleTypes: string[];
    colors: string[];
  }>({
    vehicleTypes: [],
    colors: [],
  });
  const [filters, setFilters] = useState<FilterCriteria>({
    startDate: "",
    endDate: "",
    vehicleType: "",
    color: "",
    isRepainted: null,
    isAccepted: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  // API에서 데이터 가져오기
  const loadData = async (customFilters?: Partial<FilterCriteria>) => {
    setIsLoading(true);
    try {
      const response = await fetchInspectionData(customFilters);
      if (response.success) {
        setData(response.data.inspectionData);
        setFilteredData(response.data.inspectionData);
        setFilterOptions(response.data.filterOptions);
      } else {
        console.error("API 응답 오류");
      }
    } catch (error) {
      console.error("데이터 로드 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // 파일 업로드 처리 로직
      alert("파일이 업로드되었습니다. 서버에서 데이터를 처리합니다.");
      // 실제 구현에서는 파일을 서버로 전송하는 로직 추가
      await loadData();
    } catch (error) {
      console.error("파일 처리 오류:", error);
      alert("파일 처리 중 오류가 발생했습니다.");
    }
  };

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
    setFilteredData(filterData(data, newFilters));

    // 실제 구현에서는 필터 변경 시 API 재호출 가능
    // loadData(newFilters);
  };

  return (
    <>
      <div className="bg-pattern"></div>
      <main className="content-wrapper">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <div className="header-logo">
              <Image
                src="/kia-logo.png"
                alt="KIA Logo"
                width={120}
                height={40}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center mt-4">
              화성2도장 상도 외관 품질 대시보드
            </h1>
          </div>

          <div className="flex justify-end mb-6">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          <FilterForm
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            isLoading={isLoading}
          />

          <TabView data={filteredData} isLoading={isLoading} />
        </div>
      </main>
    </>
  );
}
