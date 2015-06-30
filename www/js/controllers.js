angular.module('grupos.controllers', [], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})

.controller('LoginCtrl', function($scope, $state,sharedService) {
  
  $scope.matrimonios = [];
  $scope.solteros = [];
  $scope.bajan_poco = [];
  
  sharedService.matrimonios = $scope.matrimonios;
  sharedService.solteros = $scope.solteros;
  sharedService.ausentes = $scope.bajan_poco;
  
  $scope.login = function(user) {
    sharedService.username = user.username;
    sharedService.codigo = user.username;
    $state.go('tab.hermanos');
  };
  
})

.controller('HermanosCtrl', function ($scope, $http, urls, sharedService, $ionicModal) {

    $scope.sharedService = sharedService;

    $scope.url_matrimonios = urls.server_url + '/matrimonios/' + $scope.sharedService.codigo;
    $scope.url_solteros = urls.server_url + '/solteros/' + $scope.sharedService.codigo;
    $scope.url_ausentes = urls.server_url + '/ausentes/' + $scope.sharedService.codigo;

    $scope.url_hermanos_put = urls.server_url + '/hermanos/put/' + $scope.sharedService.codigo;
    
    $scope.matrimonios = sharedService.matrimonios;
    $scope.solteros = sharedService.solteros;
    $scope.bajan_poco = [];
    $scope.ausentes = sharedService.ausentes;

    $http.get($scope.url_matrimonios).success(function (data) {
        $scope.matrimonios = data;
        sharedService.matrimonios = $scope.matrimonios;
    });

    $http.get($scope.url_solteros).success(function (data) {
        $scope.solteros = data;
        sharedService.solteros = $scope.solteros;
    });

    $http.get($scope.url_ausentes).success(function (data) {
        $scope.ausentes = data;
        sharedService.ausentes = $scope.ausentes;
    });
    
    $scope.numPersonas = function () {
        return 2 * $scope.matrimonios.length + $scope.solteros.length + $scope.bajan_poco.length;
    };

    $scope.showMatrimonioForm = false;
    $scope.matrimonio_nuevo = {};
    $scope.addMatrimonio = function () {
        $http.post($scope.url_matrimonios, {nombre: $scope.matrimonio_nuevo.nombre}).success(function (data) {
            $scope.matrimonio_nuevo = {'id': data.id, 'nombre': data.nombre};
            $scope.matrimonios.push($scope.matrimonio_nuevo);
            $scope.matrimonio_nuevo = {};
        });
    };
    $scope.deleteMatrimonio = function (index) {
        var id = $scope.matrimonios[index].id;
        $http.get($scope.url_matrimonios + '/' + id).success(function (data) {
            $scope.matrimonios.splice(index, 1);
        });
    };

    $scope.showSolteroForm = false;
    $scope.soltero_nuevo = {};
    $scope.addSoltero = function () {
        $http.post($scope.url_solteros, {nombre: $scope.soltero_nuevo.nombre}).success(function (data) {
            $scope.soltero_nuevo = {'id': data.id, 'nombre': data.nombre};
            $scope.solteros.push($scope.soltero_nuevo);
            $scope.soltero_nuevo = {};
        });
    };
//    $scope.deleteSoltero = function (index) {
//        var id = $scope.solteros[index].id;
//        $http.get($scope.url_solteros + '/' + id).success(function (data) {
//            $scope.solteros.splice(index, 1);
//        });
//    };

    $scope.updateSoltero = function () {
        var id = $scope.soltero_edit.id;
        var index = $scope.soltero_edit.index;
        $http.post($scope.url_hermanos_put + '/' + id, {nombre: $scope.soltero_edit.nombre}).success(function (data) {
            $scope.solteros[index].nombre = $scope.soltero_edit.nombre;
            $scope.closeModalSoltero();
            $scope.soltero_edit = {};
        });
    };

    $scope.deleteSoltero = function () {
        var id = $scope.soltero_edit.id;
        var index = $scope.soltero_edit.index;
        $http.get($scope.url_solteros + '/' + id).success(function (data) {
            $scope.solteros.splice(index, 1);
            $scope.closeModalSoltero();
            $scope.soltero_edit = {};
        });
    };

    $scope.ausentarMatrimonio = function (index) {
        var id = $scope.matrimonios[index].id;
        $http.post($scope.url_hermanos_put + '/' + id, {ausente: 1}).success(function (data) {
            $scope.ausentes.push($scope.matrimonios[index]);
            $scope.matrimonios.splice(index, 1);
        });
    };
    $scope.ausentarSoltero = function (index) {
        var id = $scope.solteros[index].id;
        $http.post($scope.url_hermanos_put + '/' + id, {ausente: 1}).success(function (data) {
            $scope.ausentes.push($scope.solteros[index]);
            $scope.solteros.splice(index, 1);
        });
    };
    $scope.desAusentar = function (index) {
        var id = $scope.ausentes[index].id;
        $http.post($scope.url_hermanos_put + '/' + id, {ausente: 0}).success(function (data) {
            if (data.tipo === 'matrimonio') {
                $scope.matrimonios.push($scope.ausentes[index]);
            } else if (data.tipo === 'soltero') {
                $scope.solteros.push($scope.ausentes[index]);
            }
            $scope.ausentes.splice(index, 1);
        });
    };

    $scope.deleteAusente = function (index) {
        var id = $scope.ausentes[index].id;
        $http.get($scope.url_ausentes + '/' + id).success(function (data) {
            $scope.ausentes.splice(index, 1);
        });
    };
    
    $ionicModal.fromTemplateUrl('editar-hermano.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModalSoltero = function(index) {
        $scope.soltero_edit = $scope.solteros[index];
        $scope.soltero_edit.index = index;
        $scope.modal.show();
    };
    $scope.closeModalSoltero = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

})

