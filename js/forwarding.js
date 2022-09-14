(function () {
    window.addEventListener("message", function (evt) {
        const type = evt?.data?.type;
        if (type === "timer:started" || type === "timer:stopped") {
            return (chrome ?? browser).runtime.sendMessage(evt.data);
        }
    });
}).call(this);
