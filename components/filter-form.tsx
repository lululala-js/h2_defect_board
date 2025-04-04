"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FilterCriteria } from "@/lib/types"
import { Search, X } from "lucide-react"

interface FilterFormProps {
  filters: FilterCriteria
  onFilterChange: (filters: FilterCriteria) => void
}

export default function FilterForm({ filters, onFilterChange }: FilterFormProps) {
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterCriteria = {
      startDate: "",
      endDate: "",
      vehicleType: "",
      color: "",
      repaintStatus: "",
      acceptanceStatus: "",
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <form onSubmit={handleSubmit} className="chart-container silver-gradient mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-white">
            날짜 (시작)
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={localFilters.startDate}
            onChange={handleInputChange}
            className="bg-gray-800 text-white border-gray-700 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-white">
            날짜 (종료)
          </Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={localFilters.endDate}
            onChange={handleInputChange}
            className="bg-gray-800 text-white border-gray-700 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="text-white">
            차종
          </Label>
          <Input
            id="vehicleType"
            name="vehicleType"
            value={localFilters.vehicleType}
            onChange={handleInputChange}
            className="bg-gray-800 text-white border-gray-700 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-white">
            칼라
          </Label>
          <Input
            id="color"
            name="color"
            value={localFilters.color}
            onChange={handleInputChange}
            className="bg-gray-800 text-white border-gray-700 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="repaintStatus" className="text-white">
            재도장 여부
          </Label>
          <Input
            id="repaintStatus"
            name="repaintStatus"
            value={localFilters.repaintStatus}
            onChange={handleInputChange}
            className="bg-gray-800 text-white border-gray-700 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="acceptanceStatus" className="text-white">
            합인 여부
          </Label>
          <Input
            id="acceptanceStatus"
            name="acceptanceStatus"
            value={localFilters.acceptanceStatus}
            onChange={handleInputChange}
            className="bg-gray-800 text-white border-gray-700 rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="bg-transparent text-white border-gray-600 hover:bg-gray-800 rounded-full btn-soft"
        >
          <X className="mr-2 h-4 w-4" />
          초기화
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-gray-600 rounded-full btn-soft"
        >
          <Search className="mr-2 h-4 w-4" />
          검색
        </Button>
      </div>
    </form>
  )
}

