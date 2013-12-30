TestCase("App.model.player.Track", {
    /**
     * This function calls every time before test starts
     */
    setUp: function () {
        //
        // We should create temporary instance of model for testings
        //
        this.trackModel = new App.model.player.Track();
    },
    /**
     * This function calls after test will complete
     * and removes everything that was created in setUp()
     */
    tearDown: function () {
        this.trackModel.destroy();
    },


    //
    // This is configuration section. All tests below will test config parameters.
    //

    /*
     * Tests default data of model.player.Track
     */
    testDefaultDataOfModel: function () {
        assertTrue(
            'Bad default data for model.player.Track',
            this.trackModel.get('url') === null && this.trackModel.get('rating') === 1
        );
    },

    /*
     * Tests validation of model.player.Track
     */
    testValidationOfModel: function () {
        var trackModel1 = new App.model.player.Track({
            'url': 'http://track.ogg',
            'rating': (App.Config.player.minRating - 1)
        });
        var trackModel2 = new App.model.player.Track({
            'url': 'http://track.ogg',
            'rating': App.Config.player.maxRating + 1
        });
        assertTrue(
            'Bad validation when initialize instance of model.player.Track (attribute "rating")',
            trackModel1.get('rating') === App.Config.player.minRating
                && trackModel2.get('rating') === App.Config.player.maxRating
        );

        assertFalse(
            'Bad validation when set attribute "rating" of model.player.Track',
            this.trackModel.set({'rating': App.Config.player.minRating - 1}, {'validate': true})
                || this.trackModel.set({'rating': App.Config.player.maxRating + 1}, {'validate': true})
        );
    }
});