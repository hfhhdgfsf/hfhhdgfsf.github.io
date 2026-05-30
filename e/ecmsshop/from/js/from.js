
$(function(){
  var csarr=queryURLParams();
  console.log(csarr);
  //alert(csarr['source']);
  //console.log(csarr);
  //alert(csarr['source']);
  if(csarr['source']){
      var nurl=window.location.href;
      $.post("/e/ecmsshop/from/",{source:csarr['source'],k:csarr['k'],q:csarr['q'],url:nurl},function(data){})
  }
})

function queryURLParams() {
    var url=window.location.href;
    let pattern = /(\w+)=(\w+)/ig; //定义正则表达式
    let parames = {}; // 定义参数对象
    url.replace(pattern, ($, $1, $2) => {
      parames[$1] = $2;
    });
    return parames;
}