const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

autocomplete({
  container: "#autocomplete",
  placeholder: "Search",
  debug: true,
  openOnFocus: true,
  getSources({ query, state }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: "products",
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: "instant_search",
                query,
                params: {
                  attributesToSnippet: ['name:10', 'description:35'],
                  snippetEllipsisText: '…',
                  hitsPerPage: 5
                }
              }
            ]
          });
        },
        templates: {
          header() {
            return (
              "Products"
            );
          },
          item({ item, components, html }) {
            return html`<div class="aa-ItemWrapper">
              <div class="aa-ItemContent">
                <div class="aa-ItemIcon aa-ItemIcon--alignTop">
                  <a href="${item.url}"><img
                    src="${item.image}"
                    alt="${item.name}"
                    width="40"
                    height="40"
                  /></a>
                </div>
                <div class="aa-ItemContentBody">
                  <div class="aa-ItemContentTitle">
                    <a href="${item.url}">
                      ${components.Highlight({
                        hit: item,
                        attribute: 'name',
                      })}
                    </a>
                  </div>
                  <div class="aa-ItemContentDescription">
                    ${components.Snippet({
                      hit: item,
                      attribute: 'description',
                    })}
                  </div>
                </div>
              </div>
            </div>`;
          },
          noResults() {
            return "No products for this query.";
          }
        },
        getItemUrl({ item }) {
          return item.url;
        },
      }
    ];
  }
});

