AsyncTestCase("App.view.player.ToggleButton", {
    /**
     * This function calls every time before test starts
     */
    setUp: function () {
        //
        // We should create temporary instance of model for testings
        //

        //NameSpace for button
        $('body').append('<div id="testToggleBtnDiv"></div>');
        this.toggleBtnDefaultClass = 'toggle-button';
        this.toggleBtnClassAfterClick = 'toggle-button toggle-on';
        this.toggleBtnQuery = '#testToggleBtnDiv .' + this.toggleBtnDefaultClass;
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
     * Tests validation of toggle of ToggleButton class after render view.player.ToggleButton
     * and after clicks on this button
     */
    testToggleButtonClassValidation: function () {
        var button = new App.view.player.ToggleButton();
        button.setConfig({title: 'TestToggleButton', btnClass: this.toggleBtnDefaultClass});
        button.render('#testToggleBtnDiv');

        assertTrue(
            'After render ToggleButton class must be === as in setConfig() ',
            $(this.toggleBtnQuery).attr('class') === this.toggleBtnDefaultClass
        );

        // Emulation of first click a button
        $(this.toggleBtnQuery).click();

        assertTrue(
            'After first clicking on ToggleButton its class must be === "' + this.toggleBtnClassAfterClick + '"',
            $(this.toggleBtnQuery).attr('class') === this.toggleBtnClassAfterClick
        );

        // Emulation of second click a button
        $(this.toggleBtnQuery).click();

        assertTrue(
            'After second clicking on ToggleButton its class must be === as in setConfig()',
            $(this.toggleBtnQuery).attr('class') === this.toggleBtnDefaultClass
        );

        button.destroy();
    }
});