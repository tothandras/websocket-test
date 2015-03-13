(function() {
  var app = angular.module('ws', []);

  app.controller('MainController', function($scope, WebSocketService) {
    self = this;
    this.tick = 0;

    $scope.$on(WebSocketService.tickEvent, function() {
      $scope.$apply(function(){
        self.tick = WebSocketService.getTick();
      });
    });
  });

  app.service('WebSocketService', function($location, $rootScope) {
    var self = this;
    var tick = 0;
    var host = $location.host();
    var port = $location.port();

    var ws = new WebSocket('ws://' + host + ':' + port + '/tick');

    this.tickEvent = 'tickEvent';
    ws.onmessage = function(e) {
      tick = e.data;
      $rootScope.$broadcast(self.tickEvent);
    }

    this.getTick = function() {
      return tick;
    }
  });
})();
