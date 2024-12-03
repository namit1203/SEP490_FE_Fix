import React from "react";

const Dropdown = ({ filteredOptions, isOpen, handleOptionClick }) => {
  if (!isOpen) return null;

  return (
    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto">
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option) => (
          <li
            key={option.id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleOptionClick(option)}
          >
            {option.value}
          </li>
        ))
      ) : (
        <div className="px-4 py-2 text-gray-500 text-xs">
          Không có tùy chọn phù hợp
        </div>
      )}
    </ul>
  );
};

export default Dropdown;
