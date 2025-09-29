"use client";
import { useEffect, useMemo, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface EventOption {
    id: string;
    name: string;
    slug: string;
}

interface EventMultiSelectProps {
    value: EventOption[];
    onChange: (value: EventOption[]) => void;
    disabled?: boolean;
    lockReason?: string | null;
    placeholder?: string;
    prefilledNote?: string | null;
}

export function EventMultiSelect({ value, onChange, disabled, lockReason, placeholder = "Search events…", prefilledNote }: EventMultiSelectProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<EventOption[]>([]);
    const selectedIds = useMemo(() => new Set(value.map(v => v.id)), [value]);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();
        const run = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            try {
                const rs = await fetch(`/api/events/search?q=${encodeURIComponent(query)}&limit=8`, { signal: controller.signal });
                if (!rs.ok) return;
                const data: EventOption[] = await rs.json();
                if (!ignore) setResults(data);
            } catch {
                // ignore
            }
        };
        const t = setTimeout(run, 200);
        return () => {
            ignore = true;
            controller.abort();
            clearTimeout(t);
        };
    }, [query]);

    function addOption(opt: EventOption) {
        if (disabled) return;
        if (selectedIds.has(opt.id)) return;
        onChange([...value, opt]);
    }

    function removeOption(id: string) {
        if (disabled) return;
        onChange(value.filter(v => v.id !== id));
    }

    return (
        <div className="flex w-full flex-col gap-2">
            {prefilledNote && (
                <div className="text-xs text-muted-foreground">{prefilledNote}</div>
            )}
            <div className="flex flex-wrap gap-2">
                {value.map((v) => (
                    <Badge key={v.id} variant="secondary" className="rounded-none">
                        {v.name}
                        {!disabled && (
                            <Button variant="ghost" size="sm" className="h-5 px-1 ml-1" onClick={() => removeOption(v.id)} aria-label={`Remove ${v.name}`}>
                                ×
                            </Button>
                        )}
                    </Badge>
                ))}
            </div>
            <Command>
                <CommandInput placeholder={placeholder} value={query} onValueChange={setQuery} disabled={!!disabled} />
                <CommandList>
                    <CommandEmpty>No results</CommandEmpty>
                    <CommandGroup heading="Results">
                        {results.map((r) => (
                            <CommandItem key={r.id} value={`${r.name} ${r.slug}`} disabled={disabled || selectedIds.has(r.id)} onSelect={() => addOption(r)}>
                                <div className="flex w-full items-center justify-between">
                                    <span className="truncate">{r.name}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">{r.slug}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
            {disabled && lockReason && (
                <div className="text-xs text-muted-foreground">{lockReason}</div>
            )}
        </div>
    );
}

export default EventMultiSelect;


