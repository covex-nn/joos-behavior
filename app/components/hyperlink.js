var JooS = require("joos-inheritance");
var Behavior = require("~/joos-behavior").Behavior;
var frame = require("ui/frame");

/**
 * @class Hyperlink
 * @extends Behavior
 */
var Hyperlink = JooS.Reflect(
    Behavior,
    /** @lends Hyperlink.prototype */
    {
        onTap: function() {
            var href = this.nsObject["data-href"];

            if (href) {
                frame.topmost().navigate({
                    moduleName: href,
                    clearHistory: true // ???
                });
            }
        },
        __constructor: function(view) {
            this.__constructor.__parent(view);

            this.nsObject.addEventListener("tap", this.onTap, this);
        },
        __destructor: function() {
            this.nsObject.removeEventListener("tap", this.onTap, this);

            this.__destructor.__parent();
        }
    }
);

exports.Behavior = Hyperlink;
