/**
 * Button abstraction
<<<<<<< HEAD
 * Available events: *
 * click Fires when user clicks on button
=======
 *
 * Available events:
 *
 * click Fires when user clicks on button
 *
>>>>>>> 0f021f15b51cb97098a64e28b0c1efbc71abb96d
 * @author DeadbraiN
 */
N13.define('App.view.player.ToggleButton', {
    extend : 'App.view.Button',
    configs: {
        title   : 'Rating',
        btnClass: 'toggle-button'
    },

    /**
     * Calls after render() method. Here all DOM model have already
     * rendered and we may bind event handlers to them.
     */
    onAfterRender: function () {
        var me = this;
        this.callParent();
        this.listen(this, 'click', function () {
            me.el.find('.' + me.btnClass).toggleClass('toggle-on');
        });
    }
});