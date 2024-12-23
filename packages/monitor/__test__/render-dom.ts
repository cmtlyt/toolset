export function render(): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = `
  <div class="btn-box">
    <button class="click-test">click test</button>
    <button id="dblclick-test"><span class="dblclick-test-span">dblclick test</span></button>
    <button id="auto-sync-error-test">sync error test</button>
    <button id="auto-async-error-test">async error test</button>
    <button id="custom-error-test">custom error test</button>
  </div>`;
  const $ = (id: string) => container.querySelector<HTMLElement>(`${id}`)!;
  $('.click-test').addEventListener('click', () => {});
  $('#dblclick-test').addEventListener('dblclick', () => {});
  $('#auto-sync-error-test').addEventListener('click', () => {
    throw new Error('sync error test');
  });
  $('#auto-async-error-test').addEventListener('click', () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    Promise.reject('async error test');
  });
  document.body.appendChild(container);

  const outContainer = document.createElement('div');
  outContainer.textContent = 'out container';
  document.body.appendChild(outContainer);

  return container;
}
