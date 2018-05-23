$(".modal img").css("max-height",window.innerHeight-150);
$(".modal img").css("max-width",window.innerWidth-250);
$(window).resize(function(){
  $(".modal img").css("max-height",window.innerHeight-150);
  $(".modal img").css("max-width",window.innerWidth-250);
});
var container = $("#grid");
for(var i=0;i<imgData.length;i++){
  var box = document.createElement("div");
  box.className = 'box';
  box.innerHTML = "<img src=" + imgData[i].src +"><div class='text'>" + imgData[i].text + "</div>"
  container.append(box);
}
$(".box img").click(function(e) {
  openModal();
  $('#imgModal img').attr("src",this.src);
});
$('#imgModal').click(function(e){
  if(!(e.target.parentNode===document.getElementsByClassName("modal-content")[0])){
    closeModal();
  }
})
function openModal() {
  $('#imgModal').css("display","block");
}
function closeModal() {
  $('#imgModal').css("display","none");
}