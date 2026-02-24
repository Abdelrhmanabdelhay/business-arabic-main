import * as React from "react";

type LogoProps = {
  size?: number;
  width?: string;
  height?: string;
};

export const Logo: React.FC<LogoProps> = ({ size = 36, width, height }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={width || `${size}px`}
    height={height || `${size}px`}
    fill="none"
  >
    {/* Outer circular border */}
    <circle
      cx="50"
      cy="50"
      r="45"
      stroke="#007bff"
      strokeWidth="4"
      fill="white"
    />

    {/* Abstract business growth symbol */}
    <path d="M35 60 L50 30 L65 60 Z" fill="#007bff" />
    <rect x="45" y="40" width="10" height="25" fill="white" />

    {/* Arabic text (بزنس) */}
    <text
      x="50%"
      y="75%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="18"
      fontWeight="bold"
      fill="#007bff"
    >
      بزنس
    </text>

    {/* Arabic text (عربي) */}
    <text
      x="50%"
      y="85%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="14"
      fill="#007bff"
    >
      عربي
    </text>
  </svg>
);
