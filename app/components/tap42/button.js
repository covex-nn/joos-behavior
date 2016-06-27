var JooS = require("joos-inheritance");
var BehaviorModule = require("~/joos-behavior");
var Behavior = BehaviorModule.Behavior;
var Event = BehaviorModule.BehaviorEvent;

/**
 * @class tap42Button
 * @extends Behavior
 */
var tap42Button = JooS.Reflect(
    Behavior,
    /** @lends tap42Button.prototype */
    {
        onTap: function() {
            var decreaseCounterEvent = new Event("decreaseCounter");

            this.parent.notify(decreaseCounterEvent.getEventData());
        },
        __constructor: function(view) {
            this.__constructor.__parent(view);

            this.nsObject.addEventListener("tap", this.onTap, this);
        },
        __destructor: function() {
            this.nsObject.removeEventListener("tap", this.onTap, this);

            this.__destructor.__parent();
        },
        getParentType: function() {
            return "Container42";
        }
    }
);

exports.Behavior = tap42Button;
