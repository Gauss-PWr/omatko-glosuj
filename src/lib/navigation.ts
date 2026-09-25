export type NavigationItem = {
  id: string;
  label: string;
  href?: string;
};

export function buildNavigationItems(
  dayCount: number,
  hasPosters: boolean,
  routeToHome = false,
): NavigationItem[] {
  const items: NavigationItem[] = [
    ...Array.from({ length: dayCount }, (_, index) => ({
      id: `day-${index}`,
      label: `Dzień ${index + 1}`,
    })),
    ...(hasPosters ? [{ id: "poster", label: "Postery" }] : []),
    { id: "options", label: "Opcje" },
  ];

  if (!routeToHome) return items;
  return items.map((item) => ({ ...item, href: `/?panel=${item.id}` }));
}
