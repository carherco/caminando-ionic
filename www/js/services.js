angular.module('grupos.services', [])
    .factory('sharedService', function () {
        return shared = {
            "matrimonios": [],
            "solteros": [],
            "ausentes": []
        };
    });


