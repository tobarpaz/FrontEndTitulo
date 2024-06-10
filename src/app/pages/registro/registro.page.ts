import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  nombre: string ="";
  apellidos: string ="";
  nacimiento: string ="";
  correo: string ="";
  contrasena1: string ="";
  contrasena2: string ="";

  constructor(private router: Router,
              private helper: HelperService
  ) { }

  ngOnInit() {
    
  }

  async registro(){

    if(this.nombre == "") {
      await this.helper.mostrarAlerta("Debes ingresar tu nombre.", "Información");
      return;
    }

    if(this.apellidos == "") {
      await this.helper.mostrarAlerta("Debes ingresar tu apellido.","Información");
      return;
    }

    if(this.nacimiento == "") {
      await this.helper.mostrarAlerta("Debes ingresar tu fecha de nacimiento","Información");
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
    await this.router.navigateByUrl('tipo-registro');
  }

  

  async back(){
    await this.router.navigateByUrl('login');
  }

}
