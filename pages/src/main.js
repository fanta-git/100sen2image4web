const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbxXJD1TDh95gXeMAKOj28Pt4XI6bDzJTePr0s6YNNueG_8CD-7CzOawQPTRID0aEqZn/exec";
const [RATIO_W, RATIO_H] = [16, 9];

async function main () {
    const SCALE = 10;
    const [CELL_X, CELL_Y] = [10, 10];
    const param = new URL(window.location.href).searchParams;
    const playlist = await fetchPlaylist(param.get('id'));
    console.log(playlist);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    [canvas.width, canvas.height] = [CELL_X * RATIO_W * SCALE, CELL_Y * RATIO_H * SCALE];

    for (const [key, song] of playlist.songs.entries()) {
        const imgUrl = song.thumbnailBase;
        const img = await loadImage(imgUrl);
        const ratioDiff = img.width * RATIO_H - img.height * RATIO_W;

        const [cellWidth, cellHeight] = [SCALE * RATIO_W, SCALE * RATIO_H];
        const [x, y] = [key % CELL_X, key / CELL_X | 0];

        const souceWidth = ratioDiff > 0 ? img.height * RATIO_W / RATIO_H | 0 : img.width;
        const souceHeight = ratioDiff < 0 ? img.width * RATIO_H / RATIO_W | 0 : img.height;
        const souceX = (img.width - souceWidth) / 2 | 0;
        const souceY = (img.height - souceHeight) / 2 | 0;

        ctx.drawImage(img, souceX, souceY, souceWidth, souceHeight, x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }

    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    document.getElementById("image").src = URL.createObjectURL(blob);
}

async function fetchPlaylist (id) {
    const url = new URL(API_ENDPOINT);
    url.search = new URLSearchParams({ id });
    const res = await fetch(url);
    if (!res.ok) throw Error(res.status + ": " + res.statusText);
    return res.json();
}

function loadImage(url, elem = new Image()) {
    return new Promise((resolve, reject) => {
        elem.onload = resolve.bind(null, elem);
        elem.onerror = reject;
        elem.src = url;
    });
}

window.onload = main;
