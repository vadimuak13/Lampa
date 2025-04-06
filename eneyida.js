(function(){
    const eneyida = {};

    // Використовуємо fetch, сумісний з web і Android
    eneyida.search = function(query, call) {
        const searchUrl = `https://eneyida.tv/index.php?do=search&subaction=search&story=${encodeURIComponent(query)}`;

        fetch(searchUrl)
            .then(response => response.text())
            .then(html => {
                const results = [];
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const items = doc.querySelectorAll('div.shortstory');

                items.forEach(item => {
                    const a = item.querySelector('a.short');
                    const img = item.querySelector('img');
                    const title = item.querySelector('.short-title');

                    if (a && img && title) {
                        results.push({
                            title: title.textContent.trim(),
                            url: a.href,
                            quality: 'HD',
                            info: '🇺🇦 Eneyida',
                            poster: img.src.startsWith('http') ? img.src : 'https://eneyida.tv' + img.src
                        });
                    }
                });

                call(results);
            })
            .catch(() => call([]));
    };

    eneyida.play = function(item, call) {
        fetch(item.url)
            .then(response => response.text())
            .then(html => {
                const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/);
                if (match && match[1]) {
                    call([{
                        file: match[1],
                        quality: 'HD',
                        label: 'Eneyida',
                        type: 'video'
                    }]);
                } else {
                    call([]);
                }
            })
            .catch(() => call([]));
    };

    if (typeof Lampa !== 'undefined' && Lampa.Platform && Lampa.Platform.addProvider) {
        Lampa.Platform.addProvider({
            name: 'eneyida',
            version: '2.0',
            type: 'video',
            search: eneyida.search,
            play: eneyida.play
        });
    }
})();
