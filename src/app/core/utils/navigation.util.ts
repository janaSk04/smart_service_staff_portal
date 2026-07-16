export const JOB_NAV_PLACEHOLDER_PATH = '/portal/under-construction';

/** Returns true when an address exists and navigation can proceed (placeholder or Maps). */
export function openJobNavigation(address: string): boolean {
  const dest = (address ?? '').trim();
  if (!dest) return false;

  // --- NEXT: real Google Maps directions ---
  // const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
  // window.open(url, '_blank', 'noopener,noreferrer');
  // return true;

  return true;
}

export function jobNavQueryParams(address: string): { address: string } {
  return { address: (address ?? '').trim() };
}
