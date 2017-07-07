angular.module('app.game', [])
.config(function($stateProvider) {
  // Define routes in here
  $stateProvider
    .state('game', {
      url: '/game',
      template: '<div>\
          <div id="gameCanvas"></div>\
        </div>',
      controller: 'GameController'
    });  
})


.directive('gameCanvas', function($injector) {
  var linkFn = function(scope, ele, attrs) {
    // link Function
    createGame(scope, scope.players, scope.mapId, $injector);
  };
 
  return {
    scope: {
      players: '=',
      mapId: '='
    },
    template: '<div id="gameCanvas"></div>',
    link: linkFn
  }
});