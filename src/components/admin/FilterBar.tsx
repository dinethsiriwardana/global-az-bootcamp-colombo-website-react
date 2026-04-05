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
  { label: "Rejected", value: "rejected" },
  { label: "Confirmed", value: "confirmed" },
];

const FilterBar = ({ status, onChange, disabled = false }: FilterBarProps) => {
  return (
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
  );
};

export default FilterBar;
