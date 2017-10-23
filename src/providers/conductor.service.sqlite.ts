import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VehiculoModel } from '../models/vehiculo.model';
import { ConductorModel } from "../models/conductor.model";

@Injectable()
export class ConductorSqliteService {

  private dbConfig = { name: 'data.db', location: 'default' };
  private sqlObject: SQLiteObject;

  constructor(private sqlite: SQLite) { }

  openDataBase() {
    return this.sqlite.create(this.dbConfig).then((db: SQLiteObject) => {
      this.sqlObject = db;
      this.createTable();
    });
  }

  createTable() {
    let sql = 'CREATE TABLE IF NOT EXISTS conductor(id INTEGER PRIMARY KEY AUTOINCREMENT, cedula TEXT, nombres TEXT, apellidos TEXT, fechaIngreso TEXT, telefonoFijo TEXT, celular TEXT, direccion TEXT, foto TEXT, '+
              ' vehiculo TEXT, quienllamar TEXT, telefonoquienllamar TEXT, paseactivo TEXT, vencimientopase TEXT, tarjetaamarilla TEXT)';
    this.sqlObject.executeSql(sql, {})
      .then(() => console.log('SQL conductor Initialized'))
      .catch(e => console.log(e));
  }

  delete(conductor: ConductorModel) {
    let sql = 'DELETE FROM conductor WHERE id=?';
    this.sqlObject.executeSql(sql, [conductor.id]);
  }

  getAll(): Promise<any> {

    let conductores = [];
    let sql = "select * from conductor ";
    let orderBy = " order by vehiculo desc ";
    sql = sql + orderBy;

    return new Promise((resolve, reject) => {
      this.sqlObject.executeSql(sql, [])
        .then(response => {
          for (let index = 0; index < response.rows.length; index++) {
            let record = response.rows.item(index);
            if (record) {        
              conductores.push(record);
            }
          }
          resolve(conductores);
        })
        .catch(e => reject(e));
    });
  }

  update(conductor: ConductorModel) {
    let sql = 'UPDATE conductor SET cedula = ?, nombres = ?, apellidos = ?, fechaIngreso = ?, telefonoFijo = ?, celular = ?, direccion = ?, foto = ?, vehiculo = ?, quienllamar = ?, '+
              ' telefonoquienllamar = ?, paseactivo = ?, vencimientopase = ?, tarjetaamarilla = ?  WHERE id=?';
    this.sqlObject.executeSql(sql, [conductor.cedula, conductor.nombres, conductor.apellidos, conductor.fechaIngreso, conductor.telefonoFijo, conductor.celular,
    conductor.direccion, conductor.foto, conductor.vehiculo, conductor.quienllamar, conductor.telefonoquienllamar, conductor.paseactivo, conductor.vencimientopase, conductor.tarjetaamarilla]);
  }

  add(conductor: ConductorModel) {
    return new Promise((resolve, reject) => {
      let sql = ' insert into conductor (cedula, nombres, apellidos, fechaIngreso, telefonoFijo, celular, direccion, foto, vehiculo, quienllamar, telefonoquienllamar, '+
                ' paseactivo, vencimientopase, tarjetaamarilla) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
      this.sqlObject.executeSql(sql, [conductor.cedula, conductor.nombres, conductor.apellidos, conductor.fechaIngreso, conductor.telefonoFijo, conductor.celular,
      conductor.direccion, conductor.foto, conductor.vehiculo, conductor.quienllamar, conductor.telefonoquienllamar, conductor.paseactivo, conductor.vencimientopase, conductor.tarjetaamarilla])
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
