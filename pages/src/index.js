let playlist;

async function displayImg () {
    const listUrl = document.querySelector('#list-url')?.value;
    const cellX = document.querySelector('#cell-x')?.value;
    const cellY = document.querySelector('#cell-y')?.value;

    if (/https:\/\/kiite.jp\/playlist\/\w+/.test(listUrl)) {
        const imgWrapper = document.querySelector('#image-wrapper');
        const img = document.querySelector('#image');
        imgWrapper.dataset.view = 'loading';

        const [, id] = listUrl.match(/https:\/\/kiite.jp\/playlist\/(\w+)/);
        if (!playlist || playlist.list_id !== id) playlist = await fetchPlaylist(id);
        const params = { playlist, cellX, cellY };

        img.alt = listUrl;
        img.src = await genImage(params);
        imgWrapper.dataset.view = 'image';
    }
}
