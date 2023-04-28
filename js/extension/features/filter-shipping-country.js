/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ----------------------------------------------------------
 * Overview
 * ----------------------------------------------------------
 *
 * This feature will hide items that ship from specified
 * countries in the Marketplace.
 */

rl.ready(() => {

  let { countryList } = rl.getPreference('featureData'),
      href = window.location.href,
      currencyInURL = href.includes('currency=');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Filter items in the Marketplace
   *
   * @method filterCountries
   * @return {function}
   */
  window.filterCountries = function filterCountries(include, useCurrency) {

    if ( rl.pageIs('allItems', 'sellRelease', 'myWants') ) {

      let shipsFrom = [...document.querySelectorAll('td.seller_info ul li:nth-child(3)')];

      if ( !useCurrency || useCurrency && currencyInURL ) {

        shipsFrom.forEach(location => {

          let countryName = location.textContent.split(':')[1];

          if ( !countryList.list.includes(countryName.toLowerCase()) === include ) {
            location.closest('.shortcut_navigable').classList.add('de-hide-country');
          }

          if ( shipsFrom.every(rl.isHidden) ) {

            let html = `<tr class="shortcut_navigable">
                          <th>
                            All results have been filtered out.
                          </th>
                        </tr>`;

            document.querySelector('#pjax_container tbody').innerHTML = html;
          }
        });
      }
    }
  };

  // ========================================================
  // CSS
  // ========================================================
  let rules = `
      .de-hide-country {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }`;

  // ========================================================
  // DOM manipulation
  // ========================================================

  if ( countryList ) {

    // Convert to lowercase for comparisons
    countryList.list = countryList.list.map(i => i.toLowerCase());

    if ( rl.pageIs('allItems', 'sellRelease', 'myWants') ) {

      rl.attachCss('filterShippingCountryCss', rules);
      window.filterCountries(countryList.include, countryList.currency);
      // Prev/Next clicks
      rl.handlePaginationClicks(window.filterCountries, countryList.include, countryList.currency);
    }
  }
});
