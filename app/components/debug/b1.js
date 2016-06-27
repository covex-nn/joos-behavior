var JooS = require("joos-inheritance");
var b0 = require("./b0").Behavior;

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
            this.name = "~/components/debug/b1";

            this.nsObject.addEventListener("tap", this.onTap, this);
        },
        __destructor: function() {
            this.nsObject.removeEventListener("tap", this.onTap, this);

            this.__destructor.__parent();
        }
    }
);

exports.Behavior = b1;
