(function() {
  window.addEventListener("message", function(evt) {
    var ref, ref1;
    if ((ref = (ref1 = evt.data) != null ? ref1.type : void 0) === "timer:started" || ref === "timer:stopped") {
      return (chrome ?? browser).runtime.sendMessage(evt.data);
    }
  });

}).call(this);
