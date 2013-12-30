TestCase("App.view.player.ControlPanel", {
    /**
     * This function calls every time before test starts
     */
    setUp: function () {
        //
        // We should create temporary instance of model for testings
        //

        //Create control panel and render into body
        this.cp = new App.view.player.ControlPanel();
        this.cp.render('body');
    },
    /**
     * This function calls after test will complete
     * and removes everything that was created in setUp()
     */
    tearDown: function () {
        // Destroy control panel
        this.cp.destroy();
    },


    //
    // This is configuration section. All tests below will test config parameters.
    //

    /*
     * Tests view after render
     */
    testControlPanelAfterRender: function () {
        assertFalse('_audioEl not set after render', this.cp._audioEl === undefined || this.cp._audioEl === null);
    },

    /*
     * Tests checking of input parameters of function play()
     */
    testPlayingControlPanel: function () {
        assertFalse('Bad check of input parameters of function play() - empty string', this.cp.play(''));
        assertFalse('Bad check the existence of function parameters of function play()', this.cp.play());
        assertTrue('If input parameters is valid - function play() must return "true"', this.cp.play('Url'));
    },

    /*
    * Tests of player control panel listen    *
    */
    testControlPanelListeners: function () {
        var listenResult = false;
        var changeRes = function () {listenResult = true};
        this.cp.listen(this.cp, 'played', changeRes, this);
        this.cp._audioEl.trigger('ended', this);
        assertTrue('Player control panel do not listen event "ended" of HTML5 player', listenResult);
    }
});
