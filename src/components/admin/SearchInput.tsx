import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

const SearchInput = ({
  value,
  onChange,
  disabled = false,
  label = "Search registrations",
  placeholder = "Search by name, email, or organization",
}: SearchInputProps) => {
  return (
    <div className="admin-search-panel">
      <label htmlFor="admin-search" className="admin-control-label">
        {label}
      </label>
      <div className="admin-search-wrap">
        <i className="bi bi-search" aria-hidden="true" />
        <input
          id="admin-search"
          type="search"
          className="admin-search-input"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default SearchInput;
