const getExtension = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.match(/(mac|os x)/)) {
        return 'dmg'
    } else if (userAgent.match(/windows/)) {
        return 'exe';
    } else if (userAgent.match(/linux/)) {
        return 'AppImage';
    }
};

const getLatestRelease = async ext => {
    const response = await fetch('https://api.github.com/repos/antonio-ramadas/palbum/releases/latest');
    const json = await response.json();
    const asset = json.assets.filter(asset => asset.name.includes(ext));
    return {
        url: asset[0].browser_download_url,
        version: json.tag_name
    };
};

const updateButtonUrl = async () => {
    const {version, url} = await getLatestRelease(getExtension());
    document.querySelector('#version-text').textContent = version;
    document.querySelector('#download-button').href = url;
};

updateButtonUrl();
