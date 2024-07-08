import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { descripcionU } from 'src/app/models/descripcion';
import { usuarioPf } from 'src/app/models/usuario';
import { DatabaseService } from 'src/app/services/database.service';
import { FotografiaService } from 'src/app/services/fotografia.service';
import { HelperService } from 'src/app/services/helper.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  fotos : string []=[];
  usuario: any;
  userInfo: usuarioPf;

  info: usuarioPf = null;
  infoDescrip: descripcionU = null;

  id: string;
  
  
  photos?: string[] = [];
  currentUserId: string;
  chunkedPhotos: SafeUrl[][] = [];
  uid: string;
  @ViewChild('fileInput') fileInput;


  

  constructor(private router:Router,
              private fotografiaService:FotografiaService,
              private database: DatabaseService,
              private auth: AngularFireAuth,
              private alertController: AlertController,
              private helper: HelperService,
              private storage: AngularFireStorage 

             
  ) 
  {this.fotos = this.fotografiaService.fotos;
    
      this.auth.currentUser.then(user => {
        if (user) {
          this.currentUserId = user.uid;
          this.loadUserPhotos();
        }
      });
  }

  ngOnInit() {
    this.getUid();
  }

  
  async editarAtributoUsuario(name: string){
    var alerta = await this.alertController.create({
      cssClass:"my-custom-class", 
      header:'Edita tu ' + name,
      inputs:[
        {
          name,
          type: 'text',
          placeholder: 'Ingresa tu ' + name
        },
      ],
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () =>{
            console.log("confirmo cancelacion");
          }
        },{
          text: 'Aceptar',
          handler: (ev) =>{
            console.log("confirmar ok", ev);
            this.saveAtributoUsuario(name, ev[name])
          }
        }

      ]
  
  });
  await alerta.present();
}

saveAtributoUsuario(name: string, input: any){
  const path= 'Usuario';
  const id = this.uid;
  const updateDoc = {
  }; 
  updateDoc[name] = input;
  this.database.updateDoc(path, id, updateDoc).then( () => {
    this.helper.showtoast("Actualizado con exito")
  })
}

async editarAtributoDescripcion(name: string){
  var alerta = await this.alertController.create({
    cssClass:"my-custom-class", 
    header:'Edita tu ' + name,
    inputs:[
      {
        name,
        type: 'text',
        placeholder: 'Ingresa tu ' + name
      },
    ],
    buttons:[
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () =>{
          console.log("confirmo cancelacion");
        }
      },{
        text: 'Aceptar',
        handler: (ev) =>{
          console.log("confirmar ok", ev);
          this.saveAtributoDescripcion(name, ev[name])
        }
      }

    ]

});
await alerta.present();
}

saveAtributoDescripcion(name: string, input: any){
  const path= 'Descripcion';
  const id = this.uid;
  const updateDoc = {
  }; 
  updateDoc[name] = input;
  this.database.updateDoc(path, id, updateDoc).then( () => {
    this.helper.showtoast("Actualizado con exito")
  })
}



  async getUid(){
    const uidd = await this.database.getUid();
    if(uidd){
      this.uid = uidd;
      console.log(' Mi uid ->', this.uid);
      this.getInfoDescripcion();
      this.getInfoUser();
    } else {
      console.log('no existe uid');
    }
  }

  getInfoDescripcion(){
    const path = 'Descripcion'
    const id = this.uid;
    this.database.getDoc<descripcionU>(path, id).subscribe(des =>{
      if(des){
        this.infoDescrip = des;
      }
      console.log("Las descripciones son estas -> ", des)
    })
  }


  getInfoUser(){
    const path = 'Usuario';
    const id = this.uid;
    this.database.getDoc<usuarioPf>(path, id).subscribe(res => {
      if(res){
        this.userInfo = res;
        this.info = res;
        console.log("Los datos son -> ", this.userInfo);
      } else{
        console.log("No se encontraron datos para el usuario con UID ", id);
      }
    });
  }
    
  loadUserPhotos() {
    this.database.getDoc<any>('Usuario', this.currentUserId).subscribe(userData => {
      this.photos = userData?.photos || [];
    });
  }


  async uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const photoIndex = this.photos.length;
      if (photoIndex < 6) {
        const photoUrl = await this.database.uploadPhoto(file, this.currentUserId, photoIndex);
        this.photos.push(photoUrl);
        await this.database.updateUserProfilePhotos(this.currentUserId, this.photos);
      } else {
        console.log('No puedes subir más de 6 fotos.');
      }
    }
  }
chunkPhotos() {
  this.chunkedPhotos = [];
  for (let i = 0; i < this.photos.length; i += 2) {
    this.chunkedPhotos.push(this.photos.slice(i, i + 2));
  }
}

async deletePhoto(photoUrl: string, index: number) {
  try {
    await this.database.deletePhoto(photoUrl, this.currentUserId, index);
    this.photos.splice(index, 1);
    await this.database.updateUserProfilePhotos(this.currentUserId, this.photos);
    console.log('Foto eliminada con éxito');
  } catch (error) {
    console.error('Error al eliminar la foto:', error);
  }
}

async saveProfile() {
  try {
    await this.database.setDoc('Usuario', this.currentUserId, this.usuario);
    console.log('Perfil guardado con éxito');
  } catch (error) {
    console.error('Error al guardar el perfil:', error);
  }
}


  async tomarFoto(){
    await this.fotografiaService.addNuevaFoto();
  }

  async back(){
    await this.router.navigateByUrl("menu");
  }

  async editarFoto() {
    const alerta = await this.alertController.create({
      cssClass: "my-custom-class",
      header: 'Edita tu foto de perfil',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("confirmo cancelacion");
          }
        }, {
          text: 'Tomar Foto',
          handler: () => {
            this.tomarFoto();
          }
        }, {
          text: 'Subir Foto',
          handler: () => {
            this.fileInput.nativeElement.click();
          }
        }
      ]
    });
    await alerta.present();

    
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadFile(file);
    }
  }
  
  uploadFile(file: File) {
    const filePath = `profile_photos/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
  
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.updateUserProfilePhoto(url);
          });
        })
      )
      .subscribe();
  }
  
  updateUserProfilePhoto(photoURL: string) {
    // Asegúrate de que info no es nulo y photos es un arreglo
    if (!this.info) {
      this.info = {} as usuarioPf;
    }
  
    if (!Array.isArray(this.info.photos)) {
      this.info.photos = [];
    }
  
    this.info.photos.push(photoURL);
  
    // Actualiza la URL de la foto en Firestore
    this.database.updateDoc('Usuario', this.uid, { photos: this.info.photos }).then(() => {
      this.helper.showtoast("Foto de perfil actualizada con éxito");
    });
  }
  
  
  


}


