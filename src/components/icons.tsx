import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 40"
      width="160"
      height="40"
      {...props}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
        `}
      </style>
      <text
        x="0"
        y="28"
        fontFamily="'Inter', sans-serif"
        fontSize="28"
        fontWeight="700"
        fill="currentColor"
        className="text-gray-800 dark:text-gray-200"
      >
        Kaizen
      </text>
      <rect x="110" y="4" width="46" height="32" rx="6" fill="#4A69FF" />
      <text
        x="117"
        y="29"
        fontFamily="'Inter', sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="white"
      >
        Ai
      </text>
    </svg>
  );
}
