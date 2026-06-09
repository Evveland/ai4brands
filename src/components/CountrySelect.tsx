"use client";

import { COUNTRIES } from "@/lib/countries";
import { useAppState } from "@/lib/store";

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function CountrySelect({ value, onChange, className = "" }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={className}
    >
      {COUNTRIES.map(c => (
        <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
      ))}
    </select>
  );
}

/** Returns the user's current country from store, defaulting to ES */
export function useDefaultCountry(): string {
  const { country } = useAppState();
  return country ?? "ES";
}
