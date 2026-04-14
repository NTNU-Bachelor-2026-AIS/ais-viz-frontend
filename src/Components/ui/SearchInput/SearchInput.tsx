import React from 'react';
import { Search } from 'lucide-react';
import './SearchInput.css';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <div className="search-container">
        <input
          ref={ref}
          type="text"
          className={`search-input ${className}`}
          {...props}
        />
        <button 
          className="search-icon-btn" 
          aria-label="Search"
          onClick={() => onSearch?.(String(props.value))}
        >
          <Search size={18} />
        </button>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;