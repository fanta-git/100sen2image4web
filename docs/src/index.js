let playlist;

async function displayImg () {
    const listUrlDom = document.querySelector('#list-url');
    try {
        const listUrl = listUrlDom?.value;
        const cellX = document.querySelector('#cell-x')?.value;
        const cellY = document.querySelector('#cell-y')?.value;
        const insertOther = document.querySelector('#insert-other')?.checked;

        if (/^https:\/\/kiite.jp\/playlist\/\w{10}/.test(listUrl)) {
            listUrlDom.disabled = true;
            listUrlDom.classList.remove('input-error');
            const imgWrapper = document.querySelector('#image-wrapper');
            const img = document.querySelector('#image');
            imgWrapper.dataset.view = 'loading';

            const [, id] = listUrl.match(/^https:\/\/kiite.jp\/playlist\/(\w{10})/);
            if (!playlist || playlist.list_id.toLowerCase() !== id.toLowerCase()) {
                try {
                    playlist = await fetchPlaylist(id);
                } catch (e) {
                    console.error(e);
                    listUrlDom.classList.add('input-error');
                    if (!playlist) {
                        imgWrapper.dataset.view = 'void';
                        return;
                    }
                }
            }
            const params = { playlist, cellX, cellY, insertOther };

            img.alt = listUrl;
            img.src = await genImage(params);
            imgWrapper.dataset.view = 'image';
        } else {
            if (listUrl) {
                listUrlDom.classList.add('input-error');
            } else {
                listUrlDom.classList.remove('input-error');

            }
        }
    } catch (e) {
        displayError(e);
    } finally {
        listUrlDom.disabled = false;
    }
}

function displayError (e) {
    document.querySelector('#image-wrapper').dataset.view = 'error';
    document.querySelector('#error').innerHTML = `Error!: ${e.name}<br>${e.message}`;
    console.log(e);
}