.controller('GruposCtrl', function ($scope, $http, sharedService) {
    
    $scope.matrimonios = sharedService.matrimonios;
    $scope.solteros = sharedService.solteros;
    $scope.bajan_poco = [];
    $scope.ausentes = sharedService.ausentes;

    $scope.numPersonas = function () {
        return 2 * $scope.matrimonios.length + $scope.solteros.length + $scope.bajan_poco.length;
    };

    $scope.Math = window.Math;
    //$scope.num_personas_grupo = Math.floor($scope.num_personas / $scope.num_grupos);
    $scope.grupos = [];

    $scope.num_grupos = "6";
    $scope.hacerGrupos = function () {

        var num_grupos = $scope.num_grupos;
        var num_personas = $scope.numPersonas();
        var num_personas_grupo = Math.floor(num_personas / $scope.num_grupos);
        var matrimonios = $scope.matrimonios;
        var solteros = $scope.solteros;
        var bajan_poco = $scope.bajan_poco;

        var contador_personas_grupo = new Array();

        //Creamos num_grupos todavía sin personas
        var grupos = new Array();
        for (g = 0; g < num_grupos; g++)
        {
            grupos.push(new Array());
            contador_personas_grupo[g] = 0;
        }

        //Metemos los matrimonios en los grupos que salgan al azar.
        for (m = 0; m < matrimonios.length; m++)
        {
            var num_grupo = parseInt(Math.random() * num_grupos);
            grupos[num_grupo].push(matrimonios[m]);
            contador_personas_grupo[num_grupo] += 2;
        }

        //Vamos rellenando los grupos con hermanos solteros al azar
        var copia_solteros = solteros.slice();
        var copia_bajan_poco = bajan_poco.slice();
        var barajados = false;
        for (g = 0; g < num_grupos; g++)
        {
            for (p = contador_personas_grupo[g]; p < num_personas_grupo; p++)
            {
                s = parseInt(Math.random() * copia_solteros.length);
                grupos[g].push(copia_solteros[s]);
                copia_solteros.splice(s, 1); //Elimina al hermano de la lista
                contador_personas_grupo[g] += 1;
                if (copia_solteros.length == 0)
                {
                    copia_solteros = copia_bajan_poco;
                    for (gaux = 0; gaux < num_grupos; gaux++)
                    {
                        grupos[gaux] = shuffle(grupos[gaux]);
                    }
                    barajados = true;
                }
            }

        }

        //Los grupos ya están completos pero a lo mejor quedan hermanos sin grupo 
        if (copia_solteros.length == 0)
        {
            copia_solteros = copia_bajan_poco;
            if (!barajados)
                for (gaux = 0; gaux < num_grupos; gaux++)
                {
                    grupos[gaux] = shuffle(grupos[gaux]);
                }
            barajados = true;
        }

        while (copia_solteros.length > 0)
        {
            g = parseInt(Math.random() * num_grupos);
            if (contador_personas_grupo[g] == num_personas_grupo)
            {
                grupos[g].push(copia_solteros[0]);
                copia_solteros.splice(0, 1);
                contador_personas_grupo[g] += 1;
                if (copia_solteros.length == 0)
                {
                    copia_solteros = copia_bajan_poco;
                    if (!barajados)
                        for (gaux = 0; gaux < num_grupos; gaux++)
                        {
                            grupos[gaux] = shuffle(grupos[gaux]);
                        }
                    barajados = true;
                }
            }
        }
        $scope.grupos = grupos;
    };
    
    $scope.compartir = function(){
        
        var mensaje = '';
        for(g = 0; g < $scope.grupos.length; g++) {
            mensaje += "Grupo " + (g+1) + "\n";
            for(h = 0; h < $scope.grupos[g].length; h++) {
                mensaje += $scope.grupos[g][h].nombre + "\n";
            }
            mensaje += "\n";
        }
        window.plugins.socialsharing.share(mensaje);
    };
})

.controller('CalendarioCtrl', function ($scope, $cordovaOauth, $cordovaCalendar) {
    $scope.googleLogin = function() {
        $cordovaOauth.google("90254966777-hkt3dmvd5snkp2botc5e8d32ubsru9jf.apps.googleusercontent.com", ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            console.log(JSON.stringify(result));
        }, function(error) {
            console.log(error);
        });
    };
    
    $scope.events = [];
    
    $cordovaCalendar.listCalendars().then(function (result) {
        console.log(JSON.stringify(result));
    }, function (error) {
        console.log(error);
    });
    
    //Este método no está disponible en Android
//    $cordovaCalendar.findAllEventsInNamedCalendar('Carlos Herrera Conejero').then(function (result) {
//        console.log(JSON.stringify(result));
//    }, function (error) {
//        console.log(error);
//    });
    
    //Este método no está disponible en iOS
    $cordovaCalendar.listEventsInRange(
        new Date(),
        new Date(2015, 9, 6)
    ).then(function (result) {
        console.log(JSON.stringify(result));
        $scope.events = result;
    }, function (error) {
        console.log(error);
    });

});


function shuffle(v) {
    for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x)
        ;
    return v;
}