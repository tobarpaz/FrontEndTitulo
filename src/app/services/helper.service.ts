import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private alertService: AlertController) { }

  async mostrarAlerta(msg:string,title:string){
    var alerta = await this.alertService.create({cssClass:"alertClass",message:msg,header:title,buttons:['Aceptar']})
    await alerta.present();
    return alerta;
  }
}
