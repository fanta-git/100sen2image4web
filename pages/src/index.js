async function genBtnOnClick () {
    const url = new URL(window.location.href);
    const listUrl = document.querySelector('#list-url')?.value;
    const cellX = document.querySelector('#cell-x')?.value;
    const cellY = document.querySelector('#cell-y')?.value;
    if (/https:\/\/kiite.jp\/playlist\/\w+/.test(listUrl)) {
        const [, id] = listUrl.match(/https:\/\/kiite.jp\/playlist\/(\w+)/);
        url.search = new URLSearchParams({ id, cell_x: cellX, cell_y: cellY });
        window.history.replaceState(null, '', url);
        const imgWrapper = document.querySelector('#image-wrapper');
        const img = document.querySelector('#image');

        imgWrapper.dataset.view = 'loading';
        img.alt = listUrl;
        img.src = await genImage();
        imgWrapper.dataset.view = 'image';
    }
}


async function main () {
    const params = getSearchParams();
    if (params.id) document.querySelector('#list-url').value = 'https://kiite.jp/playlist/' + params.id;
    if (params.cellX) document.querySelector('#cell-x').value = params.cellX;
    if (params.cellY) document.querySelector('#cell-y').value = params.cellY;

    if (params.id) genBtnOnClick();
}

window.onload = main;
