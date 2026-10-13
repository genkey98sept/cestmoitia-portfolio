interface SectionHeaderProps {
  number: string;
  label: string;
  detail?: string;
  detailMuted?: boolean;
}

export function SectionHeader({
  number,
  label,
  detail,
  detailMuted = true,
}: SectionHeaderProps) {
  return (
    <div className="eyebrow mb-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-5">
      <span>
        {number} / {label}
      </span>
      {detail && (
        <span className={detailMuted ? "text-text-secondary" : "text-text"}>
          {detail}
        </span>
      )}
    </div>
  );
}
