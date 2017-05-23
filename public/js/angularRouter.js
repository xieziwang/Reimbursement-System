
var app = angular.module("myApp",["ngRoute"]);

// get signed current user
app.factory("user", function(){
  var user = JSON.parse(localStorage.getItem("USER"));
  return user;
});

// check the passwords
app.directive("pwCheck", [function(){
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      elem.add(firstPassword).on('keyup', function () {
        scope.$apply(function () {
          var v = elem.val()===$(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  }
}]);

// create pie chart
app.directive("pieChart", function(){
  return {
    restrict:"E",
    template:'<div id="pieChart"></div>',
    replace:true,
    scope:{
      data:"="
    },
    link:function(scope, element){
      Highcharts.chart(element[0],{
          chart: {
              type: 'pie'
          },
          credits:false,
          title: {
              text: 'Your Reimbursement Categories',
              style: {
                color:"#e67e22"
              }
          },
          tooltip: {
              pointFormat: '<b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: false
                  },
                  showInLegend: true
              }
          },
          series: [{
              colorByPoint: true,
              data: scope.data
          }]
      });
    }
  }
});

app.controller("mainCtr", function($scope,$route,$http,user){
  $scope.$route = $route;

  // retrieve records of this user
  $http.post("/api/users/records/email",{email:user.email})
  .then(function(res){
    $scope.records = res.data;
  });
});

// user profile controller
app.controller("userCtr", function($scope, $http, user){
  $scope.user = user;
  $scope.name =user.name;
  $scope.email = user.email;
  $scope.phone = user.phone;
  $scope.isManager = user.isManager;
  $scope.password = user.password;
  $scope.noMatchHint=false;

  // modify user profile
  $scope.submitModify = function(){
    if($scope.password!== $scope.passwordRe){
      $scope.noMatchHint=true;
    }else {
      $scope.noMatchHint=false;
      $scope.modify=false;
      $scope.userModified = {id: user._id, name: $scope.name, email: $scope.email, phone:$scope.phone, password: $scope.password, isManager:false};
      $http.post("/api/users", $scope.userModified)
      .then(function(res){
        $scope.user = res.data;
        $scope.passwordRe="";
      });
    }
  };

  $scope.records = $scope.$parent.records;
  $scope.hotel=$scope.transportation=$scope.food=$scope.other=$scope.total=0;
  angular.forEach($scope.records, function(record){
    switch(record.category){
      case "hotel":
        $scope.hotel += record.price;
        $scope.total += record.price;
        break;
      case "transportation":
        $scope.transportation += record.price;
        $scope.total += record.price;
        break;
      case "food":
        $scope.food += record.price;
        $scope.total += record.price;
        break;
      default:
        $scope.other += record.price;
        $scope.total += record.price;
        break;
    }
  });

  // data for pie chart
  $scope.pieData = [{
      name: 'Hotel',
      y: ($scope.total==0)?0:$scope.hotel/$scope.total
  }, {
      name: 'Transportation',
      y: ($scope.total==0)?0:$scope.transportation/$scope.total
  }, {
      name: 'Food',
      y: ($scope.total==0)?0:$scope.food/$scope.total
  }, {
      name: 'Other',
      y: ($scope.total==0)?0:$scope.other/$scope.total
  }];

});


// user records controller
app.controller("recordsCtr", function($scope, $http, user){

  $scope.records = $scope.$parent.records;
  // delete a record
  $scope.delete = function(record){
    var r = confirm("Delete This Record?");
    if(r){
      $http.delete("/api/records/"+record._id)
      .then(function(res){
        if(res.data.email){
          alert("Succeed to delete!");
          var index = $scope.records.indexOf(record);
          $scope.records.splice(index,1);
        }else{
          alert("Failed to delete!");
        }
      });
    }
  }

// submit a new request
  $scope.submitNew = function(){
   $scope.newRecord = {email: user.email,
     name: user.name,
      category: $scope.category,
      date: $scope.date,
      address: $scope.location,
      price: $scope.price,
      isDone: false};
    $http.post("/api/users/records",$scope.newRecord)
    .then(function(res){
      if(res){
        alert("Succeed to create a new request!");
        $scope.$parent.records.push(res.data);
        $scope.date="";
        $scope.category="";
        $scope.location="";
        $scope.price="";
        $scope.newRecord=false;
      }else{
        alert("Failed to create!");
      }
    });
  }
});

// department records controller
app.controller("deptCtr", function($scope, $http, user){
  // angular.forEach($scope.$parent.records,function(value){
  //   console.log(value);
  // });

  if(user.isManager){
    $http.post("/api/users/records/non-manager",{email:user.email})
    .then(function(res){
      $scope.deptRecords = res.data;
    });

    // delete a request
    $scope.delete = function(record){
      var r = confirm("Delete This Record?");
      if(r){
        $http.delete("/api/records/"+record._id)
        .then(function(res){
          if(res.data.email){
            alert("Succeed to delete!");
            var index = $scope.deptRecords.indexOf(record);
            $scope.deptRecords.splice(index,1);
          }else{
            alert("Failed to delete!");
          }
        });
      }
    }

    // aprove a request
    $scope.approve = function(record){
      $http.post("/api/users/records",{id:record._id})
      .then(function(res){
        if(res.data){
          record.isDone = true;
        }
      });
    }
  }
});

// route config
app.config(function($routeProvider){
  $routeProvider
    .when("/user",{
      templateUrl:"./templates/user.html",
      controller:"userCtr",
      activetab: 'user'
    })
    .when("/records",{
      templateUrl:"./templates/records.html",
      controller:"recordsCtr",
      activetab: 'records'
    })
    .when("/deptRecords",{
      templateUrl:"./templates/dept.html",
      controller:"deptCtr",
      activetab: 'deptRecords'
    })
    .otherwise({
      templateUrl:"./templates/user.html",
      controller:"userCtr",
      activetab: 'user'
    })
})
