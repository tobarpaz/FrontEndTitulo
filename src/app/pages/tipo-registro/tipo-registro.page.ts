import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from 'src/app/services/storage.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-tipo-registro',
  templateUrl: './tipo-registro.page.html',
  styleUrls: ['./tipo-registro.page.scss'],
})
export class TipoRegistroPage implements OnInit {

  seleHabitacion:any;
  seleRommie:any;

  constructor(private router: Router,
              private database: DatabaseService, 
              private storage: StorageService
  ) { }

  ngOnInit() {
  }

  tipo_registro(){
    if (this.seleHabitacion == this.seleHabitacion){
      
    }
  }
  
  async habitacion(){
    await this.storage.keepUser(this.seleHabitacion);
    await this.router.navigateByUrl("rommie");
  }

  async rommie(){
    await this.router.navigateByUrl("propietario");
  }

  async back(){
    await this.router.navigateByUrl("registro");
  }

}
