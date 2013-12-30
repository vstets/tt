AsyncTestCase("App.collection.player.Track", {
    /**
     * This function calls every time before test starts
     */
    setUp: function () {
        //
        // We should create temporary instance of collection for testings
        //
        this.trackCollection = new App.collection.player.Track();
        this.trackCollection.reset();
    },
    /**
     * This function calls after test will complete
     * and removes everything that w as created in setUp()
     */
    tearDown: function () {
        this.trackCollection = undefined;
    },

    //
    // This is configuration section. All tests below will test config parameters.
    //

    /*
     * Tests Track collection init
     */
    testCollectionInit: function () {
        assertTrue(
            'Bad model for collection.player.Track',
            this.trackCollection.model.prototype.className === "App.model.player.Track"
        );
        assertTrue(
            'Bad url for collection.player.Track',
            this.trackCollection.url === App.Config.player.tracksCollectionUrl
        );
        assertTrue(
            'Bad mixins for collection.player.Track',
            this.trackCollection.__proto__.mixins.iface.className === "App.mixin.Interface" &&
                this.trackCollection.__proto__.mixins.observe.className === "App.mixin.Observer"
        );
        assertTrue(
            'Bad listeners for collection.player.Track',
            this.trackCollection._events !== undefined
            && this.trackCollection._events.add !== undefined
            && this.trackCollection._events.change !== undefined
            && this.trackCollection._events.remove !== undefined
        );
    },

    /*
     * Tests behavior change Track collection
     */
    testGetSumOfCollection: function () {
        this.trackCollection['_sum'] = 10;
        assertTrue(
            'Bad work getSum() of collection.player.Track',
            this.trackCollection.getSum() === 10
        );
        // for recalculate _sum of this.trackCollection
        this.trackCollection._calculateSum();

        // For correct working this test instance of Track collection
        // must listen event 'add'(for run function _calculateSum())
        assertException(
            "No generate exception in function _calculateSum() when _sum below 0",
            function () {
                this.trackCollection.add([{url:"http://track.mp3", rating: -5}]);
            }
        );
    }
});