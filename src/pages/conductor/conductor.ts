import { Component } from '@angular/core';
import { NavController, NavParams, Loading, ModalController, AlertController, ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { VehiculoSqliteService } from "../../providers/vehiculo.service.sqlite";
import { ConductorSqliteService } from "../../providers/conductor.service.sqlite";
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from "@ionic-native/image-picker";
import { FilePath } from "@ionic-native/file-path";
import { File } from '@ionic-native/file';
import { ConductorModel } from "../../models/conductor.model";
import { VehiculoModel } from "../../models/vehiculo.model";
import { ModalVehiculoPage } from "../modal-vehiculo/modal-vehiculo";
import * as moment from 'moment';
declare var cordova: any;

@Component({
  selector: 'page-conductor',
  templateUrl: 'conductor.html',
})
export class ConductorPage {

  private conductor: ConductorModel;
  private vehiculo: VehiculoModel;
  private lastImage: string = "";
  private loading: Loading;

  private SOURCE_IMAGE: string;
  private LOAD_LIBRARY: string;
  private USE_CAMERA: string;
  private CANCEL: string;
  private CONFIRM: string;
  private WARNING: string;
  private DELETE: string;
  private QUESTION_DELETE_EXPENSE: string;
  private EXECUTED_BUDGET: string;
  private QUESTION_CONTINUE: string;

  constructor(
    private navCtrl: NavController,
    private modalCtl: ModalController,
    private navParms: NavParams,
    private vehiculoService: VehiculoSqliteService,
    private conductorService: ConductorSqliteService,
    private alertCtrl: AlertController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private file: File,
    private filePath: FilePath,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private loadingCtrl: LoadingController) {

    let conductor = navParms.get('conductor');

    if (conductor) {
      this.conductor = conductor;
      if (conductor.foto) {
        this.lastImage = conductor.foto;
      }
      this.vehiculo.placa = conductor.vehiculo;
    } else {
      this.initConductor();
      this.initCategory();
    }
  }

  private initConductor() {
    this.conductor = {
      fechaIngreso: new Date().toISOString(),
      cedula: "",
      nombres: "",
      apellidos: "",
      telefonoFijo: "",
      celular: "",
      direccion: "",
      foto: "",
      vehiculo: "",
      quienllamar: "",
      telefonoquienllamar: ""
    };
  }

  private initCategory() {
    this.vehiculo = {
      placa: "",
      modelo: "",
      marca: "",
      estado: ""
    };
  }

  private optionsGallery = {
    maximumImagesCount: 1,
    width: 500,
    height: 500,
    quality: 75
  };

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create(
      {
        title: "Origen de Imágen",
        buttons: [
          {
            text: "Desde Librería",
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: "Usar Cámara",
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: "Cancelar",
            role: "Cancelar"
          }
        ]
      });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error seleccionando imagen.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error guardando archivo.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  onSave() {
    this.conductor.foto = this.lastImage;
    this.conductor.fechaIngreso = moment(new Date(this.conductor.fechaIngreso).toISOString()).format();
    if (this.conductor.id) {
      this.conductor.vehiculo = this.vehiculo.placa;
      this.conductorService.update(this.conductor);
    } else {
      this.conductorService.add(this.conductor);
    }
    this.navCtrl.pop();
  }

  onTrash() {
    let confirm = this.alertCtrl.create({
      title: "Eliminar",
      message: `Desea eliminar el siguiente conductor: "${this.conductor.nombres} ${this.conductor.apellidos}"?`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.conductorService.delete(this.conductor);
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  choosePicture() {
    this.imagePicker.getPictures(this.optionsGallery).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, (err) => { });
  }

  openModalCategory() {
    const modal = this.modalCtl.create(ModalVehiculoPage);
    modal.present();
    modal.onDidDismiss(vehiculo => {
      if (vehiculo) {
        this.vehiculo = vehiculo;
        this.conductor.vehiculo = vehiculo.placa;
      }
    });
  }

}
