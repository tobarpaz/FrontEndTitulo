import { Component, OnInit,AfterViewInit, viewChildren, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Gesture, GestureController, IonCard } from '@ionic/angular';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements AfterViewInit {
   people=[
    {
      name:'juanitoculisuelto',
      age:23,
      img:'https://img.freepik.com/foto-gratis/chico-guapo-seguro-posando-contra-pared-blanca_176420-32936.jpg',
      power:0
    },
    {
      name:'elsapallo',
      age:20,
      img:'https://www.caritas.org.mx/wp-content/uploads/2019/02/cualidades-persona-humanitaria.jpg',
      power:0
    },
    {
     name:'marioneta',
     age:18,
     img:'https://media.gq.com.mx/photos/61780a08f865d472dfcd66c8/master/w_2560%2Cc_limit/GettyImages-1225777369.jpg',
     power:0
    }
  ]

  @ViewChildren(IonCard, { read: ElementRef })
  cards!: QueryList<ElementRef>;
  longPressActive=false;
  constructor(private gestureCtrl: GestureController,
              private helper:HelperService,
              private auth: AngularFireAuth,
              private router: Router,
              public dataBase:DatabaseService
            ) { }



  ngOnInit() {
  }
  ngAfterViewInit(){
    const cardArray=this.cards?.toArray();
    this.useLongPress(cardArray);
  }
  useLongPress(cardArray:any[]){
    for(let i =0; i < cardArray.length;i++){
      const card=cardArray[i]
      console.log('card',card);
      const gesture: Gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'long-press',
        onStart:ev=>{this.longPressActive =true;
                    //  this.increasePower(i);
        },
        onEnd:ev=>{this.longPressActive =false;}
      });
      gesture.enable(true);
    }

  }
  // increasePower(i){
  //   setTimeout(()=>{
  //     this.people[i].power++;
  //   },200)

  // }
  // useTinderSwipe(cardArray){

  // }
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

  async mensajeria(){
    await this.router.navigateByUrl('mensajeria');
  }


//   setCardColor(x, element){
 
//    let color ='';
//    const abs = Math.abs (x);
//    const min = Math. trunc (Math.min(16 * 16 - abs, 16 *16));
//    const hexCode = this.decimalToHex(min, 2);
//     if (x < 0){
//     color = '#FF' + hexCode + hexCode;
//      } else{
//     color = '#' + hexCode + 'FF' + hexCode;
//      }
//      element.style.background = color;
//    }

//    decimalToHex (d, padding){
//    let hex = Number (d).toString(16);
//    padding = typeof padding === 'undefined" || padding === null ? (padding = 2) : padding;
//    while (hex.length < padding){
//      hex = '0' + hex;}
//    return hex;
// }



}
