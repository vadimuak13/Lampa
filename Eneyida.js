(function(){
    let network = new Lampa.Network();

    function search(query, callback) {
        let url = `https://eneyida.tv/index.php?do=search&subaction=search&story=${encodeURIComponent(query)}`;

        network.silent(url, (html) => {
            let results = [];

            let items = html.match(/<div class="shortstory">([\s\S]*?)<\/div><div class="shortstory-separator">/g);
            if (items) {
                items.forEach(item => {
                    let title = item.match(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/);
                    let image = item.match(/<img src="([^"]+)"/);
                    let link = title ? title[1] : '';
                    let name = title ? title[2].replace(/<\/?[^>]+(>|$)/g, "").trim() : '';

                    if (link && name) {
                        results.push({
                            title: name,
                            url: 'https://eneyida.tv' + link,
                            poster: image ? image[1] : '',
                            quality: 'HD',
                            info: 'Озвучка українською',
                            player: true
                        });
                    }
                });
            }

            callback(results);
        }, () => {
            callback([]);
        });
    }

    Lampa.Platform.addSource({
        name: 'EneyidaTV',
        type: 'online',
        search: search
    });
})();
