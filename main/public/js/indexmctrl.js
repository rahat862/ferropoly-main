/**
 *
 * Created by kc on 18.04.15.
 */
'use strict';

moment.locale('de');
var indexControl = angular.module('indexApp', []);
indexControl.controller('indexCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.user = user;
  $scope.gameplays = [];
  var authToken;
  $scope.gameplayToDelete;

  /**
   * Get the auttoken (async!)
   */
  var getAuthToken = function () {
    $http.get('/authtoken').
      success(function (data) {
        authToken = data.authToken;
        console.log('Auth ok');
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.panel = 'error';
        $scope.errorMessage = 'Authentisierungsfehler. Status: ' + status;
      });
  };

  $scope.isGameRunning = function (gp) {
    if (moment(gp.scheduling.gameEndTs).isBefore(moment())) {
      return -1;
    }
    if (moment(gp.scheduling.gameStartTs).isAfter(moment())) {
      return 1;
    }
    // Is running
    return 0;
  };
  // Get Info about Game timings
  $scope.getGpInfo = function (gp) {
    if (moment(gp.scheduling.gameEndTs).isBefore(moment())) {
      return 'Spiel ist ' + moment(gp.scheduling.gameEndTs).fromNow(false) + ' zu Ende gegangen.';
    }
    if (moment(gp.scheduling.gameStartTs).isAfter(moment())) {
      return 'Spiel startet ' + moment(gp.scheduling.gameStartTs).fromNow(false) + '.';
    }
    if (moment().isBetween(moment(gp.scheduling.gameStartTs), moment(gp.scheduling.gameEndTs))) {
      return 'Spiel startete ' + moment(gp.scheduling.gameStartTs).fromNow(false) + '.';
    }
    return ('');
  };

  /**
   * Returns true when the user is the admin. Otherwise he was just added as secondary admin
   * @param gp
   */
  $scope.userIsAdmin = function (gp) {
    return (gp.internal.owner === $scope.user.personalData.email);
  };
  /**
   * Creates organisator information
   */
  $scope.createOrganisatorInfo = function(gp) {
    var retVal = '';

    if(gp.owner && gp.owner.organisatorName) {
      retVal += gp.owner.organisatorName + ' ';
    }
    retVal += gp.internal.owner;
    return retVal;
  };
  // When document ready, load gameplays
  $(document).ready(function () {
    $http.get('/gameplays').
      success(function (data) {
        if (data.success) {
          $scope.gameplays = data.gameplays;
        }
        else {
          $scope.gameplays = [];
        }
        console.log(data);
        console.log('Gameplays loaded, nb:' + $scope.gameplays.length);

        $scope.gameplays.forEach(function (gp) {
          var d = new Date(gp.log.lastEdited);
          console.log(d);
          console.log(gp.log.lastEdited);
        });
        getAuthToken();
      }).
      error(function (data, status) {
        console.log('error:');
        console.log(data);
        console.log(status);
        $scope.gameplays = [];
      });
  });


}]);
