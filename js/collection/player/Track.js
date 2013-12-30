/**
 * Collection of "model.player.Track". Extend Backbone.Collection.
 *
 * Events:
 *      add - fires when add model to collection
 *      change - fires when change model of collection
 *      remove - fires when remove model from collection
 * *
 * Example:
 *
 * var collection  = new App.collection.player.Track();
 * var trackUrl    = "http://music.com/play1.mp3";
 * var trackRating = 3;
 *
 * this.tracks.add({url: trackUrl, rating: trackRating});
 * var getSumOfCollection = collection.getSum();
 *
 * @author V.StetS
 */

N13.define('App.collection.player.Track', {
    extend  : 'Backbone.Collection',
    mixins  : {
        iface  : 'App.mixin.Interface',
        observe: 'App.mixin.Observer'
    },
    requires: [
        'App.model.player.Track',
        'App.Config'
    ],

    /**
     * @constructor
     * Initializes model of current collection. We should do it
     * here because of model dependency issue.
     */
    init: function () {
        this.model = App.model.player.Track;
        this.url = App.Config.player.tracksCollectionUrl;

        this.callParent(arguments);
        this.callMixin('iface');
        this.callMixin('observe');

        this._initListeners();
    },

    /**
     * Private fields creator and initializer
     */
    initPrivates: function () {
        this.callParent();
        /**
         * {Number} Sum of rating of collection tracks.
         * Getter - getSum()
         * Setter - don't have. When change rating of any track in collection -
         * fires event add/change/remove and run _calculateSum() for recalculate
         * sum of ratings of all tracks in collection.
         * Use for calculate the next track to play to with regard to ratings
         * @private
         */
        this._sum = 0;
    },

    /**
     * Add event handlers and/or make some post initialization
     */
    afterInit: function () {
        // Data fetcher for Tracks collection
        var me = this;
        this.fetch({
            error  : function () {
                console.error("Can't fetch tracks from " + me.url);
            }
        });
    },

    /**
     * @getSum
     * Getter for this._sum
     * Get sum of rating current collection
     */
    getSum: function () {
        return this._sum;
    },

    /**
     * Tracks collection listeners initializer
     * @private
     */
    _initListeners: function () {
        this.listen(this, 'add', this._calculateSum, this);
        this.listen(this, 'change', this._calculateSum, this);
        this.listen(this, 'remove', this._calculateSum, this);
    },

    /**
     * @calculateSum
     * Calculate sum of rating all tracks of this collection
     * @private
     */
    _calculateSum: function () {
        var sum = 0;
        var models = this.models;
        var i;
        var length;

        for (i = 0, length = this.models.length; i < length; i++) {
            sum += models[i].get('rating');
        }
        if (sum < 0) {
            sum = 0;
            console.error("Sum of rating of tracks in collection must be >=0. Set sum of this rating === 0");
        }
        return this._sum = sum;
    }
});
