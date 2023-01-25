function doGet(e) {
    const playlistId = e.parameter.id ?? "fU1COPTqGV";

    if (/\w{8}/.test(playlistId)) {
        const playlist = fetchListData(playlistId);

        return ContentService.createTextOutput()
            .setMimeType(ContentService.MimeType.JSON)
            .setContent(JSON.stringify(playlist));
    }
}

function fetchListData(listId) {
    const listData = fetchJson('https://cafeapi.kiite.jp/api/playlists/contents/detail', { list_id: listId });
    const songsData = fetchJson('https://cafeapi.kiite.jp/api/songs/by_video_ids', { video_ids: listData.songs.map(v => v.video_id) });
    const thumbnailBases = getImageBase(songsData.map(v => v.video_thumbnail));

    for (const [detail, thumbnailBase] of zip(songsData, thumbnailBases)) {
        const targetSong = listData.songs.find(v => v.video_id === detail.video_id);
        Object.assign(targetSong, detail, { thumbnailBase });
    }

    return listData;
}

function fetchJson(url, param) {
    const paramStr = param ? "?" + Object.entries(param).map(([k, v]) => k + "=" + String(v)).join(",") : "";
    const res = UrlFetchApp.fetch(url + paramStr);
    return Utilities.jsonParse(res.getContentText());
}

function getImageBase(urls) {
    return UrlFetchApp.fetchAll(urls).map(v =>
        "data:image/png;base64,"
        + Utilities.base64Encode(v.getBlob().getBytes())
    );
}

function* zip(...arrays) {
    for (const i of arrays[0].keys()) {
        yield arrays.map(v => v[i]);
    }
}
