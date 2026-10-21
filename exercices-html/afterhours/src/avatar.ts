export function avatarFor(name: string): string {
  let hash = 0
  for (const char of name) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0
  const hue = (Math.abs(hash) % 300) + 10
  const initial = name.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase() || 'AN'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="hsl(${hue} 75% 78%)"/><stop offset="1" stop-color="hsl(${(hue+57)%360} 72% 66%)"/></linearGradient></defs><rect width="72" height="72" rx="12" fill="url(#g)"/><circle cx="56" cy="12" r="27" fill="#fff" opacity=".18"/><circle cx="7" cy="68" r="28" fill="#181a43" opacity=".1"/><text x="36" y="46" font-size="27" font-family="Arial" font-weight="bold" fill="#2a2453" text-anchor="middle">${initial}</text></svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
