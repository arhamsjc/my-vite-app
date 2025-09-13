import { useTable } from '../hooks/useTable';

export const ColumnFilter = ({ column }) => {
  const { filters, setFilters, uniqueValues } = useTable();
  const columnValues = uniqueValues[column] || [];
  const selectedValues = filters[column] || [];

  const handleCheckboxChange = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];

    setFilters(prev => ({
      ...prev,
      [column]: newSelectedValues.length > 0 ? newSelectedValues : undefined
    }));
  };

  return (
    <div className="column-filter">
      <h4>{column} Filter</h4>
      <div className="filter-options">
        {columnValues.map(value => (
          <label key={value} className="filter-option">
            <input
              type="checkbox"
              checked={selectedValues.includes(value)}
              onChange={() => handleCheckboxChange(value)}
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
};