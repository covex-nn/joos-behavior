var JooS = require("joos-inheritance");

/**
 * @class BehaviorEvent
 * @extends JooS.Class
 */
var BehaviorEvent = JooS.Reflect(
    JooS.Class,
    /** @lends BehaviorEvent.prototype */
    {
        /**
         * Constructor
         *
         * @param {String} name Event name
         * @param {*}      data Event data
         * @constructs BehaviorEvent
         */
        __constructor: function(name, data) {
            /** @private */
            this.name = name;
            /** @private */
            this.data = data || { };
        },
        /**
         * Get event name
         *
         * @return {String}
         */
        getName: function() {
            return this.name;
        },
        /**
         * Get event raw data
         *
         * @return {*}
         */
        getData: function() {
            return this.data;
        },
        /**
         * Get event data for Observable
         *
         * @return {Object}
         */
        getEventData: function() {
            var eventData = JooS.Clone(this.data);
            
            eventData.eventName = this.name;

            return eventData;
        }
    }
);

module.exports = BehaviorEvent;
