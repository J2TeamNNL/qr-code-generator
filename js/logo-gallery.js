// Built-in sample logos (inline SVG). Selecting one behaves like an upload.
const logoGallery = [
    {
        id: 'star',
        labelKey: 'logo_icon_star',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#f59e0b" d="M32 6l7.4 15.1L56 23.3l-12 11.7 2.8 16.5L32 43.6 17.2 51.5 20 35 8 23.3l16.6-2.2z"/></svg>',
    },
    {
        id: 'heart',
        labelKey: 'logo_icon_heart',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#e11d48" d="M32 56S8 40 8 24.5C8 15.4 15.2 10 23 10c4.8 0 7.7 2.3 9 4.5C33.3 12.3 36.2 10 41 10c7.8 0 15 5.4 15 14.5C56 40 32 56 32 56z"/></svg>',
    },
    {
        id: 'link',
        labelKey: 'logo_icon_link',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="none" stroke="#4f46e5" stroke-width="5" stroke-linecap="round" d="M28 36l8-8"/><path fill="none" stroke="#4f46e5" stroke-width="5" stroke-linecap="round" d="M24.5 29.5l-5-5a9 9 0 0112.7-12.7l5 5M39.5 34.5l5 5a9 9 0 01-12.7 12.7l-5-5"/></svg>',
    },
    {
        id: 'wifi',
        labelKey: 'logo_icon_wifi',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="none" stroke="#0891b2" stroke-width="5" stroke-linecap="round" d="M14 28c10-10 26-10 36 0"/><path fill="none" stroke="#0891b2" stroke-width="5" stroke-linecap="round" d="M20 36c7-7 17-7 24 0"/><path fill="none" stroke="#0891b2" stroke-width="5" stroke-linecap="round" d="M26 43c3.5-3.5 8.5-3.5 12 0"/><circle cx="32" cy="50" r="3.5" fill="#0891b2"/></svg>',
    },
    {
        id: 'camera',
        labelKey: 'logo_icon_camera',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="20" width="48" height="32" rx="6" fill="#334155"/><rect x="24" y="14" width="16" height="8" rx="2" fill="#334155"/><circle cx="32" cy="36" r="10" fill="#e2e8f0"/><circle cx="32" cy="36" r="6" fill="#0f172a"/><circle cx="48" cy="28" r="2.5" fill="#f8fafc"/></svg>',
    },
    {
        id: 'cart',
        labelKey: 'logo_icon_cart',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="none" stroke="#ea580c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M10 14h8l6 28h24l6-18H24"/><circle cx="28" cy="52" r="4" fill="#ea580c"/><circle cx="46" cy="52" r="4" fill="#ea580c"/></svg>',
    },
    {
        id: 'pin',
        labelKey: 'logo_icon_pin',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#e11d48" d="M32 6c-9.4 0-17 7.4-17 16.6 0 12.4 17 35.4 17 35.4s17-23 17-35.4C49 13.4 41.4 6 32 6z"/><circle cx="32" cy="22" r="7" fill="#fff"/></svg>',
    },
    {
        id: 'music',
        labelKey: 'logo_icon_music',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#7c3aed" d="M46 10v28.2a10 10 0 11-6-9.2V22L22 26.5v17.7a10 10 0 11-6-9.2V22l30-8z"/></svg>',
    },
];

function svgToDataUrl(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export { logoGallery, svgToDataUrl };
