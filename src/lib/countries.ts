export interface Country {
  code: string;
  flag: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: "ES", flag: "🇪🇸", name: "España" },
  { code: "MX", flag: "🇲🇽", name: "México" },
  { code: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "PE", flag: "🇵🇪", name: "Perú" },
  { code: "BR", flag: "🇧🇷", name: "Brasil" },
  { code: "US", flag: "🇺🇸", name: "Estados Unidos" },
  { code: "UK", flag: "🇬🇧", name: "Reino Unido" },
  { code: "OTHER", flag: "🌍", name: "Otro país" },
];

export function getCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRIES.find(c => c.code === code);
}

export function countryLabel(code: string | null | undefined): string {
  const c = getCountry(code);
  return c ? `${c.flag} ${c.name}` : "—";
}
