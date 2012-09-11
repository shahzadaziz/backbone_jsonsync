<?php

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim();

$app->get('/properties', 'getProperties');
$app->get('/properties/:id',  'getProperty');
$app->get('/properties/search/:query', 'findByName');
$app->post('/properties', 'addProperty');
$app->put('/properties/:id', 'updateProperty');
$app->delete('/properties/:id',   'deleteProperty');


//Service handlers
function getProperties() {
    $file = file_get_contents('module.json');
    $json = json_decode($file, true);

    if(isset($json))
        echo json_encode ($json);
   
}

function addProperty(){
	$request_body = file_get_contents('php://input');
	$request_body = '{"properties": ' . $request_body . '}';

        file_put_contents('module.json',$request_body);
}


function updateProperty(){
	echo 'update property - put';
}

function deleteProperty(){
	echo 'delete property - delete';
}


$app->get('/', function () {
    $template = <<<EOT
<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8"/>
            <title>Prop servies</title>
            
        </head>
        <body>
            Service Engine.
        </body>
    </html>
EOT;
    echo $template;
});


$app->run();
