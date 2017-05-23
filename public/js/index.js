$(document).ready(function(){

  var user = JSON.parse(localStorage.getItem("USER"));
  if(user){
    $("#welcome em").text(user.name);
    $("ul li#after_sign").css("display","inline-block");
    $("#signInBtn").css("display","none");
  }

  // phone screen menu
  $("#burgerBtn").click(function(){
    if($("#menu:visible").length==0){
      $("#menu").show();
    }else{
      $("#menu").hide();
    }
  })

  // sign in
  $("#submitSign").click(function(){
          var inputEmail= $("input[name='email']").val();
          var inputPwd = $("input[name='password']").val();
          if(inputEmail&&inputPwd){
            $.post("/api/users/email",{email:inputEmail, password: inputPwd},function(result, status){
              if(result.length==0){
                $("#inputWrongHint").show().fadeOut( 5000 );
              }else{
                $("#myModal").modal("hide");
                if(!$("input[name='remember']").prop("checked")){
                  $("input[name='email']").val("");
                  $("input[name='password']").val("");
                }
                $("ul li#after_sign").css("display","inline-block");
                $("#signInBtn").css("display","none");
                $("#welcome em").text(result[0].name);
                localStorage.setItem("USER",JSON.stringify(result[0]));
              }
            });
          }else{
            if(inputEmail==""){
              $("#noEmailHint").show().fadeOut( 5000 );
            }
            if(inputPwd==""){
              $("#noPwdHint").show().fadeOut( 5000 );
            }
          }
  });

  // sign out
  $("#signOutBtn").click(function(){
    var r = confirm("You Want To Sign Out?");
    if(r==true){
      $("ul li#after_sign").css("display","none");
      $("#signInBtn").css("display","inline-block");
      localStorage.removeItem("USER");
      localStorage.removeItem("USERRECORDS");
      localStorage.removeItem("DEPTRECORDS");
    }
  });

});
