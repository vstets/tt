/**
 * Playlist grid. contains a list of URLs of tracks to play
 *
 * Available events:
 * selected Fires then one row in grid is selected
 *
 * @author DeadbraiN
 */
N13.define('App.view.player.PlaylistGrid', {
    extend : 'App.view.base.View',
    requires: [
        'App.template.player.PlaylistGrid',
        'App.Config'
    ],
    configs : {
        /**
         * {String|Boolean} Name of the template class for current view or false if current class doesn't use template
         */
        template: 'player.PlaylistGrid',
        /**
         * {null|String} Name of the collection, which contains tracks for playlist
         */
        tracks : null
    },


    /**
     * Private fields creator and initializer
     */
    initPrivates: function () {
        this.callParent();

        /**
         * {Element|null} Current(selected) row
         * @private
         */
        this._curRowEl = null;
        /**
         * {Number|null} Current(selected) row index
         * @private
         */
        this._curRow = 0;
        /**
         * {Number} Max rating of tracks
         * @private
         */
        this._maxRating = App.Config.player.maxRating;
        /**
         * {Number} Sequence of playing tracks collection
         * Must be an integer and in this._tracksPlayModes
         * Using in selectNextTrack(){} for choice mode of select next track
         * @private
         */
        this._playbackMode = 0;
        /**
         * {Array} Track play modes
         * 0 - the tracks are played sequentially
         * 1 - the tracks are played according to their rankings
         * using for check input data "mode" in switchPlayMode(mode){}
         *
         * @private
         */
        this._tracksPlayModes = [0, 1];
    },

    /**
     * Calls before render() method for pre render actions.
     * It sets a tracks collection to the template.
     */
    onBeforeRender: function () {
        this.callParent();

        if (!this.tracks) {
            console.error('Tracks collection wasn\'t set for playlist');
            return false;
        }

        this.setConfig({
            data: {
                tracks   : this.tracks.toJSON(),
                maxRating: this._maxRating
            }
        });
    },

    /**
     * Calls after render() method for post render actions. It binds click event
     * handlers to the table rows. Run rating for tracks and show rating of default tracks.
     */
    onAfterRender: function () {
        var me = this;

        // Run rating library
        this.el.find('.rating').starRating({
            minus: false // step minus button
        });

        // Show rating of default tracks
        $('div.rating').each(function () {
            //search track rating attribute of current track
            var trackRating = $(this).attr('data-val');
            //click emulation for display rating
            if (trackRating > 0) {
                $(this).find('li').get(trackRating - 1).click();
            }
        });

        if (this.tracks) {
            this.tracks.off('add', this._onChange);
            this.tracks.off('remove', this._onChange);
            this.tracks.off('change', this._onChange);

            this.tracks.on('add', this._onChange, this);
            this.tracks.on('remove', this._onChange, this);
            this.tracks.on('change', this._onChange, this);
        }

        if ($.isNumeric(this._curRow)) {
            this.select(this._curRow);
        }

        this.el.find('tr').off().on('click', function () {me._onRowClick.apply(me, arguments);});

        this.callParent();
    },


    /**
     * 'played' event handler. Play next track in the playlist
     * Next track is determined according to the method chosen by playing tracks
     * @param {Number} curRow selected current row.
     * If curRow is not an integer number or below zero - return false.
     * @returns {boolean}
     * @public
     */
    selectNextTrack: function (curRow) {
        var me = this;

        // Number, which accumulate rating tracks
        // to select the track that will be played next
        var accumulateSum;
        // Sum of all tracks rating
        var totalSum;
        // Random number to select the track that will be played next
        var randomSum;

        // Check curRow - must be integer and equal or above zero
        if (!this._isInt(curRow) || curRow < 0 || curRow === Number.POSITIVE_INFINITY || curRow === Number.NEGATIVE_INFINITY) {
            console.error('Number of current row must be an integer and equal or above zero');
            return false;
        } else if (this.tracks === null) {
            console.error('No track in playlist');
            return false;
        } else if (this.tracks.length === 1) {
            me.select(true);
            console.info('Only one row in list.');
            return true;
        }

        switch (this._playbackMode) {
            case 0: { // tracks are played sequentially
                me.select(true);
                break;
            }
            case 1: { // the tracks are played according to their ratings
                accumulateSum = 0;
                totalSum = me.tracks.getSum();
                randomSum = Math.floor((Math.random() * totalSum) + 1);
                this.el.find('table.playlist-grid tr').each(function () {
                    accumulateSum = accumulateSum + +$(this).find('div.rating').attr('data-val');
                    if (accumulateSum >= randomSum) {
                        if ($(this).attr('row') != curRow) {
                            me.select($(this).attr('row'));
                            return false;
                        } else {
                            me.selectNextTrack(curRow);
                        }
                    }
                });
                break;
            }
        }
        return true;
    },

    /**
     * Selects specified track by it's row index
     * @param {Number|Boolean} row Row index
     */
    select: function (row) {
        $('.playlist-grid tr[row="' + ($.isNumeric(row) ? row : this._curRow + 1) + '"] td[col="0"]').click();
    },

    /**
     * Rating button click handler. Change mode of playing tracks
     * @param optional {Number} mode - integer.
     * If disable, not a number, not in _tracksPlayModes - set next playback mode
     * If present - must be in _tracksPlayModes
     */
    switchPlayMode: function (mode) {
        // Current playback mode
        var currMode = this._playbackMode;
        // Current playback mode index
        var currModeIndex;
        // All options playback modes
        var playbackModes = this._tracksPlayModes;
        // Index of mode in _tracksPlayModes
        var index = $.inArray(mode, playbackModes);

        // If argument "mode" present and in _tracksPlayModes
        // set _playbackMode to "mode"
        if (index !== -1) {
            this._playbackMode = playbackModes[index];
            // If argument "mode" disable, not a number, not in _tracksPlayModes
        } else {
            currModeIndex = $.inArray(currMode, playbackModes);
            // If current playback mode is last element in _tracksPlayModes -
            // set playback mode as a first element of _tracksPlayModes
            if (currModeIndex + 1 === playbackModes.length) {
                this._playbackMode = playbackModes[0];
            }
            // else set playback mode as a following the current
            else {
                this._playbackMode = playbackModes[currModeIndex + 1];
            }
        }
    },

    /**
     * Rerender this view
     * @private
     */
    _onChange: function () {
        this.render();
    },

    /**
     * Table row and rating click event handler.
     * Adds selection css style to the clicked row, adds new rating to models of tracks
     * if clicked on rating column and delete track if clicked on on "X"
     * @param {Event} e Event object
     * @private
     */
    _onRowClick: function(e) {
        // Column number of selected row
        var col;
        // Node name of current click target
        var eventTargetNodeName = e.target.nodeName.toUpperCase();
        // Target of current click
        var curRowEl = $(e.currentTarget);
        // Number of clicked row
        var curRow = +curRowEl.attr('row');

        if (eventTargetNodeName === 'TD') {
        // If click on row of the table (not on rating of tracks)

            // Deselect a previously selected row
            if (this._curRowEl) {
                this._curRowEl.removeClass('selected');
            }

            // Save curRowEl for use when a user clicks on the row at the next time
            this._curRowEl = curRowEl;

            col = +$(e.target).attr('col');

            // If user clicks on row 0 or 1 (list of tracks) - select this row and
            // trigger "selected" (for play this track)
            // Else if user clicks on "X" - delete track and clear this._curRowEl
            if (col === 0 || col === 1) {
                curRowEl.addClass('selected');
                // Save current playing row to this._curRow
                this._curRow = curRow;
                this.trigger('selected', this.tracks.at(curRow));
            } else if (col === 2) {
                // Decrease curRow by 1, if delete row upper or equal to current playing row
                // (for use when a user clicks on the row at the next time)
                if (this._curRow >= curRow) {
                    this._curRow -= 1;
                }
                this._curRowEl = null;
                this.tracks.remove(this.tracks.at(curRow));
            }
        } else if (eventTargetNodeName === 'LI') {
        // Else if click on rating of track - change rating of this track
            this.tracks.at(curRow).set({rating: $(e.target).index() + 1}, {validate: true});
        }
    },

    /**
     * Check whether an object is an integer
     * @param n {Undefined|Object}
     * @returns {boolean}
     * @private
     */
    _isInt: function (n) {
        return +n === n && !(n % 1);
    }
});
