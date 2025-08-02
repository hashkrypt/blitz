// src/components/UnicornLogo.tsx
const UnicornLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" fill="currentColor" className={className}>
    <path d="M100 40c-20 0-40 20-40 40s20 40 40 40 40-20 40-40-20-40-40-40zm0-20l-10-20h20l-10 20z" />
    <circle cx="85" cy="70" r="5" fill="white" />
    <circle cx="115" cy="70" r="5" fill="white" />
  </svg>
);

export default UnicornLogo;
