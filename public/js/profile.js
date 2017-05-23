$(document).ready(function(){
    // get localStorage data
    var user = JSON.parse(localStorage.getItem("USER"));
    // var userRecords = JSON.parse(localStorage.getItem("USERRECORDS"));
    // var deptRecords = JSON.parse(localStorage.getItem("DEPTRECORDS"));
    // console.log(userRecords+","+deptRecords);
    $("#welcome em").text(user.name);

    // adjust layout
    $("ul li#after_sign").css("display","inline-block");
    if(!user.isManager){
      $("#dept_records").hide();
    }else{
      $("#dept_records").show();
      // $.get("/api/users/records/non-approved",function(result){
      //
      //   localStorage.setItem("USERRECORDS",JSON.stringify(userRecords));
      //   console.log(JSON.parse(localStorage.getItem("USERRECORDS")).data);
      // });
    }

    // sign out
    $("#signOutBtn").click(function(){
      var r = confirm("You Want To Sign Out?");
      if(r==true){
        localStorage.removeItem("USER");
        localStorage.removeItem("USERRECORDS");
        localStorage.removeItem("DEPTRECORDS");
        window.location.replace("./index.html");
      }
    });

    // phone screen menu
    $("#burgerBtn").click(function(){
      if($("#menu:visible").length==0){
        $("#menu").show();
      }else{
        $("#menu").hide();
      }
    });

    // draw user records pie chart
    // Highcharts.chart("pieChart",{
    //     chart: {
    //         plotBackgroundColor: null,
    //         plotBorderWidth: null,
    //         plotShadow: false,
    //         type: 'pie'
    //     },
    //     title: {
    //         text: 'Browser market shares January, 2015 to May, 2015'
    //     },
    //     tooltip: {
    //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    //     },
    //     plotOptions: {
    //         pie: {
    //             allowPointSelect: true,
    //             cursor: 'pointer',
    //             dataLabels: {
    //                 enabled: false
    //             },
    //             showInLegend: true
    //         }
    //     },
    //     series: [{
    //         name: 'Brands',
    //         colorByPoint: true,
    //         data: [{
    //             name: 'Microsoft Internet Explorer',
    //             y: 56.33
    //         }, {
    //             name: 'Chrome',
    //             y: 24.03,
    //             sliced: true,
    //             selected: true
    //         }, {
    //             name: 'Firefox',
    //             y: 10.38
    //         }, {
    //             name: 'Safari',
    //             y: 4.77
    //         }, {
    //             name: 'Opera',
    //             y: 0.91
    //         }, {
    //             name: 'Proprietary or Undetectable',
    //             y: 0.2
    //         }]
    //     }]
    // });


});
