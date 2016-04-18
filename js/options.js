/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let visible = false,
      modal = '<div id="optionsModal" class="options-modal" style="display: none;">' +
                '<div class="options-modal-content">' +
                  '<span class="options-close">x</span>' +
                  '<h3>Discogs Enhancer Options:</h3>' +
                  '<ul class="options">' +
                  '<li>' +
                  '<input id="analytics" name="analytics" type="checkbox" value="analytics" />' +
                  '<label for="analytics">Analytics</label>' +
                  '</li>' +
                  '<li>' +
                  '<input id="colorize" name="colorize" type="checkbox" value="colorize" />' +
                  '<label for="colorize">Colorize Prices</label>' +
                  '</li>' +
                  '<li>' +
                  '<input id="debug" name="debug" type="checkbox" value="debug" />' +
                  '<label for="debug">Debug Messages</label>' +
                  '</li>' +
                  '<li>' +
                  '<input id="unittests" name="unittests" type="checkbox" value="unittests" />' +
                  '<label for="unittests">Unit Tests</label>' +
                  '</li>' +
                  '<li>' +
                  '<label for="threshold" id="thresholdLabel">Threshold:</label>' +
                  '<input id="threshold" name="threshold" type="number" value="" max="10" min="0"/>' +
                  '</li>' +
                  '</ul>' +
                  '<a href="#" class="options-save button button_green">Save options</a>' +
                '</div>' +
              '</div>';


  // Get them options
  function getOptions() {

    let
        analytics = localStorage.getItem('analytics'),
        colorize = localStorage.getItem('colorize'),
        debug = localStorage.getItem('debug'),
        unitTests = localStorage.getItem('unitTests'),
        threshold = localStorage.getItem('threshold') || 2;

    if (analytics === 'true') {

      $('#analytics').prop('checked', true);
    }

    if (colorize === 'true') {

      $('#colorize').prop('checked', true);
    }

    if (debug === 'true') {

      $('#debug').prop('checked', true);
    }

    if (unitTests === 'true') {

      $('#unittests').prop('checked', true);
    }

    if (threshold) {

      $('#threshold').val(threshold);
    }
  }


  // Save them options
  function saveOptions() {

    let
        colorizePrices = $('#colorize').prop('checked'),
        setThreshold = $('#threshold').val(),
        useAnalytics = $('#analytics').prop('checked'),
        useDebugMessagse = $('#debug').prop('checked'),
        useUnitTests = $('#unittests').prop('checked');

    localStorage.setItem('analytics', useAnalytics);

    localStorage.setItem('colorize', colorizePrices);

    localStorage.setItem('unitTests', useUnitTests);

    localStorage.setItem('debug', useDebugMessagse);

    localStorage.setItem('threshold', setThreshold);

    resourceLibrary.appendNotice('Options have been saved. Please refresh the page.');
  }

  // event listener
  document.onkeyup = function(e) {

    // alt + ctrl + 7
    if (e.altKey && e.ctrlKey && e.which === 55) {

      if (!visible) {

        visible = true;

        $('.options-modal').show();

        getOptions();

        // Close it
        $('.options-close').click(function() {

          $('.options-modal').hide();

          visible = false;
        });

        // Save it
        $('.options-save').click(function() {

          saveOptions();
        })
      }

      return false;
    }
  };

  $('body').append(modal);

  getOptions();
});
