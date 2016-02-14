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

            if (result.success) {
                $video.css({'opacity': 0});
            }

            $response.fadeTo(200, .01, function () {

                $responseInner.html(result.html);
                var ch = $responseInner.height();

                $response.animate({
                    'height': ch + 'px',
                    'opacity': 1
                }, 1000);

                if (result.success) {
                    loadImage(result.src)
                }
            });

        }, 'json');
    });

    /**
     * Video stuff
     */

    $video.prop('playbackRate', 0.5);


    function loadImage(src) {
        var img = new Image(),
            $info = $('<input class="info" type="text">').val(src);

        $(img).load(function() {
            $img = $(this);
            $response.fadeTo(200, .01, function () {
                $responseInner.html($img);
                $responseInner.append($info);

                var ch = $responseInner.height();

                $response.animate({
                    'height': ch + 'px',
                    'opacity': 1
                }, 1000);

            });
        }).attr({
            'src': src+'?'+(new Date().getTime())
        }).error(function() {
           setTimeout(function() {
               loadImage(src);
           }, 3000);
        });
    }


    $response.on('click', 'input.info', function() {
        $(this).select();
    });

});

