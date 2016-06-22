var JooS = require("joos-inheritance");
var Behavior = require("~/joos-behavior/main").Behavior;
var Page = require("~/joos-behavior/page").Behavior;

/**
 * @class Layout
 * @extends Behavior
 */
var Layout = JooS.Reflect(
    Behavior,
    /** @lends Layout.prototype */
    {
        __constructor: function(nsObject) {
            this.__constructor.__parent(nsObject);
        },
        onLoadedChild: function(eventData) {
            this.onLoadedChild.__parent(eventData);

            // console.log("Layout children after LoadedChild: " + this.children.length);
        },
        onUnloadedChild: function(eventData) {
            this.onUnloadedChild.__parent(eventData);

            // console.log("Layout children after UnloadedChild: " + this.children.length);
        },
        getParentClass: function() {
            return Page;
        }
    }
);

exports.Behavior = Layout;
