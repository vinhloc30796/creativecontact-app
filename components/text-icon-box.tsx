import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface TextIconBoxProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
}

export function TextIconBox({
  title,
  subtitle,
  icon = <ArrowUpRight className="h-full w-auto" />,
  href,
  className = "",
}: TextIconBoxProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col text-right">
        <span>{title}</span>
        {subtitle && <span>{subtitle}</span>}
      </div>
      <div className="flex items-center justify-center" style={{ height: '3.5em', width: '3.5em' }}>
        {icon}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
} 