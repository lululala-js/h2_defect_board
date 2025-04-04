"use client"

import { useEffect, useState } from "react"
import FileUpload from "@/components/file-upload"
import FilterForm from "@/components/filter-form"
import TabView from "@/components/tab-view"
import { filterData } from "@/lib/data-processor"
import type { VehicleData, FilterCriteria } from "@/lib/types"
import { generateMockData } from "@/lib/utils"
import Image from "next/image"

export default function Home() {
  const [data, setData] = useState<VehicleData[]>([])
  const [filteredData, setFilteredData] = useState<VehicleData[]>([])
  const [filters, setFilters] = useState<FilterCriteria>({
    startDate: "",
    endDate: "",
    vehicleType: "",
    color: "",
    repaintStatus: "",
    acceptanceStatus: "",
  })

  useEffect(() => {
    // Generate mock data for the application - increased count for better visualization
    const mockData = generateMockData(200)
    setData(mockData)
    setFilteredData(mockData)
  }, [])

  const handleFileUpload = async (file: File) => {
    try {
      // For now, we'll just use the mock data regardless of file upload
      alert("파일이 업로드되었습니다. 데모 데이터를 사용합니다.")
      const mockData = generateMockData(200)
      setData(mockData)
      setFilteredData(filterData(mockData, filters))
    } catch (error) {
      console.error("Error parsing file:", error)
      alert("파일 처리 중 오류가 발생했습니다.")
    }
  }

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters(newFilters)
    setFilteredData(filterData(data, newFilters))
  }

  return (
    <>
      <div className="bg-pattern"></div>
      <main className="content-wrapper">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <div className="header-logo">
              <Image src="/kia-logo.png" alt="KIA Logo" width={120} height={40} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center mt-4">
              화성2도장 상도 외관 품질 대시보드
            </h1>
          </div>

          <div className="flex justify-end mb-6">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          <FilterForm filters={filters} onFilterChange={handleFilterChange} />
          <TabView data={filteredData} />
        </div>
      </main>
    </>
  )
}

