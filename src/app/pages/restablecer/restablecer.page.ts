import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {

  correo: string ="";

  constructor(private router: Router,
              private helper: HelperService
  ) { }

  ngOnInit() {
  }

  async restablecer(){
    if(this.correo == ""){
      await this.helper.mostrarAlerta("Debes ingresar un correo válido.","Información");
      return;
    }
    await this.helper.mostrarAlerta("Te enviamos un correo electrónico.","Información");
  }

  async back(){
    await this.router.navigateByUrl('login');
  }

}
