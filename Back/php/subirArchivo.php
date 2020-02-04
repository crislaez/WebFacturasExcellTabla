<?php
    ini_set('display_errors','On');
    error_reporting(E_ALL);
    if(isset($_POST)){
    
        $imagen = $_FILES['archivo']['name'];
        $destino = '../archivos/'.$imagen;
        move_uploaded_file($_FILES['archivo']['tmp_name'],$destino);
        setcookie('archivo',$destino,time()+60*60*60);
    }
?>