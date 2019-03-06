
const socket = io('http://localhost:3000');

socket.on("server-send-dk-thatbai", function() {
  alert("dang ki that bai");
});

socket.on("server-send-dk-thanhcong", function(data) {
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
});

socket.on("server-send-danhsach", function(data) {
  $("#boxContent").html("");
  data.forEach(function(i) {
      $("#boxContent").append(`<div class='username'></div> ${i}</div>`)
  }) 
})

socket.on("server-send-message", function(data) {
  $("#listMessages").append(`<div class='ms'>${data.us} : ${data.nd}</div>`)
});

socket.on("someone-typing", function(data) {
  $("#thongbao").html(data);
});

socket.on('error', function (error) {
  console.log(error);
});

$(document).ready(function () {
   $("#loginForm").show();
   $("#chatForm").hide();

   $("#btnRegister").click(function() {
     socket.emit("client-send-username", $("#txtUsername").val());
   });

   $("#btnLogout").click(function() {
     socket.emit("logout");
     $("#chatForm").hide(2000);
     $("#loginForm").show(1000);
   });

   $("#send").click(function() {
     socket.emit("user-send-message", $("#txtMessage").val());
   });

   $("#txtMessage").focusin(function() {
     socket.emit("typing");
   });
   $("#txtMessage").focusout(function() {
    socket.emit("stop-typing");
  });
  $("#send").click(function(){
    $("#txtMessage").html("");
  })
 });