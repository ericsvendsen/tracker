(function () {
    'use strict';

    angular.module('tracker').service('stateService', function (
        $location,
        $timeout,
        $mdToast,
        trackerConfig
    ) {
        var queryString = $location.search();

        return {};
    });
})();
