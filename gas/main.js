function doGet(e) {
    const playlistId = e.parameter.id;
    if (!playlistId) {
        return createJsonOutput({ error: { message: 'プレイリストidが未入力です' } });
    }

    if (/\w{8}/.test(playlistId)) {
        const playlist = fetchListData(playlistId);
        if (e.parameter.insert_other) insertOtherLink(playlist);

        return createJsonOutput(playlist);
    }
}

function test() {
  const t = doGet({ parameter: { id: 'fU1COPTqGV', insert_other: true }});
}

function insertOtherLink(playlist) {
    const ids = playlist.description.match(/(?<=https:\/\/www\.youtube.com\/watch\?v=)\w+/g) ?? [];
    const urls = ids.map(v => `https://img.youtube.com/vi/${v}/default.jpg`);
    const thumbnailBases = fetchImageBases(urls);

    const orders = playlist.description.match(/(?<=^>>).*$/mg)?.at(-1).match(/-?\d+(\.\d+)?/g).map(Number) ?? [];

    for (const [id, url, thumbnailBase, order] of zip(ids, urls, thumbnailBases, orders)) {
        if (!id) continue;
        const index = playlist.songs.findIndex(v => v.order_num > order);
        const song = {
            video_id: id,
            type: 'youtube',
            video_thumbnail: url,
            thumbnailBase
        };
        if (index < 0) {
            playlist.songs.push(song);
        } else {
            playlist.songs.splice(index, 0, song);
        }
    }

    return playlist;
}

function fetchListData(listId) {
    const listData = fetchJson('https://cafeapi.kiite.jp/api/playlists/contents/detail', { list_id: listId });
    for (const songs of [listData.songs.slice(0, 50), listData.songs.slice(50, 100)]) {
        const snapshotParam = {
            q: '',
            fields: 'contentId,thumbnailUrl',
            _sort: '-viewCounter',
            _context: '100sen2img4web',
            _limit: 100
        };

        for (const song of songs) {
            snapshotParam[`filters[contentId][${song.order_num}]`] = song.video_id;
        }
        const songsData = fetchJson('https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search', snapshotParam);
        const thumbnailBases = fetchImageBases(songsData.data.map(v => v.thumbnailUrl));

        for (const [detail, thumbnailBase] of zip(songsData.data, thumbnailBases)) {
            const targetSong = listData.songs.find(v => v.video_id === detail.contentId);
            Object.assign(targetSong, detail, { thumbnailBase });
        }
    }

    return listData;
}

function fetchJson(url, param) {
    const paramStr = param ? "?" + Object.entries(param).map(([k, v]) => k + "=" + String(v)).join("&") : "";
    const res = UrlFetchApp.fetch(url + paramStr);
    return JSON.parse(res.getContentText());
}

function fetchImageBases(urls) {
    const requests = urls.map(v => ({ url: v, muteHttpExceptions: true }));
    return UrlFetchApp.fetchAll(requests).map(v =>
        "data:image/png;base64,"
        + Utilities.base64Encode(v.getBlob().getBytes())
    );
}

function* zip(...arrays) {
    for (const i of arrays[0].keys()) {
        yield arrays.map(v => v[i]);
    }
}

function createJsonOutput(json) {
    return ContentService.createTextOutput()
        .setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify(json));
}
