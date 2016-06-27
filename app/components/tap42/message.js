var JooS = require("joos-inheritance");
var Behavior = require("~/joos-behavior").Behavior;

/**
 * @class tap42Message
 * @extends Behavior
 */
var tap42Message = JooS.Reflect(
    Behavior,
    /** @lends tap42Message.prototype */
    {
        refreshText: function(value) {
            var text;
            if (value <= 0) {
                text = "Hoorraaay! You unlocked the NativeScript clicker achievement!";
            } else {
                text = value + " taps left";
            }

            this.nsObject.text = text;
        },
        onCounterValue: function(eventData) {
            this.refreshText(eventData.value);
        },
        onRegistered: function() {
            this.onRegistered.__parent();

            // how to removeEventListener ? =)
            this.parent.addEventListener("counterValue", this.onCounterValue, this);
            // this should be event too...
            this.refreshText(this.parent.counter);
        },
        getParentType: function() {
            return "Container42";
        }
    }
);

exports.Behavior = tap42Message;
