"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { X, ChevronDown } from "lucide-react";

interface SelectOption {
  id: string;
  name: string;
}

interface SearchableMultiSelectProps {
  options: SelectOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
  onSearchChange?: (search: string) => void;
}

export interface SearchableMultiSelectRef {
  clearSearch: () => void;
}

const SearchableMultiSelect = forwardRef<
  SearchableMultiSelectRef,
  SearchableMultiSelectProps
>(
  (
    {
      options,
      selectedIds,
      onChange,
      placeholder = "Search and select...",
      maxHeight = "max-h-64",
      onSearchChange,
    },
    ref
  ) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      clearSearch: () => {
        setSearch("");
        onSearchChange?.("");
      },
    }));

    // Filter options based on search
    const filteredOptions = options.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase())
    );

    // Get selected items for display as tags
    const selectedItems = options.filter((opt) => selectedIds.includes(opt.id));

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleOption = (id: string) => {
      const newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id];
      onChange(newSelectedIds);
    };

    const handleRemoveSelected = (id: string) => {
      onChange(selectedIds.filter((item) => item !== id));
    };

    const handleClearAll = () => {
      onChange([]);
      setSearch("");
    };

    return (
      <div ref={containerRef} className="relative w-full">
        {/* Input Container */}
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }}
          className="w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/30 px-3 py-2 cursor-text transition flex flex-wrap gap-2 items-center hover:border-(--border-strong) focus-within:border-(--border-strong) focus-within:ring-2 focus-within:ring-(--brand)/40"
        >
          {/* Selected Tags */}
          {selectedItems.length > 0 ? (
            <>
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-elevated)/25 px-2 py-1 text-sm font-medium text-(--text-primary)"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSelected(item.id);
                    }}
                    className="text-(--text-muted) hover:text-(--text-primary) transition"
                    title={`Remove ${item.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </>
          ) : null}

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedItems.length === 0 ? placeholder : ""}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            onFocus={() => setIsOpen(true)}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted)"
          />

          {/* Clear and Dropdown Icon */}
          <div className="flex items-center gap-1 ml-auto">
            {selectedItems.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className="text-(--text-muted) hover:text-(--text-secondary) transition p-1"
                title="Clear all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-(--text-muted) transition ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute top-full left-0 right-0 mt-2 rounded-xl border border-(--border-strong) bg-glass shadow-lg z-50 ${maxHeight} overflow-y-auto modern-scrollbar`}
          >
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-(--text-muted)">
                {search
                  ? "No options match your search"
                  : "No options available"}
              </div>
            ) : (
              <div className="space-y-0">
                {filteredOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer transition border-b border-(--border-subtle) last:border-b-0 hover:bg-(--surface-elevated)/20"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(option.id)}
                      onChange={() => handleToggleOption(option.id)}
                      className="w-4 h-4 cursor-pointer accent-(--brand)"
                    />
                    <span className="text-sm text-(--text-primary)">
                      {option.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Count */}
        {selectedItems.length > 0 && (
          <div className="mt-1 text-xs text-(--text-muted)">
            {selectedItems.length} selected
          </div>
        )}
      </div>
    );
  }
);

SearchableMultiSelect.displayName = "SearchableMultiSelect";

export default SearchableMultiSelect;
