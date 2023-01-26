async function genBtnOnClick () {
    const listUrl = document.querySelector('#list-url')?.value;
    const cellX = document.querySelector('#cell-x')?.value;
    const cellY = document.querySelector('#cell-y')?.value;

    if (/https:\/\/kiite.jp\/playlist\/\w+/.test(listUrl)) {
        const [, id] = listUrl.match(/https:\/\/kiite.jp\/playlist\/(\w+)/);
        const params = { id, cellX, cellY };
        const imgWrapper = document.querySelector('#image-wrapper');
        const img = document.querySelector('#image');

        imgWrapper.dataset.view = 'loading';
        img.alt = listUrl;
        img.src = await genImage(params);
        imgWrapper.dataset.view = 'image';
    }
}
