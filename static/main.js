(function() {
  var app = angular.module('ws', []);

  app.controller('MainController', function($scope, WebSocketService, Tick) {
    self = this;
    this.tick = WebSocketService.getTick();
  });

  app.service('WebSocketService', function($window, $location, $rootScope, Tick) {
    var key = 'i';
    var workerKey = 'w';
    var closingKey = 'c';
    var worker = (localStorage[workerKey] === 'true');

    this.getTick = function() {
      return Tick;
    }

    var openWs = function() {
      var host = $location.host();
      var port = $location.port();
      var ws = new WebSocket('ws://' + host + ':' + port + '/tick');
      localStorage[workerKey] = true;

      ws.onmessage = function(e) {
        $rootScope.$apply(function() {
          Tick.i = e.data;
          localStorage[key] = e.data;
        });
      }

      ws.onclose = function(e) {
        localStorage[closingKey] = true;
      }

      angular.element($window).on('unload', function(e) {
        localStorage.removeItem(workerKey);
        ws.close();
      });
    }

    if (!worker) {
      openWs();
    } else {
      angular.element($window).on('storage', function(e) {
        if (e.key === key) {
          $rootScope.$apply(function() {
            Tick.i = e.newValue;
          });
        } else if (e.key === closingKey) {
          openWs();
        }
      });
    }
  });

  app.factory('Tick', function() {
    var i;
    return {
      i: i
    };
  });
})();
