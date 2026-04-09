"use client";

interface Props {
  text: string;
  onDismiss: () => void;
}

function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PromoBar({ text, onDismiss }: Props) {
  return (
    <div className="bg-gradient-to-b from-black/80 via-black/30 to-transparent text-white text-center pt-2 pb-6 px-10 text-[11px] md:text-xs relative">
      <p className="leading-snug opacity-90 relative z-10">{text}</p>
      <button
        className="absolute right-3 top-2 text-white/50 hover:text-white transition-colors z-10"
        aria-label="Cerrar"
        onClick={onDismiss}
      >
        <IconX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
