(function(){
    let eneyida = {};

    eneyida.search = function(query, call) {
        let url = `https://eneyida.tv/index.php?do=search&subaction=search&story=${encodeURIComponent(query)}`;
        network.silent(url, function(html){
            let results = [];
            let matches = html.matchAll(/<a class="short" href="(.*?)"[^>]*>\\s*<img src="(.*?)"[^>]*>\\s*<div class="short-title">([^<]*)<\\/div>/g);
            for (let match of matches) {
                results.push({
                    title: match[3],
                    url: 'https://eneyida.tv' + match[1],
                    quality: 'HD',
                    info: '🇺🇦 озвучка',
                    poster: 'https://eneyida.tv' + match[2]
                });
            }
            call(results);
        });
    };

    eneyida.play = function(item, call) {
        network.silent(item.url, function(html){
            let match = html.match(/<iframe.+?src="(.*?)"/);
            if (match) {
                call([{
                    file: match[1],
                    quality: 'HD',
                    label: 'Eneyida',
                    type: 'video'
                }]);
            } else {
                call([]);
            }
        });
    };

    Lampa.Platform.addProvider({
        name: 'eneyida',
        version: '1.1',
        type: 'video',
        search: eneyida.search,
        play: eneyida.play
    });
})();
