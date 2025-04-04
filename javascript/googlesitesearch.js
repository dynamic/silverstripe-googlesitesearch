// File: vendor/dnadesign/silverstripe-googlesitesearch/javascript/googlesitesearch.js

(function() {
    // Escape special HTML characters in a string.
    function escapeHtml(str) {
        return str.replace(/[&<>\"\'\/]/g, function(match) {
            const escapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '\"': '&quot;',
                '\'': '&#39;',
                '/': '&#x2F;'
            };
            return escapes[match];
        });
    }

    // A safe templating function that replaces placeholders in the form {{=key}} with escaped data.
    // Note: This simple implementation does not support conditionals.
    function safeTmpl(templateId, data) {
        var template = document.getElementById(templateId).innerHTML;
        return template.replace(/{{=([\w\.]+)}}/g, function(match, key) {
            var keys = key.split('.');
            var value = data;
            for (var i = 0; i < keys.length; i++) {
                if (value && Object.prototype.hasOwnProperty.call(value, keys[i])) {
                    value = value[keys[i]];
                } else {
                    return '';
                }
            }
            return escapeHtml(String(value));
        });
    }

    // Expose our safe templating function so existing code using tmpl continues to work.
    window.tmpl = safeTmpl;

    // Utility for class manipulation.
    function addClass(el, className) {
        if (el) el.classList.add(className);
    }
    function removeClass(el, className) {
        if (el) el.classList.remove(className);
    }

    document.addEventListener('DOMContentLoaded', function() {
        var search      = document.getElementById("g_cse"),
            results     = document.getElementById("g_cse_results"),
            header      = document.getElementById("g_cse_results_header"),
            searchInput = document.getElementById("g_cse_search_form__input");

        // Listen for Enter key press in the search field.
        if (searchInput) {
            searchInput.addEventListener('keydown', function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    var query = searchInput.value.trim();
                    // Allow letters, numbers, underscore, spaces, dashes, and ampersands.
                    if (query && /^[\w\s\-\&]+$/.test(query)) {
                        var urlObj = new URL(window.location.href);
                        urlObj.searchParams.set('search', query);
                        // Reset start to display from beginning.
                        urlObj.searchParams.set('start', 1);
                        window.location.href = decodeURI(urlObj.toString());
                    }
                }
            });
        }

        function search_error() {
            removeClass(results, 'results_loading');
            addClass(results, 'results_haserror');
        }
        function search_nosearchterm() {
            removeClass(results, 'results_loading');
            addClass(results, 'results_hasnosearchterm');
        }
        function search_noresults() {
            removeClass(results, 'results_loading');
            addClass(results, 'results_hasnoresults');
        }

        if (search) {
            var currentUrl = window.location.href;
            if (currentUrl.indexOf('search=') !== -1) {
                var urlObj         = new URL(currentUrl),
                    key            = search.getAttribute('data-key'),
                    cx             = search.getAttribute('data-cx'),
                    domain         = search.getAttribute('data-domain'),
                    start          = urlObj.searchParams.get('start') || 1,
                    refinement     = urlObj.searchParams.get('refinement'),
                    searchQuery    = urlObj.searchParams.get('search'),
                    refinementString = refinement ? '%20more:' + refinement : '';

                if (searchQuery) {
                    // Build the Google custom search API URL.
                    var apiUrl = "https://www.googleapis.com/customsearch/v1?key=" + key +
                        "&cx=" + cx +
                        "&siteSearch=" + domain +
                        "&safe=high&q=" + encodeURIComponent(searchQuery + refinementString) +
                        "&start=" + start;

                    fetch(apiUrl)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(data) {
                            if (!data) {
                                return search_error();
                            }
                            var list       = results.querySelector(".result_list"),
                                refinements = results.querySelector(".result_refinements");

                            if (data.items && data.items.length > 0) {
                                // Create next link if available.
                                if (data.queries && data.queries.nextPage && data.queries.nextPage.length > 0) {
                                    urlObj.searchParams.set('start', data.queries.nextPage[0].startIndex);
                                    data.nextLink = decodeURI(urlObj.toString());
                                }
                                // Create previous link if available.
                                if (data.queries && data.queries.previousPage && data.queries.previousPage.length > 0) {
                                    urlObj.searchParams.set('start', data.queries.previousPage[0].startIndex);
                                    data.previousLink = decodeURI(urlObj.toString());
                                }

                                // Create refinements if provided.
                                if (data.context && data.context.facets && data.context.facets.length > 0) {
                                    data.context.facets.forEach(function(obj) {
                                        urlObj.searchParams.set('start', 0);
                                        urlObj.searchParams.set('refinement', obj[0].label);
                                        obj[0].link = decodeURI(urlObj.toString());
                                        obj[0].activeClass = (refinement === obj[0].label) ? "active" : "";
                                        refinements.insertAdjacentHTML('beforeend', tmpl("refinement_tmpl", obj[0]));
                                    });
                                }

                                removeClass(results, 'results_loading');
                                results.insertAdjacentHTML('beforebegin', tmpl("pre_result_tmpl", data));

                                data.items.forEach(function(item) {
                                    list.insertAdjacentHTML('beforeend', tmpl("result_tmpl", item));
                                });
                                results.insertAdjacentHTML('afterend', tmpl("post_result_tmpl", data));
                            } else {
                                search_noresults();
                            }
                        })
                        .catch(function(error) {
                            search_error();
                        });
                } else {
                    search_error();
                }
            } else {
                search_nosearchterm();
            }
        }
    });
})();
