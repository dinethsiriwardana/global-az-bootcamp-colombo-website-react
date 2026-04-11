import React from "react";
import { AdminFilterStatus } from "../../types/admin";

interface FilterBarProps {
  status: AdminFilterStatus;
  onChange: (status: AdminFilterStatus) => void;
  userType: string;
  onUserTypeChange: (value: string) => void;
  userTypeOptions: Array<{ label: string; value: string }>;
  tshirtSize: string;
  onTshirtSizeChange: (value: string) => void;
  tshirtSizeOptions: string[];
  foodPreference: string;
  onFoodPreferenceChange: (value: string) => void;
  foodPreferenceOptions: string[];
  disabled?: boolean;
}

const FILTER_OPTIONS: Array<{ label: string; value: AdminFilterStatus }> = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Confirmed", value: "confirmed" },
];

const FOOD_PREFERENCE_LABELS: Record<string, string> = {
  veg: "Vegetarian",
  "non-veg": "Non-Vegetarian",
};

const getFoodPreferenceLabel = (value: string) => {
  return FOOD_PREFERENCE_LABELS[value] || value;
};

const FilterBar = ({
  status,
  onChange,
  userType,
  onUserTypeChange,
  userTypeOptions,
  tshirtSize,
  onTshirtSizeChange,
  tshirtSizeOptions,
  foodPreference,
  onFoodPreferenceChange,
  foodPreferenceOptions,
  disabled = false,
}: FilterBarProps) => {
  return (
    <div className="admin-filter-group">
      <div className="admin-filter-panel">
        <label htmlFor="admin-status-filter" className="admin-control-label">
          Filter by status
        </label>
        <div className="admin-filter-select-wrap">
          <i className="bi bi-funnel" aria-hidden="true" />
          <select
            id="admin-status-filter"
            className="admin-filter-select"
            value={status}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value as AdminFilterStatus)}
            aria-label="Status filter"
          >
            {FILTER_OPTIONS.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="admin-filter-panel">
        <label htmlFor="admin-profession-filter" className="admin-control-label">
          Profession
        </label>
        <div className="admin-filter-select-wrap">
          <i className="bi bi-funnel" aria-hidden="true" />
          <select
            id="admin-profession-filter"
            className="admin-filter-select"
            value={userType}
            disabled={disabled}
            onChange={(event) => onUserTypeChange(event.target.value)}
            aria-label="Profession filter"
          >
            <option value="all">All Professions</option>
            {userTypeOptions.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="admin-filter-panel">
        <label htmlFor="admin-tshirt-filter" className="admin-control-label">
          T-shirt size
        </label>
        <div className="admin-filter-select-wrap">
          <i className="bi bi-funnel" aria-hidden="true" />
          <select
            id="admin-tshirt-filter"
            className="admin-filter-select"
            value={tshirtSize}
            disabled={disabled}
            onChange={(event) => onTshirtSizeChange(event.target.value)}
            aria-label="T-shirt size filter"
          >
            <option value="all">All T-shirt sizes</option>
            {tshirtSizeOptions.map((option) => {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="admin-filter-panel">
        <label htmlFor="admin-food-filter" className="admin-control-label">
          Food Preference
        </label>
        <div className="admin-filter-select-wrap">
          <i className="bi bi-funnel" aria-hidden="true" />
          <select
            id="admin-food-filter"
            className="admin-filter-select"
            value={foodPreference}
            disabled={disabled}
            onChange={(event) => onFoodPreferenceChange(event.target.value)}
            aria-label="Food preference filter"
          >
            <option value="all">All Food Preferences</option>
            {foodPreferenceOptions.map((option) => {
              return (
                <option key={option} value={option}>
                  {getFoodPreferenceLabel(option)}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
