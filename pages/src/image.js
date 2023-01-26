async function main () {
    document.getElementById("image").src = await genImage();
}

window.onload = main;
