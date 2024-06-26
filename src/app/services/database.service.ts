import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }


  async agregarUsuario(nombre:string,
                      apellido:string,
                      nacimiento:string,
                      edad:number,
                      genero:boolean,
                      comuna:number,
                      region:number,
                      correo:string){
    console.log("1111111111");
    const data = {
                  "nombre":nombre,
                  "apellido":apellido,
                  "nacimiento":nacimiento,
                  "edad":edad,
                  "genero":genero,
                  "comuna":comuna,
                  "region":region,
                  "correo":correo

    }
   
    
  await this.firestore.collection('Usuario').add(data);
  };

  async agregarDescripcion(texto:string,
                          vivienda:boolean,
                          pago:boolean,
                          mascota:boolean,
                          ejercicios:boolean,
                          alimentacion:boolean,
                          fuma:boolean,
                          comunidad: boolean,
                          alcohol:boolean
  ){
    const  data = {
      "texto":texto,
      "vivienda":vivienda,
      "pago":pago,
      "mascota":mascota,
      "ejercicios":ejercicios,
      "alimentacion":alimentacion,
      "fuma":fuma,
      "comunidad":comunidad,
      "alcohol":alcohol

    }
    await this.firestore.collection('Descripcion').add(data);
  }
    

  }

 
  



