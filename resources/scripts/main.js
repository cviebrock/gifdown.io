function randBetween(low, high) {
    var d = high - low;
    return Math.floor((Math.random() * d) + low);
}

$(function () {


    var placeholders = [
            randBetween(1, 10) + ' minutes',
            randBetween(1, 60) + ' seconds',
            '00:10:45',
            '05m30s'
        ],
        phIdx = 0,
        phCharIdx = 0,
        $phInput = $('#timespan'),
        $response = $('#response'),
        $responseInner = $('#response_inner'),
        $video = $('#bgvid');

    /**
     * Animated placeholder code
     */

    var loadInterval = setInterval(loadPlaceholder, 4000),
        typeInterval = setInterval(typePlaceHolder, 150);

    function loadPlaceholder() {
        phIdx++;
        if (phIdx >= placeholders.length) {
            phIdx = 0;
        }
        phCharIdx = 0;
        phCurrText = placeholders[phIdx];
    }

    function typePlaceHolder() {
        $phInput.attr('placeholder', placeholders[phIdx].substr(0, phCharIdx++));
    }

    /**
     * Form submission
     */

    $('form').on('submit', function (e) {
        e.preventDefault();

        var data = {
            interval: $phInput.val()
        };

        $.post('generate.php', data, function (result) {

            console.log(result);

            if (result.success) {
                $video
                    .css({'opacity': 0});
                //$video.each(function () {
                //    this.pause();
                //});
            }

            $response.fadeTo(200, .01, function () {

                $responseInner.html(result.html);
                var ch = $responseInner.height();

                $response.animate({
                    'height': ch + 'px',
                    'opacity': 1
                }, 1000);
            });

        }, 'json');
    });

    /**
     * Video stuff
     */

    $video.prop('playbackRate', 0.5);

});

