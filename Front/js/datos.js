'use strict';
var archivo;
var aux,tabla,input;

function ocultarBoton(){
    document.querySelector('#botonRedireccion').style.display = 'none';
}


function subirFoto() {
    document.querySelector('#formFoto').addEventListener('submit', function () {
        event.preventDefault();

        input = document.querySelector('#formFoto').getElementsByTagName('input');
        let aux = input[0].value.split('\\');
        //archivo es el nombre del archivo que el usuario sube
        //para luego ponerlo en el fetch que tiene que leer ese mismo archivo
        archivo = aux[2];
        let data = new FormData(document.querySelector('#formFoto'));

        if (!input[0].value) {
            alert('Escoja un archivo excell');
        } else {
            fetch('../Back/php/subirArchivo.php', { method: 'POST', body: data })
                .then(data => data.text())
                .then(response => {
                    //bloqueamos el input para que no suba mas
                    input[0].disabled = true;
                    input[1].disabled = true;
                    //aqui llamamos a la funcion para leerlo
                    leerCsv();
                })
                .catch(err => {
                    console.log(err.message);
                })
        }
    })
}



function leerCsv() {
    fetch('../Back/archivos/'+archivo)
        .then(data => data.text())
        .then(response => {
            // console.log(response);
            //aqui metemos la respuesta, es decir el csv e intentamos convertirlo a un json
            convertirCsv(response);
        })
        .catch(err => {
            console.log(err.message);
        })
}



function convertirCsv(res) {
    let documentoJson = [];
    let aux = res.split('\n');
    //aqui tenemos guardados los indices d el aprimera fila
    let indices = aux[0].split(',');
    //aqui creamos un json con todos los datos, aunque los indices son de ejemplo
    //a que los importates que varien segun el excel estan guardados en el array indices
    for (let i = 1; i < aux.length - 1; i++) {
        let celdas = aux[i].split(',');

        let auxiliar =
        {
            Fecha: celdas[0],
            Numero: celdas[1],
            Nombre: celdas[2],
            Direccion: celdas[3],
            Nif: celdas[4],
            Importe: celdas[5],
            Impuesto: celdas[6],
            Concepto: celdas[7]
        }
        documentoJson.push(auxiliar);
    }
    mostrarTabla(indices, documentoJson);
}



function mostrarTabla(jsonCabecera, jsonBody) {
    if(jsonCabecera.length>8){
        console.log(jsonCabecera)
        alert('No puede tener mas de 8 columnas');
        input[0].disabled = false;
        input[1].disabled = false;
    }else if(jsonBody.length>9){
        alert('No puede tener mas de 9 columnas');
        input[0].disabled = false;
        input[1].disabled = false;
    }else{
       
        let divTabla = document.querySelector('#divTabla');
        divTabla.style.display = 'block';
    
        tabla = `<caption>${jsonBody[0].Nombre}</caption><table border='1'>`;
        tabla += `<tr>`;
        for (let i = 0; i < jsonCabecera.length; i++) {
            tabla += `<th>${jsonCabecera[i]}</th>`;
        }
        tabla += `</tr>`;
        for (let i = 0; i < jsonBody.length; i++) {
            tabla += `<tr>`;
            tabla += `<td>${jsonBody[i].Fecha}</td>`;
            tabla += `<td>${jsonBody[i].Numero}</td>`;
            tabla += `<td>${jsonBody[i].Nombre}</td>`;
            tabla += `<td>${jsonBody[i].Direccion}</td>`;
            tabla += `<td>${jsonBody[i].Nif}</td>`;
            tabla += `<td>${jsonBody[i].Importe} €</td>`;
            tabla += `<td>${jsonBody[i].Impuesto} €</td>`;
            tabla += `<td>${jsonBody[i].Concepto}</td>`;
            tabla += `</tr>`;
        }
        tabla += `</table>`;
    
        divTabla.innerHTML = tabla;
         //aqui llamamos a la funcion que nos redireccionara al php donde esta el pdf
        botonRedireccionar();
        document.querySelector('#botonRedireccion').style.display = 'block';
    }
}

function botonRedireccionar(){
    let botonRedireccion = document.querySelector('#botonRedireccion');
    botonRedireccion.addEventListener('click',function(){
        let data = new URLSearchParams('html='+tabla);
    
        fetch('../Back/php/escribirPdf.php',{method:'POST',body:data})
        .then(data => data.text())
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err.message)
        })

        let cont=0;
        setInterval(function(){
            if(cont==2){
                window.location.href = 
                'http://localhost:8088/cristian/WebFacturas/Back/php/escribirPdf.php';
            }
            cont++;
        },200)
        
    })
}
