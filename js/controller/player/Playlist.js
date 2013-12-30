/**
 * Controls playlist and add track button components, button of sequence
 * of playing tracks. It's possible to use this controller outside, of audio player.
 * For example: for video player. So we should have separate controller for these
 * views.
 *
 * @author DeadbraiN
 */
N13.define('App.controller.player.Playlist', {
    extend : 'App.controller.base.Controller',
    mixins : {view: 'App.mixin.controller.View'},
    requires: ['App.Config'],
    configs: {
        /**
         * {App.collection.player.Track|null} Collection of tracks for playlist
         */
        tracks: null
    },

    /**
     * Here we should create all private fields of this class.
     * Undefined fields should be set to null (not undefined).
     */
    initPrivates: function () {
        this.callParent();
        /**
         * {Number} Default rating for new tracks
         * @private
         */
        this._defaultRating = App.Config.player.defaultRating;
    },

    /**
     * Adds event handlers for playlist and add button components.
     */
    onBeforeRun: function () {
        this.listen(this.findView('player.AddButton'), 'click', this._onAddTrackClick, this);
    },

    /**
     * Add track button click handler. Shows input window, gets user url and
     * adds new track to the collection. So, the playlist will be updated automatically..
     * @private
     */
    _onAddTrackClick: function () {
        var url = prompt('Please input a track URL:');
        if (N13.isString(url) && url !== '' && this.tracks) {
            this.tracks.add({url: url, rating: this._defaultRating});
        }
    }
});