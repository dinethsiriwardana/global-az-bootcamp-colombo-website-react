import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SearchInput = ({ value, onChange, disabled = false }: SearchInputProps) => {
  return (
    <div className="admin-search-panel">
      <label htmlFor="admin-search" className="admin-control-label">
        Search registrations
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
          placeholder="Search by name or email"
        />
      </div>
    </div>
  );
};

export default SearchInput;
