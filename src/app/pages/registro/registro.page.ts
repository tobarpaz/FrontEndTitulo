import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { Region } from 'src/app/models/region';
import { Comuna } from 'src/app/models/comuna';
import { LocationService } from 'src/app/services/location.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {



  nombre: string ="";
  apellidos: string ="";
  nacimiento: string="";
  selegenero: boolean = false;
  femenino:boolean = false;
  masculino:boolean = false;;
  noDecirlo:boolean = false;
  otro:boolean = false;
  edad:number = 0;
  correo: string ="";
  contrasena1: string ="";
  contrasena2: string ="";

  regiones:Region [] = [];
  comunas:Comuna [] = [];
  seleComuna:number=0;
  seleRegion:number=0;
  disabledComuna:boolean = true;

  

  


  constructor(private router: Router,
              private helper: HelperService,
              private locationService:LocationService,
              private auth: AngularFireAuth,
              private loaderController:LoadingController,
              private storage: StorageService,
              private database: DatabaseService ) 
  {}

 
  ngOnInit() {
    this.mostrarRegion();
  }
  async mostrarRegion(){
    const reque = await this.locationService.obtenerRegion();
     this.regiones = reque.data;
     console.log(this.regiones);
     
   }

   async mostrarComuna(){
     try{
       const reque = await this.locationService.obtenerComuna(this.seleRegion);
       this.comunas = reque.data;
       this.disabledComuna = false;
    }catch(error:any){
      await this.helper.mostrarAlerta(error.error.msg,"");
     }
     
     
  }

  async registro(){

    if(this.nombre == "") {
      await this.helper.mostrarAlerta("Debes ingresar tu nombre.", "Información");
      return;
    }
    if (this.nombre.length<2){
      await this.helper.mostrarAlerta("Debes ingresar un nombre válido","Información");
      return;
    }

    if(this.apellidos == "") {
      await this.helper.mostrarAlerta("Debes ingresar tu apellido.","Información");
      return;
    }
    if(this.apellidos.length<3){
      await this.helper.mostrarAlerta("Debes ingresar un apellido válido","Información");
      return;
    }

    if(this.nacimiento == "") {
      await this.helper.mostrarAlerta("Debes ingresar tu fecha de nacimiento","Información");
      return;
    }

    if(this.edad<=17){
      await this.helper.mostrarAlerta("Debes ser mayor de 18 años","información");
      return;
    }
    
    if(this.correo == "") {
      await this.helper.mostrarAlerta("Debes ingresar un correo válido.", "Información");
      return;
    }
    

    if(this.contrasena1 == "" ) {
      await this.helper.mostrarAlerta("Debes ingresar una contraseña.", "Información");
      return;
    }

    if(this.contrasena2 == "") {
      await this.helper.mostrarAlerta("Debes confirmar tu contraseña.","Información");
      return;
    }

    if(this.contrasena1 !== this.contrasena2) {
      await this.helper.mostrarAlerta("Las contraseñas no coinciden.", "Información");
      return;
    } 
  

    var usuario =
    [
      {
        nombre: this.nombre,
        apellido: this.apellidos,
        nacimiento: this.nacimiento,
        edad: this.edad,
        genero: this.selegenero,
        comuna: this.seleComuna,
        region: this.seleRegion,
        correo: this.correo,
        contrasena1: this.contrasena1,
        contrasena2 : this.contrasena2
      }
    ]

    try {
      const req = await this.auth.createUserWithEmailAndPassword(this.correo, this.contrasena2);
      this.storage.keepUser(usuario);
      this.database.agregarUsuario(this.nombre,this.apellidos,this.nacimiento,this.edad,this.selegenero,this.seleComuna,this.seleRegion,this.correo);
      await this.router.navigateByUrl('tipo-registro');
      console.log(usuario);
      
      
    
    }catch(error:any){

      if(error.code == 'auth/email-alredy-in-use'){
        await this.loaderController.dismiss();
        await this.helper.mostrarAlerta("Correo ya registrado","Error");
        
      }

      if(error.code == 'auth/weak-password'){
        await this.loaderController.dismiss();
        await this.helper.mostrarAlerta("La contraseña no alcanza el mínimo de caracteres requeridos","Error"); 
      }

      if(error.code == 'auth/invalid-email'){
        await this.loaderController.dismiss();
        await this.helper.mostrarAlerta("El correo no es válido","Error");
      }

      if(error.code == 'auth/user-not-found'){
        await this.loaderController.dismiss();
        await this.helper.mostrarAlerta("Usuario no encontrado","Error");
       
      }

      if(error.code == 'auth/wrong-password'){
        await this.loaderController.dismiss();
        await this.helper.mostrarAlerta("La contraseña ingresada no es válida","Error");
      }
      return;
    

    }
    
   

    
   
    }

   

    
  

 
  async back(){
    await this.router.navigateByUrl('login');
  }

  

  

 
}


