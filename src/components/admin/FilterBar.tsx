import React from "react";
import { AdminFilterStatus } from "../../types/admin";

interface FilterBarProps {
  status: AdminFilterStatus;
  onChange: (status: AdminFilterStatus) => void;
  disabled?: boolean;
}

const FILTER_OPTIONS: Array<{ label: string; value: AdminFilterStatus }> = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
];

const FilterBar = ({ status, onChange, disabled = false }: FilterBarProps) => {
  return (
    <div className="admin-filter-panel">
      <span className="admin-control-label">Filter by status</span>
      <div className="admin-filter-toggle" role="tablist" aria-label="Status filter">
        {FILTER_OPTIONS.map((option) => {
          const isActive = status === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              disabled={disabled}
              aria-selected={isActive}
              className={`admin-filter-button ${isActive ? "active" : ""}`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
