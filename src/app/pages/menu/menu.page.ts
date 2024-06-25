import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  images=['https://img.freepik.com/foto-gratis/colores-arremolinados-interactuan-danza-fluida-sobre-lienzo-que-muestra-tonos-vibrantes-patrones-dinamicos-que-capturan-caos-belleza-arte-abstracto_157027-2892.jpg?w=996&t=st=1719089602~exp=1719090202~hmac=c262246dd12332e18a416663b59daf9ab47e1ebd242e4b1029ad3e8891fd35c9',
          'data:image/jpeg;base64,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'
  ]

  constructor(private helper:HelperService,
              private auth: AngularFireAuth,
              private router: Router ) { }

  ngOnInit() {
  }
  swiperSlideChanged(e:any){
    console.log('changed',e);
  }
  async cerrarSesion(){
    var salir = await this.helper.Confirmar("¿Desea cerrar sesión?","Salir","Cancelar");
    if(salir == true){
      await this.auth.signOut();
      await this.router.navigateByUrl("login");
    }
  
  }
  async perfil(){
    await this.router.navigateByUrl('perfil');
  }


}
