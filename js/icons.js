/* =================================================================
   НАБОР ИКОНОК САЙТА
   Рисунки для плавающего декора и значков технологий. Файл подключён
   на всех страницах и сам вставляет иконки в страницу.
   Использовать в HTML так:  <svg viewBox="0 0 64 64"><use href="#i-code"/></svg>
   Все рисунки собственные, это не логотипы компаний.
   ================================================================= */

(function () {
  const icons = {
    // Главная
    'i-editor': '<rect x="4" y="10" width="56" height="44" rx="6"/><path d="M4 20h56"/><circle cx="10" cy="15" r="1.5" fill="currentColor"/><circle cx="15" cy="15" r="1.5" fill="currentColor"/><circle cx="20" cy="15" r="1.5" fill="currentColor"/><path d="M11 28h9M24 28h16"/><path d="M15 35h20M39 35h8" opacity=".6"/><path d="M15 42h9M28 42h14" opacity=".6"/><path d="M11 48h14"/>',
    'i-code': '<path d="M22 18 8 32l14 14M42 18l14 14-14 14M36 12 28 52"/>',
    'i-braces': '<path d="M24 12c-6 0-8 3-8 8v6c0 4-2 6-6 6 4 0 6 2 6 6v6c0 5 2 8 8 8M40 12c6 0 8 3 8 8v6c0 4 2 6 6 6-4 0-6 2-6 6v6c0 5-2 8-8 8"/>',
    'i-cursor': '<path d="M16 8v40l10-10 7 16 7-3-7-16h14z" fill="currentColor" fill-opacity=".15"/>',
    'i-browser': '<rect x="6" y="10" width="52" height="44" rx="6"/><path d="M6 20h52"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/><circle cx="17" cy="15" r="1.5" fill="currentColor"/><rect x="13" y="27" width="22" height="7" rx="2" fill="currentColor" fill-opacity=".3"/><rect x="40" y="26" width="11" height="9" rx="2"/><path d="M13 42h38M13 48h26"/>',
    'i-bulb': '<path d="M24 44c0-6-8-9-8-19a16 16 0 0 1 32 0c0 10-8 13-8 19z" fill="currentColor" fill-opacity=".15"/><path d="M25 50h14M27 56h10M32 30v10M28 26l4 4 4-4M32 1v3M12 9l2 2M52 9l-2 2M5 25h3M56 25h3"/>',
    // «Как я работаю»
    'i-pencil': '<path d="M14 34 40 8l8 8-26 26-10 2z" fill="currentColor" fill-opacity=".15"/><path d="M36 12l8 8"/><rect x="6" y="46" width="52" height="12" rx="2"/><path d="M14 46v5M22 46v3M30 46v5M38 46v3M46 46v5"/>',
    'i-gear': '<circle cx="32" cy="32" r="19" stroke-width="7" stroke-dasharray="7 7.92" stroke-linecap="butt"/><circle cx="32" cy="32" r="13"/><circle cx="32" cy="32" r="5"/>',
    'i-rocket': '<path d="M32 6c9 7 13 17 11 30H21c-2-13 2-23 11-30z" fill="currentColor" fill-opacity=".15"/><circle cx="32" cy="22" r="5"/><path d="M21 30l-8 9v7l9-5M43 30l8 9v7l-9-5M28 40l4 14 4-14"/>',
    'i-check': '<circle cx="32" cy="32" r="24" fill="currentColor" fill-opacity=".12"/><path d="M21 33l8 8 15-17"/>',
    'i-flow': '<rect x="4" y="8" width="20" height="14" rx="3"/><rect x="40" y="8" width="20" height="14" rx="3"/><rect x="22" y="42" width="20" height="14" rx="3" fill="currentColor" fill-opacity=".2"/><path d="M24 15h16M14 22v10h36V22M32 32v10"/>',
    // Портфолио
    'i-palette': '<path d="M32 6C17 6 6 17 6 30c0 13 11 26 24 26 4 0 6-2 6-5 0-4-3-5-3-8s2-5 6-5h7c8 0 12-5 12-11C58 15 46 6 32 6z" fill="currentColor" fill-opacity=".12"/><circle cx="20" cy="26" r="4"/><circle cx="30" cy="16" r="4"/><circle cx="43" cy="18" r="4"/><circle cx="18" cy="40" r="4" fill="currentColor"/>',
    'i-brush': '<path d="M52 6 28 32l6 6L58 12z" fill="currentColor" fill-opacity=".15"/><path d="M28 32c-7 0-11 4-11 10 0 4-3 7-9 8 10 4 24 1 26-9"/>',
    'i-grid': '<rect x="6" y="6" width="52" height="52" rx="5"/><path d="M6 20h52M24 20v38M24 39h34"/><rect x="30" y="26" width="22" height="7" rx="2" fill="currentColor" fill-opacity=".3"/>',
    'i-pixel': '<path d="M14 8v36h6v-4h4v8h4v8h6v-8h-4v-8h10v-6h-4v-4h-4v-4h-4v-4h-4v-4h-4v-4h-4v-6z" fill="currentColor" fill-opacity=".2" stroke-linejoin="miter"/>',
    'i-magnifier': '<circle cx="27" cy="27" r="17" fill="currentColor" fill-opacity=".1"/><path d="M39 39l17 17M19 23a9 9 0 0 1 8-6"/>',
    'i-uicard': '<rect x="8" y="6" width="48" height="52" rx="6"/><circle cx="20" cy="20" r="6" fill="currentColor" fill-opacity=".3"/><path d="M30 17h18M30 24h12M16 35h32M16 42h24"/><rect x="16" y="48" width="18" height="4" rx="2" fill="currentColor"/>',
    // Цены
    'i-coin': '<ellipse cx="22" cy="52" rx="16" ry="5"/><path d="M6 52v-6M38 52v-6"/><ellipse cx="22" cy="46" rx="16" ry="5"/><circle cx="40" cy="24" r="16" fill="currentColor" fill-opacity=".15"/><circle cx="40" cy="24" r="11"/><path d="M37 31V17h5a4 4 0 0 1 0 8h-8M34 28h8"/>',
    'i-wallet': '<path d="M8 18h42a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="currentColor" fill-opacity=".12"/><path d="M8 20c0-5 3-8 8-9l26-5v12M56 30H44a5 5 0 0 0 0 10h12"/><circle cx="45" cy="35" r="1.5" fill="currentColor"/>',
    'i-tag': '<path d="M8 8h22l26 26-22 22L8 30z" fill="currentColor" fill-opacity=".14"/><circle cx="19" cy="19" r="4"/><path d="M28 38l10-10M33 43l8-8"/>',
    'i-star': '<path d="M32 6l7.6 16.4L58 24.6 44.6 37.2 48 56 32 47 16 56l3.4-18.8L6 24.6l18.4-2.2z" fill="currentColor" fill-opacity=".2"/>',
    'i-gift': '<rect x="8" y="24" width="48" height="12" rx="2"/><path d="M12 36v20h40V36" fill="currentColor" fill-opacity=".12"/><path d="M32 24v32M32 24c-4-10-16-12-16-4 0 4 8 4 16 4zM32 24c4-10 16-12 16-4 0 4-8 4-16 4z"/>',
    // Контакты
    'i-mail': '<rect x="6" y="14" width="52" height="38" rx="6" fill="currentColor" fill-opacity=".12"/><path d="M8 18l24 18 24-18"/>',
    'i-chat': '<path d="M10 12h44a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H26l-12 10V46h-4a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z" fill="currentColor" fill-opacity=".12"/><circle cx="22" cy="29" r="2.5" fill="currentColor"/><circle cx="32" cy="29" r="2.5" fill="currentColor"/><circle cx="42" cy="29" r="2.5" fill="currentColor"/>',
    'i-plane': '<path d="M6 30 58 8 46 56 30 40z" fill="currentColor" fill-opacity=".12"/><path d="M30 40 58 8M30 40l-4 14 10-9"/>',
    'i-handset': '<path d="M20 8l8 12-5 6c3 7 8 12 15 15l6-5 12 8-4 10c-22 0-42-20-42-42z" fill="currentColor" fill-opacity=".12"/>',
    'i-at': '<circle cx="32" cy="32" r="9"/><path d="M41 26v9a6 6 0 0 0 12 0v-3a21 21 0 1 0-8 16.5"/>',
    // Значки технологий
    'i-devices': '<rect x="6" y="12" width="40" height="28" rx="3"/><path d="M2 46h40"/><rect x="42" y="24" width="18" height="32" rx="4" fill="currentColor" fill-opacity=".2"/><path d="M49 50h4"/>',
    'i-spark': '<path d="M30 6c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20z" fill="currentColor" fill-opacity=".2"/><path d="M50 42c1 6 2 7 8 8-6 1-7 2-8 8-1-6-2-7-8-8 6-1 7-2 8-8z"/>',
    'i-cube': '<path d="M32 6 54 18v28L32 58 10 46V18z" fill="currentColor" fill-opacity=".1"/><path d="M10 18l22 12 22-12M32 30v28"/>',
    'i-bot': '<rect x="10" y="20" width="44" height="32" rx="10" fill="currentColor" fill-opacity=".12"/><circle cx="24" cy="36" r="4"/><circle cx="40" cy="36" r="4"/><circle cx="32" cy="9" r="3"/><path d="M32 12v8M28 46h8M4 32v8M60 32v8"/>',
    'i-form': '<rect x="10" y="6" width="44" height="52" rx="5"/><rect x="17" y="15" width="30" height="8" rx="2"/><rect x="17" y="28" width="30" height="8" rx="2"/><rect x="17" y="42" width="18" height="8" rx="4" fill="currentColor" fill-opacity=".4"/>',
    'i-bolt': '<path d="M36 4 12 36h18l-4 24 26-34H34z" fill="currentColor" fill-opacity=".18"/>',
    'i-globe': '<circle cx="32" cy="32" r="24"/><path d="M8 32h48M32 8c-8 8-8 40 0 48M32 8c8 8 8 40 0 48M12 20h40M12 44h40"/>',
    'i-external': '<path d="M36 10h18v18M54 10 30 34M46 38v12a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4h12"/>'
  };

  const symbols = Object.keys(icons)
    .map((id) => '<symbol id="' + id + '" viewBox="0 0 64 64">' + icons[id] + '</symbol>')
    .join('');

  const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.setAttribute('class', 'icon-sprite');
  sprite.setAttribute('aria-hidden', 'true');
  sprite.setAttribute('focusable', 'false');
  sprite.innerHTML = symbols;
  document.body.prepend(sprite);
})();
