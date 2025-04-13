"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { FilterCriteria } from "@/lib/types";
import { Search, X, Loader2 } from "lucide-react";

interface FilterFormProps {
  filters: FilterCriteria;
  onFilterChange: (filters: FilterCriteria) => void;
  filterOptions: {
    vehicleTypes: string[];
    colors: string[];
  };
  isLoading: boolean;
}

export default function FilterForm({
  filters,
  onFilterChange,
  filterOptions,
  isLoading,
}: FilterFormProps) {
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);

  // 필터 옵션이 변경되면 로컬 필터 업데이트
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean | null) => {
    setLocalFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterCriteria = {
      startDate: "",
      endDate: "",
      vehicleType: "",
      color: "",
      isRepainted: null,
      isAccepted: null,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="chart-container silver-gradient mb-8"
    >
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="text-white">
            차종
          </Label>
          <Select
            value={localFilters.vehicleType}
            onValueChange={(value) => handleSelectChange("vehicleType", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-gray-800 text-white border-gray-700 rounded-lg">
              <SelectValue placeholder="차종 선택" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="all">전체</SelectItem>
              {filterOptions.vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-white">
            칼라
          </Label>
          <Select
            value={localFilters.color}
            onValueChange={(value) => handleSelectChange("color", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-gray-800 text-white border-gray-700 rounded-lg">
              <SelectValue placeholder="칼라 선택" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="all">전체</SelectItem>
              {filterOptions.colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isRepainted" className="text-white">
            재도장 여부
          </Label>
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="isRepainted"
              checked={localFilters.isRepainted === true}
              onCheckedChange={(checked) => {
                // 3단계 상태: null (전체) -> true -> false -> null
                let newValue: boolean | null = null;
                if (localFilters.isRepainted === null) newValue = true;
                else if (localFilters.isRepainted === true) newValue = false;
                handleSwitchChange("isRepainted", newValue);
              }}
              disabled={isLoading}
            />
            <Label htmlFor="isRepainted" className="text-white">
              {localFilters.isRepainted === null
                ? "전체"
                : localFilters.isRepainted
                ? "재도장"
                : "비재도장"}
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isAccepted" className="text-white">
            환입 여부
          </Label>
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="isAccepted"
              checked={localFilters.isAccepted === true}
              onCheckedChange={(checked) => {
                // 3단계 상태: null (전체) -> true -> false -> null
                let newValue: boolean | null = null;
                if (localFilters.isAccepted === null) newValue = true;
                else if (localFilters.isAccepted === true) newValue = false;
                handleSwitchChange("isAccepted", newValue);
              }}
              disabled={isLoading}
            />
            <Label htmlFor="isAccepted" className="text-white">
              {localFilters.isAccepted === null
                ? "전체"
                : localFilters.isAccepted
                ? "환입"
                : "비환입"}
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="bg-transparent text-white border-gray-600 hover:bg-gray-800 rounded-full btn-soft"
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          초기화
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-gray-600 rounded-full btn-soft"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          검색
        </Button>
      </div>
    </form>
  );
}
