<?php

$seconds = null;


function noInputResponse()
{
    return [
        'success' => false,
        'html'    => '<p>Come on … at least enter <em>something</em>.</p>',
    ];
}

function errorResponse()
{

    $huh = ['Huh?', 'Wha?', 'Ummm… no.', 'Sorry?', 'Does not compute!'];
    $i = array_rand($huh);

    $html = <<< EOB
<h2>{$huh[$i]}</h2>
<p>
Try entering a time interval in one of the following formats:
</p>
<ul>
<li><tt>200</tt> <em>plain ol' number of seconds</em></li>
<li><tt>20 seconds</tt> <em>and/or "minutes" or "hours"</em></li>
<li><tt>01:23</tt> <em>that's 1 minute, 23 seconds</em></li>
<li><tt>01m23s</tt> <em>same as above</em></li>
<li><tt>01:23:45</tt> <em>that's 1 hour, 23 minutes, 45 seconds</em></li>
<li><tt>01h23m45s</tt> <em>same</em></li>
</ul>
EOB;

    return [
        'success' => false,
        'html'    => $html,
    ];
}

function convertSecondsToTimestamp($seconds)
{

    $s = $seconds % 60;
    $m = (($seconds - $s) / 60) % 60;
    $h = floor($seconds / 3600);

    return sprintf('%02d/%02d/%02d', $h, $m, $s);
}


try {

    $interval = $_POST['interval'];

    if (empty($interval) || $interval == '0') {
        die(json_encode(noInputResponse()));
    }

    if (is_numeric($interval)) {

        // plain old number format
        $seconds = abs($interval);

    } else if (preg_match('/^(\d+:)?\d+:\d+$/', $interval)) {

        $parts = explode(':', $interval);

        $seconds = 0;
        while (null !== ($part = array_shift($parts))) {
            $seconds *= 60;
            $seconds += $part;
        }

    } else if (preg_match_all('/(\d+)([dhms])/i', $interval, $matches, PREG_SET_ORDER)) {

        $seconds = 0;
        foreach ($matches as $match) {
            switch (strtolower($match[2])) {
                case 'h':
                    $seconds += 3600 * $match[1];
                    break;
                case 'm':
                    $seconds += 60 * $match[1];
                    break;
                case 's':
                default:
                    $seconds += $match[1];
                    break;
            }
        }

    } else {

        // try and parse it magically
        $seconds = strtotime('+' . $interval, 0);
    }

} catch (\Exception $e) {
    $seconds = null;
}

if ($seconds === null || $seconds === false || $seconds < 0) {

    die(json_encode(errorResponse()));

}

$ts = convertSecondsToTimestamp($seconds);

echo json_encode([
    'success' => true,
    'html'    => 'Generating...',
    'src'     => 'http://' . $_SERVER['HTTP_HOST'] . '/i/' . $ts . '.gif',
]);
