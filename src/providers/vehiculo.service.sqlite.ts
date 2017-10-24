import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VehiculoModel } from '../models/vehiculo.model';

@Injectable()
export class VehiculoSqliteService {

  private dbConfig = { name: 'data.db', location: 'default' };
  private sqlObject: SQLiteObject;

  constructor(private sqlite: SQLite) {}

  openDataBase() {
    return this.sqlite.create(this.dbConfig).then((db: SQLiteObject) => {
      this.sqlObject = db;
      this.createTable();
    });
  }

  createTable() {
    let sql = 'CREATE TABLE IF NOT EXISTS vehiculo(id INTEGER PRIMARY KEY AUTOINCREMENT, placa TEXT, modelo TEXT, marca TEXT, estado TEXT, liquidacionsem TEXT, liquidaciondomfes TEXT)';
    this.sqlObject.executeSql(sql, {})
      .then(() => console.log('SQL vehiculo Initialized'))
      .catch(e => console.log(e));
  }

  delete(vehiculo: VehiculoModel) {
    let sql = 'DELETE FROM vehiculo WHERE id=?';
    this.sqlObject.executeSql(sql, [vehiculo.id]);
  }

  getAll(): Promise<any> {

    let vehiculos = [];
    let sql = "select * from vehiculo ";
    let orderBy = " order by placa desc ";
    sql = sql + orderBy;

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, [])
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let record = response.rows.item(index);
            if (record) {
              vehiculos.push(record);
            }
          }
          resolve(vehiculos);
        })
        .catch(e => reject(e));
    });
  }

  getVehiculoByPlaca(placa: string): Promise<any> {

    let vehiculo = null;
    let sql = "select * from vehiculo where placa = ? ";

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, [placa])
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let record = response.rows.item(index);
            if (record) {
              vehiculo = record;
            }
          }
          resolve(vehiculo);
        })
        .catch(e => reject(e));
    });
  }

  update(vehiculo: VehiculoModel) {
    let sql = 'UPDATE vehiculo SET placa = ?, modelo = ?, marca= ?, estado = ?, liquidacionsem = ?, liquidaciondomfes = ? WHERE id=?';
    this.sqlObject.executeSql(sql, [vehiculo.placa, vehiculo.modelo, vehiculo.marca, vehiculo.estado]);
  }

  add(vehiculo: VehiculoModel) {
    return new Promise((resolve, reject) => {
      let sql = 'insert into vehiculo (placa,modelo,marca,estado,liquidacionsem,liquidaciondomfes) values (?,?,?,?,?,?)';
      this.sqlObject.executeSql(sql, [vehiculo.placa, vehiculo.modelo, vehiculo.marca, vehiculo.estado])
        .then(response => {
          resolve(response);
        })
        .catch(e => console.log(e));
    });
  }

  closeConnection() {
    this.sqlObject.close();
  }

}
