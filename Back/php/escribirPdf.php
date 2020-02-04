<?php

    if(isset($_POST['html'])){        
        echo $_POST['html'];
        setcookie('html',$_POST['html'],time()+60*60*35); 
        header("Refresh:0");
    }

    if(isset($_COOKIE['archivo'])){
        if(file_exists($_COOKIE['archivo'])){
            //ahora borramos el archivo
            unlink($_COOKIE['archivo']);
        }   

        $html = $_COOKIE['html'];

        if(isset($_COOKIE['html'])){
            setcookie('html','',time()-100);
        }

        // importamos el archivo pdf
        require_once 'vendor/autoload.php';
        //importamos la variable html
        // require_once 'variable.php';
        //impotamos el css
        $css = file_get_contents('plantilla.css');
        //instanciamos la clase
        $pfd  = new \Mpdf\Mpdf([]);
        //ahora le damos estilos
        $pfd -> writeHTML($css,\Mpdf\HTMLParserMode::HEADER_CSS);
        //escribimos dentro lo qeu queramos y decimos que lo convierta a html parse
        $pfd -> writeHTML($html,\Mpdf\HTMLParserMode::HTML_BODY);    
        //para qeu lo escriba
        $pfd -> Output('facturas.pdf','I');
    }
  
    
    

?>