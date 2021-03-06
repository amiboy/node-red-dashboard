module.exports = function(RED) {
    var ui = require('../ui')(RED);
    var tc = require('../dist/js/tinycolor-min');

    function ColourPickerNode(config) {
        RED.nodes.createNode(this, config);
        this.format = config.format;
        this.outformat = config.outformat;
        var node = this;

        var group = RED.nodes.getNode(config.group);
        if (!group) { return; }
        var tab = RED.nodes.getNode(group.config.tab);
        if (!tab) { return; }

        var done = ui.add({
            node: node,
            tab: tab,
            group: group,
            forwardInputMessages: config.passthru,
            control: {
                type: 'colour-picker',
                label: config.label,
                format: config.format,
                showPicker: config.showPicker,
                showSwatch: config.showSwatch,
                showValue: config.showValue,
                showAlpha: config.showAlpha,
                showLightness: config.showLightness,
                order: config.order,
                value: '',
                width: config.width || group.config.width || 6,
                height: config.height || 1
            },
            beforeSend: function (msg) {
                if (node.outformat === 'object') {
                    var pay = tc(msg.payload);
                    if (node.format === 'rgb') { msg.payload = pay.toRgb(); }
                    if (node.format === 'hsl') { msg.payload = pay.toHsl(); }
                    if (node.format === 'hsv') { msg.payload = pay.toHsv(); }
                    if (node.format === 'hex') { msg.payload = pay.toHex(); }
                    if (node.format === 'hex8') { msg.payload = pay.toHex8(); }
                }
                msg.topic = config.topic || msg.topic;
            },
            convert: function(payload) {
                colour = tc(payload);
                return colour.toString(config.format);
            }
        });
        node.on("close", done);
    }
    RED.nodes.registerType("ui_colour_picker", ColourPickerNode);
};
