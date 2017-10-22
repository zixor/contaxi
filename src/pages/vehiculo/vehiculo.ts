import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { VehiculoModel } from "../../models/vehiculo.model";
import { VehiculoSqliteService } from "../../providers/vehiculo.service.sqlite";

@Component({
  selector: 'page-vehiculo',
  templateUrl: 'vehiculo.html',
})
export class VehiculoPage {

  private vehiculo: VehiculoModel;
  private DELETE: string;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private vehiculoService: VehiculoSqliteService,
    private alertCtrl: AlertController) {
    this.vehiculo = {
      placa: "",
      modelo: "",
      marca: "",
      estado: "",
    };

    const vehiculo = navParams.get('vehiculo');
    if (vehiculo) {
      this.vehiculo = vehiculo;
    }
    
  }

  ionViewDidLoad() {

  }

  onSave() {
    if (this.vehiculo.id) {
      this.vehiculoService.update(this.vehiculo);
    } else {
      this.vehiculoService.add(this.vehiculo);
    }
    this.navCtrl.pop();
  }

  onTrash() {
    let confirm = this.alertCtrl.create({
      title: this.DELETE,
      message: `Desea eliminar el vehículo con placa : "${this.vehiculo.placa}"?`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.vehiculoService.delete(this.vehiculo);
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

}
