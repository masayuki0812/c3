import { Chart } from './core';

Chart.prototype.load = function (args) {
    var $$ = this.internal, config = $$.config;
    // update xs if specified
    if (args.xs) {
        $$.addXs(args.xs);
    }
    // update names if exists
    if ('names' in args) {
        Chart.prototype.data.names.bind(this)(args.names);
    }
    // update classes if exists
    if ('classes' in args) {
        Object.keys(args.classes).forEach(function (id) {
            config.data_classes[id] = args.classes[id];
        });
    }
    // update categories if exists
    if ('categories' in args && $$.isCategorized()) {
        config.axis_x_categories = args.categories;
    }
    // update axis if exists
    if ('axis' in args) {
        // update axis values if exists
        if ('values' in args.axis) {
            if ('x' in args.axis.values) {
                config.axis_x_tick_values = args.axis.values.x;
            }

            if ('y' in args.axis.values) {
                config.axis_y_tick_values = args.axis.values.y;
            }

            if ('y2' in args.axis.values) {
                config.axis_y2_tick_values = args.axis.values.y2;
            }
        }
    }
    // update axes if exists
    if ('axes' in args) {
        Object.keys(args.axes).forEach(function (id) {
            config.data_axes[id] = args.axes[id];
        });
    }
    // update colors if exists
    if ('colors' in args) {
        Object.keys(args.colors).forEach(function (id) {
            config.data_colors[id] = args.colors[id];
        });
    }
    // use cache if exists
    if ('cacheIds' in args && $$.hasCaches(args.cacheIds)) {
        $$.load($$.getCaches(args.cacheIds), args.done);
        return;
    }
    // unload if needed
    if (args.unload) {
        // TODO: do not unload if target will load (included in url/rows/columns)
        $$.unload($$.mapToTargetIds(args.unload === true ? null : args.unload), function () {
            $$.loadFromArgs(args);
        });
    } else {
        $$.loadFromArgs(args);
    }
};

Chart.prototype.unload = function (args) {
    var $$ = this.internal;
    args = args || {};
    if (args instanceof Array) {
        args = {ids: args};
    } else if (typeof args === 'string') {
        args = {ids: [args]};
    }
    $$.unload($$.mapToTargetIds(args.ids), function () {
        $$.redraw({withUpdateOrgXDomain: true, withUpdateXDomain: true, withLegend: true});
        if (args.done) { args.done(); }
    });
};
