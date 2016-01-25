/**
 * Class to perform searches needs configuration on PRIMO site too. 'WS and XS IP' mapping table must allow external IP's
 * @class _search
 * @private
 */
function _search() {
    return {
        /**
         * Get Record by record_id
         * @method byRecordId
         * @private
         * @param {String} record id
         * @returns {Object} record hash
         */
        byRecordId: function(rid, options){
            if (rid === undefined) {
                throw 'You must supply a record id'
            }

            var institution = (options !== undefined) && (options['institution'] !== undefined) ? options['institution'] : jQuery.PRIMO.session.view.institution.code;
            var index       = (options !== undefined) && (options['index'] !== undefined) ? options['index'] : 1;
            var bulkSize    = (options !== undefined) && (options['bulkSize'] !== undefined) ? options['bulkSize'] : 10;


            var result      = [];

            jQuery.get('/PrimoWebServices/xservice/search/brief?institution=' + institution + '&query=rid,contains,' + rid +
                       '&indx=' + index + '&bulkSize=' + bulkSize)
                  .done(function(data){
                    result = $(_xml2json(data));
                    })
                  .fail(function(data){
                    console.log('error searching')
                    });

            return result;
        },
        /**
         * Get Record by a query in the form of index,match type,query
         * @method byQuery
         * @private
         * @param {String} query
         * @returns {Object} record hash
         */
        byQuery: function(query, options) {
            var institution = (options !== undefined) && (options['institution'] !== undefined) ? options['institution'] : jQuery.PRIMO.session.view.institution.code;
            var index       = (options !== undefined) && (options['index'] !== undefined) ? options['index'] : 1;
            var bulkSize    = (options !== undefined) && (options['bulkSize'] !== undefined) ? options['bulkSize'] : 10;

            if (Array.isArray(query)){
                var tmpQuery = "";
                jQuery.each(query, function(index, value){
                    tmpQuery += '&query=' + value;
                });

                query = tmpQuery;
            } else {
                query = '&query=' + query;
            }

            var result = [];

            jQuery.ajax(
                {
                    async: false,
                    cache: false,
                    type: 'get',
                    dataType: 'xml',
                    url: '/PrimoWebServices/xservice/search/brief?institution=' + institution + '&indx=' + index + '&bulkSize=' + bulkSize + query
                })
                .done(function(data, event, xhr){
                    result = $(_xml2json(data));
                })
                .fail(function(data, event, xhr){
                    console.log('error searching')
                });


            if (result.length > 0 && result[0].hasOwnProperty('JAGROOT')) {
                return result[0].JAGROOT.RESULT.DOCSET.DOC;
            } else if (result.length > 0 && result[0].hasOwnProperty('MESSAGE'))  {
                console.log(result[0].MESSAGE);
            }

            return null;
        }
    }
}