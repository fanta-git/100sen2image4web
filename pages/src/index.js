async function genBtnOnClick () {
    const url = new URL(window.location.href);
    const listUrl = document.querySelector('#list-url')?.value;
    const cellX = document.querySelector('#cell-x')?.value;
    const cellY = document.querySelector('#cell-y')?.value;
    if (/https:\/\/kiite.jp\/playlist\/\w+/.test(listUrl)) {
        const [, id] = listUrl.match(/https:\/\/kiite.jp\/playlist\/(\w+)/);
        url.search = new URLSearchParams({ id, cell_x: cellX, cell_y: cellY });
        window.history.replaceState(null, '', url);
        document.getElementById("image").src = await genImage();
    }
}
