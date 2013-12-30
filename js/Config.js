/**
 * In this class sets default settings for all Application.
 * Divided into its component applications. For example, a player
 * For use data of this file you must add this config file
 * to N13.define() into "require" part
 *
 * Example:
 *
 * N13.define('App.collection.player.Track', {
 *   extend  : 'Backbone.Collection',
 *   requires: [
 *       'App.model.player.Track',
 *       'App.Config'
 *   ],
 *
 *   init: function () {
 *   this.url = App.Config.player.tracksCollectionUrl;
 *   }
 * );
 *
 * @author V.StetS
 */

N13.define('App.Config', {
    statics: {
        /**
         * Settings for "player" module
         */
        player: {
            /**
             * url for App.collection.player.Track
             */
            tracksCollectionUrl: 'js/mocks/defaultList.json',
            /**
             *Ratings must be an integer and can't be below zero
             * maxRating must be > minRating
             */
            maxRating          : 5,
            minRating          : 1,
            defaultRating      : 1
        }
    }
});