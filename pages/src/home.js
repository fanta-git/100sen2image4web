function genImage () {
    const url = new URL('/image.html', window.location.origin);
    const listUrl = document.querySelector('#list-url')?.value;
    if (/https:\/\/kiite.jp\/playlist\/\w+/.test(listUrl)) {
        const [, id] = listUrl.match(/https:\/\/kiite.jp\/playlist\/(\w+)/);
        url.search = new URLSearchParams({ id });
    }
    window.location.href = url;
}
