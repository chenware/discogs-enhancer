/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO: Similar logic for CD/Digital releases?
// TODO: https://www.discogs.com/Deepchord-dc07dc08dc09-remastered/release/4353196
//       https://www.discogs.com/Various-Crosswalk-Volume-01/release/7315950

$(document).ready(function() {

  let
      // don't insert dividers if headings already exist.
      // using 1 or less because of possible inclusion of track durations feature
      hasNoHeadings = $('.track_heading').length <= 1,
      // only insert dividers if there are more than 6 tracks
      listLength = $('.playlist tbody tr').length > 6,
      isVinyl = $('.profile').html().indexOf('/search/?format_exact=Vinyl') > -1,
      // Compilations have different markup requirements when rendering track headings...
      isCompilation = $('.tracklist_track_artists').length > 0,
      // ...so only insert the duration markup if it's a compilation
      duration = isCompilation ? '<td width="25" class="tracklist_track_duration"><span></span></td>' : '',
      spacer = '<tr class="tracklist_track track_heading"><td class="tracklist_track_pos"></td><td colspan="2" class="tracklist_track_title">&nbsp;</td>' + duration + '</tr>';

  if (hasNoHeadings && listLength && isVinyl) {

    let tracklist = $('.playlist tbody tr'),
        trackpos = $('.tracklist_track_pos').map(function() { return $(this).text(); });

    trackpos.each(function(i, tpos) {

      //console.log(tpos.match(/\d+/g))
      try {

        // if the next track's number is less than the current tracks number (ie: A2, B1 ...)
        if ( trackpos[i + 1].match(/\d+/g) < tpos.match(/\d+/g) ||
             // or the current track has no number and the next one does (ie: A, B1, ...)
             !tpos.match(/\d+/g) && trackpos[i + 1].match(/\d+/g) ) {

          $(spacer).insertAfter(tracklist[i]);
        }
      } catch (e) {

        console.log(e);
      }
    });
  }
});
