import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ConductorModel } from "../../models/conductor.model";
import { CallNumber } from '@ionic-native/call-number';
import { VehiculoSqliteService } from "../../providers/vehiculo.service.sqlite";
import { ConductorSqliteService } from "../../providers/conductor.service.sqlite";
import { ConductorPage } from "../conductor/conductor";
declare var cordova: any;

@Component({
  selector: 'page-list-conductor',
  templateUrl: 'list-conductor.html',
})
export class ListConductorPage {

  private conductores: ConductorModel[] = [];

  constructor(private navCtrl: NavController,
    private vehiculoService: VehiculoSqliteService,
    private conductorService: ConductorSqliteService,
    private callNumber: CallNumber,
    private alertCtrl: AlertController) {
    this.loadData();
  }

  loadData() {
    this.conductorService.getAll().then(data => {
      this.conductores = data;
    });
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewDidLoad() {
    this.loadData();
  }

  onAddClick() {
    this.navCtrl.push(ConductorPage);
  }

  editConductor(conductor: ConductorModel) {
    this.navCtrl.push(ConductorPage, {
      conductor: conductor
    });
  }

  onCall(conductor: ConductorModel) {  
    this.callNumber.callNumber(conductor.celular, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'))
  }

  doRefresh(refresher) {
    this.vehiculoService.getAll()
      .then(data => {
        this.conductores = data;
        refresher.complete();
      })
      .catch(e => console.log(e));
  }

  onTrash(conductor: ConductorModel) {
    let confirm = this.alertCtrl.create({
      title: 'Eliminar',
      message: `Desea eliminar el siguiente conductor: "${conductor.nombres} ${conductor.apellidos}"?`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.conductorService.delete(conductor);
            this.loadData();
          }
        }
      ]
    });
    confirm.present();
  }

   public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

}
