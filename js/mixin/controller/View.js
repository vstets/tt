/**
 * This mixin is created only for App.controller.base.Controller class. It adds
 * view related logic into the controller. So, after that you may control views
 * and its nested views also. Use view config to set related view. It will be
 * created during controller constructing. Use noView config, if you want to
 * point that current controller shouldn't create and destroy views. In general,
 * noView config is needed for all nested controllers. Main controller has
 * noView config set to false.
 *
 * Usage:
 *
 *     N13.define('App.controller.MyController', {
 *         extend  : 'App.controller.base.Controller',
 *         mixins  : {view: 'App.mixin.controller.View'},
 *         requires: ['App.view.my.MainView'],
 *         configs : {
 *             view  : 'my.MainView',
 *             viewNs: 'App.view'
 *         }
 *     });
 *
 *     var ctrl    = new App.controller.MyController(...);
 *     var subView = ctrl.findView('my.MainView > my.SubView');
 *
 * @author DeadbraiN
 */
N13.define('App.mixin.controller.View', {
    configs : {
        /**
         * {String} Prefix namespace of the view, according to the view folder. For
         * example: 'App.view'. Should be set without dot at the end. Should be
         * 'App.view' by default.
         */
        viewNs: 'App.view',
        /**
         * {String|Object|Backbone.View} The name of the view or configuration
         * object, which will be controlled by this controller. e.g.:
         * 'libraryNavigator.View' or {cl: 'libraryNavigator.View', title: 'Yahoo!'}.
         * Should be null by default
         */
        view  : null,
        /**
         * {Boolean} true means that this controller shouldn't create and destroy views, which
         * were set in view config. /it may only listen them events and call different methods.
         */
        noView: true
    },


    /**
     * @constructor
     * Creates view instance and all nested views also
     */
    init: function () {
        var cfg  = {};
        var view;
        var View;


        /**
         * {RegEx} String left+right trimming regular expression.
         */
        this._trimRe         = /^\s+|\s+$/g;
        /**
         * {RegEx} One views query node format. For example: 'view1 > view2[2] > view3#id-12'
         */
        this._queryNodeRe    = /^([a-zA-Z0-9.]+)((\[([0-9]+)\])|(#([a-zA-Z0-9\-]+)))?$/;
        /**
         * {Object} Map of the view instances for current controller. Is used in findView() method.
         */
        this._viewCache      = {};

        //
        // view parameter must be set from outside by setConfig({view: App.view.ase.View})
        //
        if (this.noView) {
            return;
        }
        /**
         * @type {{cl: String}|String} The string class name or it's configuration
         */
        view = this.view;
        if (N13.isString(view)) {
            View = N13.ns(this.viewNs + '.' + view, false);
        } else if (N13.isObject(view) && N13.isString(view.cl)) {
            View = N13.ns(this.viewNs + '.' + view.cl, false);
            cfg  = view;
        }

        if (View) {
            this.view = new View(cfg);
        }
    },

    /**
     * Destroys a view related logic from the controller. This is an analog of a destructor.
     * In case of noView configuration parameter is set to true, then destroy will be skipped.
     */
    destroy: function () {
        if (!this.view instanceof Backbone.View || this.noView) {
            return;
        }

        this.view.destroy();
        this.view = null;
    },

    /**
     * Finds view by query. Query is a string in format: 'view1 [> view2 [> view3 ...]]'
     * > symbol means embedded or nested view. For example query: 'view1 > view2' means
     * view2 inside view1. Symbol > means not only one view inside other, it also means
     * that one view inside other, inside other and so on. For example, if we have views:
     * 'view1 > view2 > view3'. We may create a query in different ways: 'view1 > view3'
     * or 'view1 > view2 > view3' or 'view1 > view2'. First and second queries are similar
     * in case if there is only one view3 inside the view2.
     * @param {String} query
     * @param {Boolean} skipCache true will skip cache and try to find view in views hierarchy,
     * false or undefined will check if only this related controller's cache has this instance
     * by current query
     * @return {Array} Array of App.view.base.View instances or empty array
     */
    findView: function (query, skipCache) {
        var queryArr;
        var me = this;
        var view;

        //
        // view and query must be set correctly
        //
        if (!me.view || !N13.isString(query) || query === '') {
            return null;
        }
        //
        // Tries to find view by query in this controller cache
        //
        if (!skipCache && this._viewCache[query]) {
            return this._viewCache[query];
        }

        queryArr = _.map(query.split('>'), function (q) {
            var parts = me._queryNodeRe.exec(q.replace(me._trimRe, ''));

            if (!parts) {
                return {index: 0};
            }
            //
            // For example query: 'view1[1] > view2#myId' has these parts:
            // 'view1', 'view2' - alias
            // 1                - index
            // 'myId'           - id
            //
            return {
                alias: parts[1],
                index: +parts[4],
                id   : parts[6]
            };
        });

        view = me._findView(queryArr, [me.view]);
        //
        // Saves found view instance to the controller cache
        //
        if (view) {
            this._viewCache[query] = view;
        }

        return view;
    },


    /**
     * Recursive view finder. It walks thought views hierarchy and try to find
     * view by query array. It can find only one view. So, it returns first
     * found view and stops after that. See public findView() for details.
     * @param {Array} query Array of nested views from left to right.
     * @param {Array} views Array of nested views on current view
     * @returns {App.view.base.View|null}
     * @private
     */
    _findView: function (query, views) {
        //
        // As you remember, we have App.util.trim() method for trimming, but here we shouldn't use
        // it, because of additional dependency. All base classes should have as minimum dependencies
        // as possible. It's important if we are speaking about loose coupling.
        //
        var viewAlias  = query[0] || null;
        var classNsLen = this.viewNs.length + 1;
        var view;
        var index;
        var i;
        var len;
        var id;

        if (viewAlias.alias && views) {
            for (i = 0, len = views.length; i < len; i++) {
                view  = views[i];
                id    = viewAlias.id    || view.id;
                index = viewAlias.index || i;
                //
                // 'App.view.my.Widget' -> 'my.Widget'
                //
                if (view.className.substr(classNsLen) === viewAlias.alias && view.id === id && i === index) {
                    query.shift();
                    if (!query.length) {
                        return view;
                    }
                }
                //
                // HACK: query.concat() without arguments, creates array copy. We need a copy every
                // HACK: time we appear inside this method
                //
                if ((view = this._findView(query.concat(), view.items))) {
                    return view;
                }
            }
        }

        return null;
    }
});