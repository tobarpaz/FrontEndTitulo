import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  usuario: string = "";
  contrasena: string = "";

  constructor(private router: Router,
              private helper: HelperService
  ) { }

  ngOnInit() {
  }

  async Login(){

    if(this.usuario == ""){
      await this.helper.mostrarAlerta("Debes ingresar un correo","Información");
      return;
      
    }

    if(this.contrasena == ""){
      await this.helper.mostrarAlerta("Debes ingresar una contraseña","Información");
      return;
    
    }
    
    
    await this.router.navigateByUrl('menu');
    
  }

  async registrateAqui(){
    await this.router.navigateByUrl('registro');

  }

  async restContrasena(){
    await this.router.navigateByUrl('restablecer');

  }



}
