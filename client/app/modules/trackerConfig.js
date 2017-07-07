(function () {
    'use strict';

    angular.module('tracker').service('trackerConfig', function (trackerConfigLocal) {
        var cfg = {
            title: 'Tracker',
            logo: ''
        };

        // recursively merge the local config onto the default config
        angular.merge(cfg, trackerConfigLocal);

        return cfg;
    });
})();
