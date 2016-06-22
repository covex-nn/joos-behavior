var JooS = require("joos-inheritance");
var b0 = require("~/shared/b0").Behavior;

/**
 * @class b1
 * @extends b0
 */
var b1 = JooS.Reflect(
    b0,
    /** @lends b1.prototype */
    {
        __constructor: function(view) {
            this.__constructor.__parent(view);
            this.name = "~/shared/b1";
        }
    }
);

exports.Behavior = b1;
