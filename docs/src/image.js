async function main () {
    try {
        const imgWrapper = document.querySelector('#image-wrapper');
        const img = document.querySelector('#image');
        const params = getSearchParams();
        const listUrl = 'https://kiite.jp/playlist/' + params.id;

        imgWrapper.dataset.view = 'loading';
        img.alt = listUrl;
        img.src = await genImage(params);
        imgWrapper.dataset.view = 'image';
    } catch (e) {
        document.querySelector('#image-wrapper').dataset.view = 'error';
        document.querySelector('#error').innerHTML = `Error!: ${e.name}<br>${e.message}`;
        console.error(e);
    }
}

function getSearchParams () {
    const params = new URL(window.location.href).searchParams;
    const result = {};
    for (const [key, val] of params) {
        const camel = key.split('_').reduce((p, c) => p + (c ? c.charAt(0).toUpperCase() + c.slice(1) : c));
        result[camel] = val;
    }
    return result;
}

window.onload = main;
