let playlist;

async function displayImg () {
    try {
        const listUrl = document.querySelector('#list-url')?.value;
        const cellX = document.querySelector('#cell-x')?.value;
        const cellY = document.querySelector('#cell-y')?.value;

        if (/^https:\/\/kiite.jp\/playlist\/\w{10}/.test(listUrl)) {
            const imgWrapper = document.querySelector('#image-wrapper');
            const img = document.querySelector('#image');
            imgWrapper.dataset.view = 'loading';

            const [, id] = listUrl.match(/^https:\/\/kiite.jp\/playlist\/(\w{10})/);
            if (!playlist || playlist.list_id.toLowerCase() !== id.toLowerCase()) {
                try {
                    playlist = await fetchPlaylist(id);
                } catch (e) {
                    console.error(e);
                    if (!playlist) {
                        imgWrapper.dataset.view = 'void';
                        return;
                    }
                }
            }
            const params = { playlist, cellX, cellY };

            img.alt = listUrl;
                img.src = await genImage(params);
            imgWrapper.dataset.view = 'image';
        }
    } catch (e) {
        return displayError(e);
    }
}

function displayError (e) {
    document.querySelector('#image-wrapper').dataset.view = 'error';
    document.querySelector('#error').innerHTML = `Error!: ${e.name}<br>${e.message}`;
    console.log(e);
}
