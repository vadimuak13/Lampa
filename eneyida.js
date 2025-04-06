// ==UserScript==
// @name         Eneyida Plugin for Lampa
// @description  Онлайн-провайдер для перегляду фільмів з eneyida.tv у Lampa
// ==/UserScript==

(function () {
    window.plugin = function(plugin) {
        plugin.register("eneyida", {
            type: "video",
            name: "Eneyida",
            synopsis: "Провайдер з сайту eneyida.tv",
            version: "1.0.0",

            search: async function (query, movie, callback) {
                try {
                    let title = query.search;
                    let year = movie.original_language === 'uk' ? movie.release_date?.split('-')[0] : '';
                    let url = `https://eneyida.tv/index.php?do=search&subaction=search&story=${encodeURIComponent(title)}`;

                    let html = await fetch(url).then(r => r.text());
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, "text/html");

                    let items = [...doc.querySelectorAll('.shortstory')];

                    let results = items.map(item => {
                        let link = item.querySelector(".short-title a")?.href;
                        let name = item.querySelector(".short-title a")?.textContent?.trim();
                        let quality = 'HD';

                        if (link) {
                            return {
                                title: name,
                                file: link,
                                quality: quality,
                                info: 'Eneyida',
                                url: link,
                                timeline: false,
                            }
                        }
                    }).filter(Boolean);

                    callback(results);
                } catch (e) {
                    console.error("Eneyida Plugin Error:", e);
                    callback([]);
                }
            },

            play: function (element, settings, callback) {
                callback({
                    player: 'iframe',
                    url: element.file
                });
            }
        });
    }
})();
