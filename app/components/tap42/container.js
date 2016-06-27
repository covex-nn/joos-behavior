var JooS = require("joos-inheritance");
var BehaviorModule = require("~/joos-behavior");
var Behavior = BehaviorModule.Behavior;
var Event = BehaviorModule.BehaviorEvent;

/**
 * @class tap42Container
 * @extends Behavior
 */
var tap42Container = JooS.Reflect(
    Behavior,
    /** @lends tap42Container.prototype */
    {
        onDecreaseCounter: function(eventData) {
            if (this.counter > 0) {
                this.counter--;

                var counterValueEvent = new Event("counterValue", {
                    value: this.counter
                });

                this.notify(counterValueEvent.getEventData());
            }
        },
        __constructor: function(view) {
            this.__constructor.__parent(view);

            this.counter = 42;
            this.addEventListener("decreaseCounter", this.onDecreaseCounter, this);
        },
        __destructor: function() {
            this.removeEventListener("decreaseCounter", this.onDecreaseCounter, this);

            this.__destructor.__parent();
        },
        getType: function() {
            return "Container42";
        }
    }
);

exports.Behavior = tap42Container;
