import { TextIconBox } from "@/components/text-icon-box";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type ColorScheme = "brand" | "primary";

interface CtaLinkButtonProps {
    href: string;
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    className?: string;
    buttonClassName?: string;
    colorScheme?: ColorScheme;
    ariaLabel?: string;
}

export function CtaLinkButton({
    href,
    title,
    subtitle,
    icon,
    className,
    buttonClassName,
    colorScheme = "brand",
    ariaLabel,
}: CtaLinkButtonProps) {
    const hoverTextClass = colorScheme === "primary" ? "hover:text-primary" : "hover:text-sunglow";
    const iconColorClass = colorScheme === "primary" ? "text-primary" : "text-sunglow";
    return (
        <div className={cn("flex items-center", className)}>
            <Button
                variant="link"
                asChild
                className={cn("text-sm text-foreground", hoverTextClass, buttonClassName)}
            >
                <Link href={href} aria-label={ariaLabel ?? title}>
                    <TextIconBox
                        title={title}
                        subtitle={subtitle}
                        icon={
                            icon ?? (
                                <ArrowUpRight
                                    className={iconColorClass}
                                    style={{ height: "125%", width: "125%" }}
                                />
                            )
                        }
                        className="text-sm"
                    />
                </Link>
            </Button>
        </div>
    );
}


