
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const paths = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 3h7v7M21 3l-11 11M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
  github: '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.6M15 22v-3.9a3.4 3.4 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7.4a5.8 5.8 0 0 0-1.6-4c.2-1 .2-2-.1-3 0 0-1.3-.4-4.2 1.6a14.3 14.3 0 0 0-7.6 0C4.3.6 3 1 3 1c-.4 1-.4 2-.1 3a5.8 5.8 0 0 0-1.6 4c0 5.8 3.4 7 6.7 7.4a3.4 3.4 0 0 0-1 2.7V22" transform="translate(1 0) scale(.95)"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  box: '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5M15 1v5M9 18v5M15 18v5M1 9h5M1 15h5M18 9h5M18 15h5"/><path d="M10 10h4v4h-4z"/>',
  brain: '<path d="M12 18a4 4 0 0 1-7 2 4 4 0 0 1-2-7 4 4 0 0 1 2-7 4 4 0 0 1 7-2v14ZM12 5h5l3 3M12 12h8M12 19h5l3-3"/><circle cx="21" cy="9" r="1"/><circle cx="21" cy="12" r="1"/><circle cx="21" cy="15" r="1"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  book: '<path d="M12 5C8 2 5 3 2 4v16c3-1 6-2 10 1 4-3 7-2 10-1V4c-3-1-6-2-10 1v16"/>',
  branch: '<circle cx="6" cy="5" r="3"/><circle cx="6" cy="20" r="3"/><circle cx="19" cy="5" r="3"/><path d="M6 8v9M19 8a8 8 0 0 1-8 8H6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  play: '<path d="m9 5 11 7-11 7V5Z"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  globe: '<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/>'
};
export const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.box}</svg>`;
export function duckArt() {
  return `<svg class="duck-art" viewBox="0 0 520 360" fill="none" aria-hidden="true">
    <ellipse cx="279" cy="296" rx="137" ry="20" fill="currentColor" opacity=".05"/>
    <g stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">
      <path d="m207 175 65-35 91 37-67 39-89-41Z" fill="#fffdf6"/>
      <path d="M207 175v49l89 41v-49l-89-41Zm89 41 67-39v48l-67 40" fill="#e8e7dd"/>
      <path d="m230 158 1-36 50-24 48 22v37" fill="#fffdf6"/>
      <path d="m231 122 49 23 49-25M280 145v32"/>
      <path d="m280 145 50-24v36l-50 26v-38Z" fill="#242521"/>
      <ellipse cx="295" cy="153" rx="3" ry="5" fill="#fff8cf" stroke="none"/>
      <ellipse cx="316" cy="142" rx="3" ry="5" fill="#fff8cf" stroke="none"/>
      <path d="m330 145 26 3-25 15-13-3" fill="#ffd64a"/>
      <path d="m230 221-17 34 22 26M320 250l-8 27 27 17" stroke-width="11" stroke="#888c79"/>
      <path d="m230 221-17 34 22 26M320 250l-8 27 27 17" stroke-width="5" stroke="#f7f6ee"/>
      <path d="m209 279 32-5 26 17-44 7-14-19Zm109 13 26-5 34 13-47 8-13-16Z" fill="#fffefa"/>
      <circle cx="237" cy="211" r="12" fill="#ffe377"/><circle cx="237" cy="211" r="4"/>
      <path d="m211 184-24-6-8 19 29 12M256 185l23 11M256 194l23 11"/>
      <path d="M281 98V81m-5 0h10"/>
    </g>
  </svg>`;
}

export function projectArt(category) {
  if (category === 'structure') return duckArt();
  const art = {
    firmware: '<path d="m260 77 106 61v94l-106 61-106-61v-94l106-61Z" stroke="#989c88" stroke-dasharray="4 6"/><path d="m260 113 72 42v52l-72 42-72-42v-52l72-42Z" fill="#ede6c9" stroke="currentColor" stroke-width="2"/><path d="m188 155 72 42 72-42M260 197v52" stroke="currentColor" stroke-width="2"/><path d="m260 134 36 21-36 21-36-21 36-21Z" fill="#70693c"/><g stroke="currentColor" stroke-width="2"><path d="m207 170-25 14m44-3-25 14m44-3-25 14m64 11 25 14m-6-25 25 14m-6-25 25 14"/></g><text x="260" y="311" text-anchor="middle">0x01  /  BUILD. FLASH. REPEAT.</text>',
    'motion-model': '<g stroke="#a0a88d" stroke-width="1.3"><path d="m132 110 126-20 120 35M132 110l30 132 96-152 23 126 97-91-23 127-74-36-119 26m0 0 193 10M132 110l149 106"/></g><g fill="#f7f8ef" stroke="#788060" stroke-width="2"><circle cx="132" cy="110" r="14"/><circle cx="258" cy="90" r="10"/><circle cx="378" cy="125" r="12"/><circle cx="162" cy="242" r="10"/><circle cx="355" cy="252" r="14"/></g><circle cx="281" cy="216" r="34" fill="#7f8c50"/><path d="m265 217 12 12 21-26" stroke="white" stroke-width="3"/><text x="260" y="311" text-anchor="middle">OBSERVE → LEARN → WALK</text>',
    'av-interaction': '<rect x="160" y="78" width="200" height="174" rx="12" fill="#e3e8d7" stroke="#a0a68c" stroke-width="2"/><path d="M181 121v-22h24m112 0h23v22M181 211v22h24m112 0h23v-22" stroke="#69734e" stroke-width="3"/><path d="M204 167s23-30 56-30 56 30 56 30-23 30-56 30-56-30-56-30Z" stroke="#69734e" stroke-width="2"/><circle cx="260" cy="167" r="15" fill="#8b965c"/><path d="M260 63v15M145 167h15m200 0h15M260 252v15" stroke="#a0a68c" stroke-width="1.5"/><text x="260" y="311" text-anchor="middle">A DIFFERENT WAY TO SEE.</text>',
  };
  const drawing = (art[category] ?? art.firmware).replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, '');
  return `<svg class="project-art" viewBox="0 0 520 360" fill="none" aria-hidden="true">${drawing}</svg>`;
}

