/**
 * Unit tests for view.player.PlaylistGrid
 */

TestCase("App.view.player.PlaylistGrid", {
    /**
     * This function calls every time before test starts
     */
    setUp: function () {
        //
        // We should create temporary instance of view for testings
        //

        this.plg = new App.view.player.PlaylistGrid();
        this.viewContainerName = 'viewContainer';
        this.viewContainer = '#' + this.viewContainerName;
        $('body').append('<div id="' + this.viewContainerName + '"></div>');
    },
    /**
     * This function calls after test will complete
     * and removes everything that was created in setUp()
     */
    tearDown: function () {
        this.plg.destroy();
        $('body').children().remove();
    },


    //
    // This is configuration section. All tests below will test config parameters.
    //
    /*
     * Test of render playlist greed
     */
    testRenderPlaylistContainer: function () {
        this.plg.tracks = new App.collection.player.Track();
        this.plg.render(this.viewContainer);
        assertTrue('Playlist container must be render', $(this.viewContainer).children().length !== 0);
    },

    /*
    * Test function selectNextTrack()
    */
    testSelectNextTrack: function () {
        var me = this;
        this.plg.tracks = new App.collection.player.Track();
        this.plg.render('#viewContainer');
        App.test.util.Common.mapValues(function (val) {
            assertFalse('Bad validation of function input arguments of selectNextTrack()', me.plg.selectNextTrack(val));
        }, ['number', 'zero']);
        this.plg.destroy();
    },

    /*
     * Test function select()
     */
    testSelect: function () {
        var me = this;
        this.plg.tracks = new App.collection.player.Track();
        this.plg.render('#viewContainer');
        App.test.util.Common.mapValues(function (val) {
            assertFalse(
                'Bad validation of function input arguments of select()',
                function() {

                    var oldCurRow = me.plg._curRow;
                    console.log("val = " + val);
                    console.log("oldCurRow = " + oldCurRow);
                    me.plg.select(val);
                    console.log("me.plg._curRow = " + me.plg._curRow);
                    console.log('================');
                    return me.plg._curRow === oldCurRow + 1;
                }())
        }, ['zero', 'number', 'infinity']);
/*
        assertFalse(
            'Bad validation of function input arguments of select()',
            function() {
                var val = 1;
                var oldCurRow = me.plg._curRow;
                console.log("val = " + val);
                console.log("oldCurRow = " + oldCurRow);
                me.plg.select(val);
                console.log("me.plg._curRow = " + me.plg._curRow);
                console.log('================');
                return me.plg._curRow === oldCurRow + 1;
            }()
        );
*/
    },

    testSelect2: function () {
        var me = this;
        this.plg.tracks = new App.collection.player.Track();
        this.plg.render('#viewContainer');

        var val = 1;
        var listenResult = false;
        var changeRes = function () {listenResult = true};
        //this.plg.listen($('.playlist-grid tr[row="' + ($.isNumeric(val) ? val : this._curRow + 1) + '"] td[col="0"]'), 'click', changeRes, this);
        $('.playlist-grid tr[row="1"] td[col="0"]').on('click', changeRes);


        this.plg.select(val);
        console.log('listenResult = ' + listenResult);

        assertTrue('ok', listenResult);

/*
        assertFalse(
            'Bad validation of function input arguments of select()',
            function() {
                var result = false;
                var oldCurRow = me.plg._curRow;
                var val = 1;

                me.plg.listen(
                    $('.playlist-grid tr[row="' + ($.isNumeric(val) ? val : me._curRow + 1) + '"] td[col="0"]'),
                    "click",
                    function () {result = true;},
                    me.plg);



                console.log("val = " + val);
                console.log("oldCurRow = " + oldCurRow);
                me.plg.select(val);
                console.log("me.plg._curRow = " + me.plg._curRow);
                console.log('result = ' + result);
                console.log('================');
                //me.plg._curRow === oldCurRow + 1;
                return result;
            }()
        );
        */

    }
});
