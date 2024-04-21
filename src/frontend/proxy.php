<?php
header('Content-Type: application/json');

$url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' . urlencode($_GET['search']) . '&format=json';
$response = file_get_contents($url);

echo $response;
?>
