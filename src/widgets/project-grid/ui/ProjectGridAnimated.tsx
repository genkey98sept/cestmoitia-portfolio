import { Children } from "react";

export function ProjectGridAnimated({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-x-7 gap-y-12 tablet:grid-cols-2"
      role="list"
    >
      {Children.toArray(children).map((child, index) => (
        <div key={index} role="listitem">
          {child}
        </div>
      ))}
    </div>
  );
}
