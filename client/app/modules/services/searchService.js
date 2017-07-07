(function () {
    'use strict';

    angular.module('tracker').service('searchService', function (
        $http,
        $q,
        $mdToast,
        trackerConfig,
        stateService
    ) {
        return {
            getEvent: function (params) {
                var d = $q.defer();

                $http({
                    method: 'GET',
                    url: trackerConfig.server.url,
                    params: params
                }).then(function (result) {
                    d.resolve(result.data);
                }, function (err) {
                    console.log(err);
                    d.reject(err);
                });

                return d.promise;
            }
        };
    });
})();
