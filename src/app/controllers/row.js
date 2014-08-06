define([
  'angular',
  'app',
  'lodash'
],
function (angular, app, _) {
  'use strict';

  var module = angular.module('kibana.controllers');

  module.controller('RowCtrl', function($scope, $rootScope, $timeout, $routeParams, $modal, $q, ejsResource, querySrv, alertSrv) {
      var _d = {
        title: "Row",
        height: "150px",
        collapse: false,
        collapsable: true,
        editable: true,
        panels: [],
        notice: false
      };

      _.defaults($scope.row,_d);

      $scope.embed = {
          row_id: $routeParams.row_id,
          pannel_name: $routeParams.pannel_name,
          navbar: $routeParams.navbar,
          legend: $routeParams.legend
      };

      if (angular.isDefined($scope.embed.navbar) && $scope.embed.navbar == "false")
          $(".navbar").hide();

      if (angular.isDefined($scope.embed.legend) && $scope.embed.legend == "false")
          $timeout(function () { $(".terms-legend, .histogram-legend, span[ng-show='panel.legend']").hide(); }, 500);

      $scope.isRowEmbed = function(idx) {
          if (angular.isUndefined($scope.embed.row_id))
              return true;

          return (idx == $scope.embed.row_id);
      };

      $scope.isPannelEmbed = function(name) {
          if (angular.isUndefined($scope.embed.pannel_name))
              return true;

          return (name == $scope.embed.pannel_name);
      };

      $scope.init = function() {
        $scope.querySrv = querySrv;
        $scope.reset_panel();
      };

      $scope.toggle_row = function(row) {
        if(!row.collapsable) {
          return;
        }
        row.collapse = row.collapse ? false : true;
        if (!row.collapse) {
          $timeout(function() {
            $scope.$broadcast('render');
          });
        } else {
          row.notice = false;
        }
      };

      $scope.rowSpan = function(row) {
        var panels = _.filter(row.panels, function(p) {
          return $scope.isPanel(p);
        });
        return _.reduce(_.pluck(panels,'span'), function(p,v) {
          return p+v;
        },0);
      };

      // This can be overridden by individual panels
      $scope.close_edit = function() {
        $scope.$broadcast('render');
      };

      $scope.add_panel = function(row,panel) {
        $scope.row.panels.push(panel);
      };

      $scope.duplicate_panel = function(panel) {
        var clone = angular.copy(panel);
        $scope.row.panels.push(clone);
      };

      $scope.embed_panel = function(panel) {
          $scope.current_panel = panel.title;
          $scope.embed_width = 300;
          $scope.embed_height = 150;
          var modalPromise = $modal({template: 'app/partials/embed_modal.html', persist: true, show: false, backdrop: 'static', scope: $scope});

          $q.when(modalPromise).then(function(modalEl) {
              modalEl.modal('show');
          });
      };

      // $scope.embed_modal = {
      //     title: "Embed",
      //     content:
      // };

      /** @scratch /panels/0
       * [[panels]]
       * = Panels
       *
       * [partintro]
       * --
       * *Kibana* dashboards are made up of blocks called +panels+. Panels are organized into rows
       * and can serve many purposes, though most are designed to provide the results of a query or
       * multiple queries as a visualization. Other panels may show collections of documents or
       * allow you to insert instructions for your users.
       *
       * Panels can be configured easily via the Kibana web interface. For more advanced usage, such
       * as templated or scripted dashboards, documentation of panel properties is available in this
       * section. You may find settings here which are not exposed via the web interface.
       *
       * Each panel type has its own properties, hover there are several that are shared.
       *
      */

      $scope.reset_panel = function(type) {
        var
          defaultSpan = 4,
          _as = 12-$scope.rowSpan($scope.row);

        $scope.panel = {
          error   : false,
          /** @scratch /panels/1
           * span:: A number, 1-12, that describes the width of the panel.
           */
          span    : _as < defaultSpan && _as > 0 ? _as : defaultSpan,
          /** @scratch /panels/1
           * editable:: Enable or disable the edit button the the panel
           */
          editable: true,
          /** @scratch /panels/1
           * type:: The type of panel this object contains. Each panel type will require additional
           * properties. See the panel types list to the right.
           */
          type    : type
        };
      };

      /** @scratch /panels/2
       * --
       */

      $scope.init();

    }
  );

});
