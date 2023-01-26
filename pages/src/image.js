async function main () {
    const imgWrapper = document.querySelector('#image-wrapper');
    const img = document.querySelector('#image');
    const params = getSearchParams();
    const listUrl = 'https://kiite.jp/playlist/' + params.id;

    imgWrapper.dataset.view = 'loading';
    img.alt = listUrl;
    img.src = await genImage();
    imgWrapper.dataset.view = 'image';
}

window.onload = main;
