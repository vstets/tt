/**
 * Model of track in player.
 * When an instance of the model is initialized, setted or stored - validated model.Player.
 * By default validate of model.Player is called before save, but can also be called before set
 * if {validate:true} is passed. The validate method is passed the model attributes,
 * as well as the options from set or save.
 *
 * Attribute "rating" checked and must be: (minRating <= rating <= maxRating)
 * "minRating" and "maxRating" gets from App.Config.
 * If attribute "rating" < minRating: rating = minRating and return error string.
 * If attribute "rating" > maxRating: rating = maxRating and return error string.
 * In this case error string is available at property "model.validationError".
 *
 * @author V.StetS
 */

N13.define('App.model.player.Track', {
    extend    : 'Backbone.Model',
    requires  : ['App.Config'],

    /**
     * model.Player initializer.
     * Purpose - to run the validation when initializing an instance of the model - {validate: true}
     *
     * @param attrs
     */
    initialize: function (attrs) {
        if (attrs && attrs.rating !== undefined) {
            // {validate: true} - run validate() for attribute "rating"
            this.set({'rating': attrs.rating}, {validate: true});
        }
    },

    /**
     * Override function of Backbone.models
     * Checked attributes of model.player.Track:
     *      - rating: must be between App.Config.player.minRating and App.Config.player.maxRating
     *                if attribute "rating" < minRating: rating = minRating
     *                if attribute "rating" > maxRating: rating = maxRating
     *
     * @param attrs
     * attributes of model.player.Track
     *
     * @returns {string}
     * If input argument "rating" of model.player.Track is not valid, return string with error.
     */
    validate: function (attrs) {
        var rating, minRating, maxRating;

        if (attrs && attrs.rating !== undefined) {

            rating = attrs.rating;
            minRating = App.Config.player.minRating;
            maxRating = App.Config.player.maxRating;

            if (rating < minRating) {
                this.set({'rating': minRating});
                return "Rating of track must be greater than or equal to " + minRating;
            } else if (rating > maxRating) {
                this.set({'rating': maxRating});
                return "Rating of track must be less than or equal to " + maxRating;
            }
        }
    },

    /**
     * Set default property of model, when initializing an instance of the model
     */
    defaults: {
        url   : null,
        rating: 1
    }
});