$(function () {

    /**
     * Animated placeholder code
     */

    var placeholders = [
            '30 seconds',
            '2 minutes',
            '00:10:45'
        ],
        phIdx = 0,
        phCharIdx = 0,
        phInput = $('#timespan');

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
        phInput.attr('placeholder', placeholders[phIdx].substr(0, phCharIdx++));
    }

    /**
     * Form submission
     */

    $('form').on('submit', function (e) {
        e.preventDefault();

        var data = {
            interval: phInput.val()
        };

        $("#gif").load('generate.php', data, function (response, status, xhr) {

        });
    });


});
