/**
 * Unit tests for view.player.PlaylistContainer
 */

TestCase("App.view.player.PlaylistContainer", {
    /**
     * This function calls every time before test starts
     */
    setUp: function () {
        $('body').append('<div id="viewContainer"></div>');
        this.viewContainer = $('#viewContainer');
        this.plc = new App.view.player.PlaylistContainer();
    },
    /**
     * This function calls after test will complete
     * and removes everything that was created in setUp()
     */
    tearDown: function () {
        this.plc.destroy();
        $('body').children().remove();
    },


    //
    // This is configuration section. All tests below will test config parameters.
    //

    /*
     * Test of render playlist container
     */
    testRenderPlaylistContainer: function () {
        this.plc.render('#viewContainer');
        assertTrue('Playlist container must be render', this.viewContainer.children().length !== 0);
    }
});
