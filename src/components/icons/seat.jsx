import React from "react";

export default function IconsSeat() {
  return (
    <>
      <svg
        width={32}
        height={32}
        viewBox="0 0 28 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2.75"
          y="2.75"
          width="22.5"
          height="34.5"
          rx="2.25"
          fill="#FFF"
          stroke="#B8B8B8"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect
          x="5.75"
          y="27.75"
          width="16.5"
          height="6.5"
          rx="2.25"
          fill="#FFF"
          stroke="#B8B8B8"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          className="icon-selected"
          d="M14 8.333A6.67 6.67 0 0 0 7.333 15 6.67 6.67 0 0 0 14 21.667 6.67 6.67 0 0 0 20.667 15 6.669 6.669 0 0 0 14 8.333zm-1.333 10L9.334 15l.94-.94 2.393 2.387 5.06-5.06.94.946-6 6z"
          fill="transparent"
        />
        <path
          className="icon-disabled"
          d="M18.96 11.46l-1.42-1.42L14 13.59l-3.54-3.55-1.42 1.42L12.59 15l-3.55 3.54 1.42 1.42L14 16.41l3.54 3.55 1.42-1.42L15.41 15l3.55-3.54z"
          fill="transparent"
        />
      </svg>
    </>
  );
}
