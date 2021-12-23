import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas  = document.querySelector('.listado-pendientes');

if(tareas) {
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //Request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    if(respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Deseas eliminar esta Tarea?',
                text: "Una tarea eliminada no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar!'
              }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;

                    //Enviar los datos por axios
                    //params require agregar la id como params
                    axios.delete(url,{params: {idTarea}})
                        .then(function(respuesta) {
                            //Eliminar nodo del HTML
                            if(respuesta.status === 200) {
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //Alerta 
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                );

                                actualizarAvance();
                            }
                        });
                }
              })
        }
    });
}


export default tareas;