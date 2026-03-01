interface SectionHeaderProps {
  number: string;
  label: string;
  detail: string;
  detailMuted?: boolean;
}

export function SectionHeader({
  number,
  label,
  detail,
  detailMuted = true,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-baseline justify-between tablet:mb-8">
      <span className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
        {number}
      </span>
      <span className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
        {label}
      </span>
      <span
        className={`font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] ${
          detailMuted ? "text-[#808080]" : "text-text"
        }`}
      >
        {detail}
      </span>
    </div>
  );
}
