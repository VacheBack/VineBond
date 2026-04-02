(function () {
  var el = document.createElement('div');
  el.id = 'vb-landscape-block';
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('role', 'alert');
  el.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="4" y="2" width="16" height="20" rx="2"/>' +
      '<line x1="12" y1="18" x2="12.01" y2="18"/>' +
    '</svg>' +
    '<p>Please rotate your device<br>back to portrait mode</p>';
  document.body.appendChild(el);
}());
