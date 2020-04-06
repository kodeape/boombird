mmm that's some good data<br><br>
<?php
// Dumps JSON to datalog.txt, one object per line
        $headers = getallheaders();
        $json = json_decode(file_get_contents('php://input'), TRUE);
        $arr = (array)$json;
        if (!empty($arr)) {
                $json['date'] = date('d.m.Y');
                $json['time'] = date('H:i:s');
                function url_get_contents ($Url) { //  This function was written by Safeer Ahmed (https://stackoverflow.com/questions/27613432/file-get-contents-not-working)
                        if (!function_exists('curl_init')){
                                die('CURL is not installed!');
                        }
                        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_URL, $Url);
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        $output = curl_exec($ch);
                        curl_close($ch);
                        return $output;
                }
                $weatherdata = json_decode(url_get_contents('http://api.openweathermap.org/data/2.5/weather?id=3133880&appid=69c170eb80f40d9c5a6783165bb99364'));
                $sunrise = date("H:i:s", $weatherdata->sys->sunrise);
                $sunset = date("H:i:s", $weatherdata->sys->sunset);
                $json['sunrise'] = $sunrise;
                $json['sunset'] = $sunset;
                $json_str = json_encode($json);
                $file = fopen("datalog.txt","a"); // NB! "a" appends to the file, "w" overwrites the file
                fwrite($file, $json_str);
                fwrite($file, "\r\n"); // end of line
                fclose($file);
        }
?>