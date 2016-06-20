var JooS = require("joos-inheritance");
var b0 = require("~/shared/b0").Behavior;

/**
 * @class b2
 * @extends b0
 */
var b2 = JooS.Reflect(
    b0,
    /** @lends b2.prototype */
    {
        __constructor: function(view) {
            this.__constructor.__parent(view);
            this.name = "b2";
        }
    }
);

exports.Behavior = b2;
