/**
 *
 * An ExLibris PRIMO convinience Library
 */

jQuery.extend(jQuery.PRIMO, {
    session: _getSessionData(),
    records: (function () {
        var records_count = jQuery('.EXLResult').length;
        var data = [];

        for (var j = 0; j < records_count; j++) data.push(_record(j));

        return $(data);
    }()),
    search: _search(),
    version: "<%= version %>",
    reload: function(){
        jQuery.PRIMO.session.reload();
    }
});
