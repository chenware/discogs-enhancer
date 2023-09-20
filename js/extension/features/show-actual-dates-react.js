/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */


 rl.ready(() => {

  if ( rl.pageIs('release') ) {

    rl.waitForElement('div[class*="collection_"]').then(() => {

      let { featureData } = rl.getItem('userPreferences'),
          usDateFormat = featureData.usDateFormat,
          copies = document.querySelectorAll('div[class*="collection_"]'),
          language = rl.language(),
          monthList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

      // ========================================================
      // Functions
      // ========================================================
      /**
       * Sets a data attribute on each span that contains the
       * relative date the item was added to the collection/wantlist
       * @returns {Undefined}
       */
      function storeRelativeDates() {
        let dates = document.querySelectorAll('div[class*="collection_"] span[class*="added_"]');
        dates.forEach(date => { date.dataset.approx = date.textContent; });
      }

      /**
       * Converts time from 12 hour format to 24 hour format
       * @param {String} time12h - The time in 12 hour format (1:15 PM)
       * @returns {String}
       */
      function convertTo24(time12h) {

        let [time, meridiem] = time12h.split(' '),
            [hours, minutes,] = time.split(':');

        if ( hours === '12' ) { hours = '00'; }

        if ( meridiem === 'PM' ) { hours = parseInt(hours, 10) + 12; }

        return `${hours}:${minutes}`;
      }

      /**
      * Returns the localized month
      * @param {Number} monthIndex - The index of the month from the `monthList` array
      * @returns {String} - The localized month string
      */
      function getMonth(monthIndex) {
        let objDate = new Date();
        objDate.setMonth(monthIndex);
        return objDate.toLocaleString(language, { month: 'long' });
      }

      /**
       * Injects the `addedAt` data into the "In Collection" element(s)
       * @returns {Promise}
       */
      function getAddedDate() {
        return new Promise((resolve) => {
          return setTimeout(async () => {
            let regex = /(\d+)/g,
                releaseId = document.querySelector('#release-actions button[class*="id_"]').textContent.match(regex),
                ids = await window.getUserData(releaseId),
                itemsInCollection = document.querySelectorAll('div[class*="collection_"]');

            ids.forEach((id, i) => { itemsInCollection[i].dataset.addedAt = id.node.addedAt; });

            return resolve();
          }, 100);
        });
      }

      /**
       * Returns a string in simplified extended ISO format which
       * accounts for the user's timezone offset
       * @param {<object>Date} date - Date object
       * @returns {String}
       */
      function toIsoStringOffset(date) {
        let tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                let norm = Math.floor(Math.abs(num));
                return (norm < 10 ? '0' : '') + norm;
            };

        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
      }

      /**
      * Renders the date format into the DOM
      * @returns {undefined}
      */
      function renderDate(elem) {

        let timestamp = elem.dataset.addedAt, // '2019-02-01T16:39:27-08:00'
            dateOffset = toIsoStringOffset(new Date(timestamp)).split('T')[0], // '2019-02-01'
            timeRaw = new Date(timestamp).toLocaleTimeString().split(' '), // ['04:39:51', 'PM']
            [hours, mins] = timeRaw[0].split(':'),
            meridiem = timeRaw[1],
            time = `${hours}:${mins} ${meridiem}`,
            [year, month, day] = dateOffset.split('-'); // ['2019', '02', '01']

        let monthIndex = monthList.indexOf(month),
            international = `Added ${day} ${getMonth(monthIndex)} ${year} ${convertTo24(time)}`,
            american = `Added ${getMonth(monthIndex)} ${day}, ${year} ${time}`,
            actualDateAdded = usDateFormat ? american : international;

        elem.querySelector('span').textContent = actualDateAdded;
      }

      // ========================================================
      // CSS
      // ========================================================
      let rules = `
          div[class*="collection_"] span[class*="added_"] {
            display: inline-block;
            width: auto;
            font-size: smaller;
          }`;

      // ========================================================
      // DOM setup
      // ========================================================
      if ( usDateFormat === undefined ) usDateFormat = false;

      rl.attachCss('date-toggle', rules);
      storeRelativeDates();

      getAddedDate().then(() => {
        copies.forEach(copy => renderDate(copy));

        // Mouseover/mouseleave Event listeners
        // ------------------------------------------------------
        copies.forEach(copy => {

          let span = copy.querySelector('span[class*="added_"'),
              actual = span.textContent;

          copy.querySelector('span[class*="added_"').addEventListener('mouseover', () => {
            span.textContent = span.dataset.approx;
          });

          copy.querySelector('span[class*="added_"').addEventListener('mouseleave', () => {
            span.textContent = actual;
          });
        });
      });
    });
  }
});
/*
// ========================================================
And maybe my issues are not your issues
But everyone has to sleep and everybody carries weight.
You can't escape regret, but you might regret escape
If you closed your eyes and held it, would you recognize the shape?
https://www.discogs.com/master/view/419728
// ========================================================
*/
