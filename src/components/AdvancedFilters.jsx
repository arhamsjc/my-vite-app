import { useTable } from '../hooks/useTable';
import './AdvancedFilters.css';

export const AdvancedFilters = () => {
  const { filters, setFilters } = useTable();

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  return (
    <div className="advanced-filters">
      <h3>Advanced Filters</h3>
      <div className="filter-group">
        <h4>ABV (Alcohol By Volume)</h4>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min ABV"
            value={filters.abv_gt || ''}
            onChange={(e) => handleFilterChange('abv_gt', e.target.value)}
            step="0.1"
          />
          <input
            type="number"
            placeholder="Max ABV"
            value={filters.abv_lt || ''}
            onChange={(e) => handleFilterChange('abv_lt', e.target.value)}
            step="0.1"
          />
        </div>
      </div>

      <div className="filter-group">
        <h4>IBU (International Bitterness Units)</h4>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min IBU"
            value={filters.ibu_gt || ''}
            onChange={(e) => handleFilterChange('ibu_gt', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max IBU"
            value={filters.ibu_lt || ''}
            onChange={(e) => handleFilterChange('ibu_lt', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <h4>EBC (Color)</h4>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min EBC"
            value={filters.ebc_gt || ''}
            onChange={(e) => handleFilterChange('ebc_gt', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max EBC"
            value={filters.ebc_lt || ''}
            onChange={(e) => handleFilterChange('ebc_lt', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <h4>Name Search</h4>
        <input
          type="text"
          placeholder="Search by beer name"
          value={filters.name || ''}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <h4>Food Pairing</h4>
        <input
          type="text"
          placeholder="Search by food pairing"
          value={filters.food || ''}
          onChange={(e) => handleFilterChange('food', e.target.value)}
        />
      </div>

      <button 
        onClick={() => setFilters({})} 
        className="clear-filters"
      >
        Clear All Filters
      </button>
    </div>
  );
};