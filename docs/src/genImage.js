const API_ENDPOINT = "https://script.google.com/macros/s/AKfycby4a6Yn3su1IC6pd5zygJvN8a8TyXWfObyS_85RnObrDsDbA4Ht_V7Gszb7HqoAj0Nl/exec";
const [RATIO_W, RATIO_H] = [16, 9];
const SCALE = 10;

async function genImage (params) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    [canvas.width, canvas.height] = [params.cellX * RATIO_W * SCALE, params.cellY * RATIO_H * SCALE];

    const playlist = params.playlist ?? await fetchPlaylist(params.id);
    console.log(playlist);
    for (const [key, song] of playlist.songs.entries()) {
        const imgUrl = song.thumbnailBase;
        const img = await loadImage(imgUrl);
        const ratioDiff = img.width * RATIO_H - img.height * RATIO_W;

        const [cellWidth, cellHeight] = [SCALE * RATIO_W, SCALE * RATIO_H];
        const [x, y] = [key % params.cellX, key / params.cellX | 0];

        const souceWidth = ratioDiff > 0 ? img.height * RATIO_W / RATIO_H | 0 : img.width;
        const souceHeight = ratioDiff < 0 ? img.width * RATIO_H / RATIO_W | 0 : img.height;
        const souceX = (img.width - souceWidth) / 2 | 0;
        const souceY = (img.height - souceHeight) / 2 | 0;

        ctx.drawImage(img, souceX, souceY, souceWidth, souceHeight, x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }

    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    return URL.createObjectURL(blob);
}

async function fetchPlaylist (id) {
    if (!id) return;
    const url = new URL(API_ENDPOINT);
    url.search = new URLSearchParams({ id });
    console.log(url.toString());
    const res = await fetch(url);
    if (!res.ok) throw Error(res.status + ": " + res.statusText);
    return res.json();
}

function loadImage (url, elem = new Image()) {
    return new Promise((resolve, reject) => {
        elem.onload = resolve.bind(null, elem);
        elem.onerror = reject;
        elem.src = url;
    });
}
