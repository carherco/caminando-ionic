// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'grupos.controllers', 'grupos.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('server_url', 'http://carherco.es/caminando-api/web')

.service('urls',function(server_url){ this.server_url = server_url;})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('signin', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })
    
    
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.hermanos', {
    url: '/hermanos',
    views: {
      'tab-hermanos': {
        templateUrl: 'templates/tab-hermanos.html',
        controller: 'HermanosCtrl'
      }
    }
  })

  .state('tab.grupos', {
      url: '/grupos',
      views: {
        'tab-grupos': {
          templateUrl: 'templates/tab-grupos.html',
          controller: 'GruposCtrl'
        }
      }
    })
    

  .state('tab.calendario', {
    url: '/calendario',                                                         
    views: {                                                                    
      'tab-calendario': {                                                           
        templateUrl: 'templates/tab-calendario.html',                           
        controller: 'CalendarioCtrl'
      }                                                                         
    }                                                                           
  });  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});