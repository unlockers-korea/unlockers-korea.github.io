$(function($) {
    var settings = ['Interval', 'Repetitions', 'Break Time'];
    var currentState = 0;
    var timerId = null;
    var progress = 0;
    var currentRepetition = 0;

    var values = {
        'Interval': 0,
        'Repetitions': 0,
        'Break Time': 0
    };

    function toMinuteSecond(value) {
        var minutes = Math.floor(value / 60);
        var seconds = value % 60;
        return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function updateLabel() {
        $('.knob-label').text(settings[currentState]);
        i = values[settings[currentState]];
        updateDisplay(i);
    }

    function updateDisplay(i) {
        if (settings[currentState] === "Interval" || settings[currentState] === "Break Time") {
            $ival.html(toMinuteSecond(i));
            if (settings[currentState] === "Interval") {
                $(".infinite").trigger('configure', { "fgColor" : "#e57373" });
            } else {
                $(".infinite").trigger('configure', { "fgColor" : "#64b5f6" });
            }
        } else {
            $ival.html(i);
            $(".infinite").trigger('configure', { "fgColor" : "#81c784" });
        }
    }

    function startTimer() {
        clearInterval(timerId);
        currentRepetition = 0;
        runInterval();
    }

    function runInterval() {
        $(".status-indicator").text("Status: Interval").removeClass("status-break").addClass("status-interval");
        $(".infinite").trigger('configure', { "readOnly" : true });  // Make the knob read-only while the timer is running
    
        $(".status-indicator").text("Status: Interval").removeClass("status-break").addClass("status-interval");
        document.getElementById("intervalSound").play();
        var timeLeft = values['Interval'];
        timerId = setInterval(function() {
            timeLeft--;
            var knobValue = (timeLeft / values['Break Time']) * 100;
            $('.infinite').val(knobValue).trigger('change');
    
            var knobValue = (timeLeft / values['Interval']) * 100;
            $('.infinite').val(knobValue).trigger('change');
    
            progress = ((values['Interval'] - timeLeft) / values['Interval']) * 100;
            if (timeLeft <= 0) {
            $('.infinite').val(0).trigger('change');
    
                clearInterval(timerId);
                currentRepetition++;
                if (currentRepetition < values['Repetitions']) {
                    runBreak();
                }
            }
            $('.progress-bar').css('width', progress + '%');
            updateDisplay(timeLeft);
        }, 1000);
    }

    function runBreak() {
        $(".status-indicator").text("Status: Break").removeClass("status-interval").addClass("status-break");
        $(".infinite").trigger('configure', { "readOnly" : true });  // Make the knob read-only while the timer is running
    
        $(".status-indicator").text("Status: Break").removeClass("status-interval").addClass("status-break");
        document.getElementById("breakSound").play();
        var timeLeft = values['Break Time'];
        timerId = setInterval(function() {
            timeLeft--;
            var knobValue = (timeLeft / values['Interval']) * 100;
            $('.infinite').val(knobValue).trigger('change');
    
            progress = ((values['Break Time'] - timeLeft) / values['Break Time']) * 100;
            if (timeLeft <= 0) {
            $('.infinite').val(0).trigger('change');
    
                clearInterval(timerId);
                runInterval();
            }
            $('.progress-bar').css('width', progress + '%');
            updateDisplay(timeLeft);
        }, 1000);
    }

    $(".knob").knob({
        change : function (value) {},
        release : function (value) {
            $("#startButton").fadeIn();
        },
        cancel : function () {}
    });

    var v, up=0, down=0, i=0;
    var $ival = $("div.ival");
    var incr = function() { 
        if (settings[currentState] === "Interval" || settings[currentState] === "Break Time") {
            i++;
            if(i >= 3600) i = 0;
            $ival.html(toMinuteSecond(i));
        } else {
            i++;
            $ival.html(i);
        }
        values[settings[currentState]] = i;
    };

    var decr = function() { 
        if (settings[currentState] === "Interval" || settings[currentState] === "Break Time") {
            i--;
            if(i < 0) i = 3599;
            $ival.html(toMinuteSecond(i));
        } else {
            i--;
            if(i < 0) i = 0;
            $ival.html(i);
        }
        values[settings[currentState]] = i;
    };

    $("input.infinite").knob({
        min : 0,
        max : 200,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    decr();
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){
                        incr();
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    });

    $('#nextButton').click(function() {
        currentState = (currentState + 1) % settings.length;
        updateLabel();
    });

    $('#startButton').click(function() {
        startTimer();
    });

    updateLabel();
});

var paused = false;

$('#pauseButton').click(function() {
    if (paused) {
        paused = false;
        $('#pauseButton').text('Pause');
        startTimer();
    } else {
        paused = true;
        $('#pauseButton').text('Resume');
        clearInterval(timerId);
    }
});

function startTimer() {
    if (!paused) {
        clearInterval(timerId);
        currentRepetition = 0;
    }
    runInterval();
}

    function startTimer() {
        $(".infinite").trigger('configure', { "readOnly" : false });  // Make the knob editable again
        if (!paused) {
            clearInterval(timerId);
            currentRepetition = 0;
        }
        runInterval();
    }
