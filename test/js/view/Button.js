AsyncTestCase("App.view.Button", {
    /**
     * This function calls every time before test starts
     */
    setUp: function () {
        //
        // We should create temporary instance of model for testings
        //
        $('body').append('<div id="testBtnDiv"></div>');
        $('body').append('<div id="testBtnDiv2"></div>');
    },
    /**
     * This function calls after test will complete
     * and removes everything that was created in setUp()
     */
    tearDown: function () {
        $('body').children().remove();
    },


    //
    // This is configuration section. All tests below will test config parameters.
    //

    /*
     * Tests validation of undefined attributes of button after render view.player.ToggleButton
     */
    testDisableAttributesValidation: function () {
        var button = new App.view.Button();
        button.render('#testBtnDiv');
        assertUndefined('After render title of button must be undefined', $('#testBtnDiv > .testBtn').html());
        assertUndefined('After render class of button must be undefined', $('#testBtnDiv > .testBtn').attr('class'));
        button.destroy();
    },

    /*
     * Tests validation of present class and title of button,
     * when set this parameters and render view.Button
     */
    testAttributesAfterSetConfigValidation: function () {
        var button = new App.view.Button();
        button.setConfig({title: 'TestTitleButton', btnClass: 'testBtn'});
        button.render('#testBtnDiv2');
        assertTrue('After setConfig() title of button must be "TestTitleButton"', $('#testBtnDiv2 > .testBtn').html() === 'TestTitleButton');
        assertTrue('After setConfig() Class of button must be "testBtn"', $('#testBtnDiv2 > .testBtn').attr('class') === 'testBtn');
        button.destroy();
    }
});