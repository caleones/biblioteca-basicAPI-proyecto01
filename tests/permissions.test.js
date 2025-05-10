const request = require("supertest");
const app = require("../src/server");
const mongoose = require("mongoose");
const connectDB = require("../src/database");
const UserModel = require("../src/models/user.model");
const BookModel = require("../src/models/book.model");
const ReservationModel = require("../src/models/reservation.model");
const jwt = require('jsonwebtoken');


let users = {};     // { roleName: { _id, token } }
let bookIds = [];   // libros creados
let reservationId;

beforeAll(async () => {
  await connectDB();
  await UserModel.deleteMany({});
  await BookModel.deleteMany({});
  await ReservationModel.deleteMany({});

  // 1) Crear 20 usuarios con distintos permisos
  const roles = [
    { name: "creadorDeLibros",       permisos: ["crear_libro"] },
    { name: "modificadorDeLibros",       permisos: ["modificar_libro"] },
    { name: "deshabilitadorDeLibros",       permisos: ["inhabilitar_libro"] },
    { name: "modificadorDeUsuarios",       permisos: ["modificar_usuario"] },
    { name: "deshabilitadorDeUsuarios",       permisos: ["inhabilitar_usuario"] },
    { name: "Dios",      permisos: ["crear_libro","modificar_libro","inhabilitar_libro","modificar_usuario","inhabilitar_usuario"] },
    { name: "adminNoCreadorDeLibros", permisos: ["modificar_libro","inhabilitar_libro","modificar_usuario","inhabilitar_usuario"] },
    { name: "adminNoModificadorDeLibros",   permisos: ["crear_libro","inhabilitar_libro","modificar_usuario","inhabilitar_usuario"] },
    { name: "adminNoModificadorDeUsuarios",   permisos: ["crear_libro","modificar_libro","inhabilitar_libro","inhabilitar_usuario"] },
    { name: "adminNoDeshabilitadorDeLibros",   permisos: ["crear_libro","modificar_libro","modificar_usuario","inhabilitar_usuario"] },
    { name: "adminNoDeshabilitadorDeUsuarios",   permisos: ["crear_libro","modificar_libro","inhabilitar_libro","modificar_usuario"] },
    // 9 administradores parcializados, faltan 9 usuarios sin permiso
  ];
  // añade 9 usuarios “normalX” sin permisos
  for(let i=1; i<=12; i++){
    roles.push({ name: `usuarioSinPermisos${i}`, permisos: [] });
  }

  let id = 0;

  // registra y hace login    ////////////////// CAMBIA LOS USUARIOS
  for(const {name, permisos} of roles){
    const correo = `${name}@test.com`;
    await request(app).post("/api/users").send({
      id,
      nombre: name,
      correo,
      contraseña: "pass123",
      permisos
    });
    
    const res = await request(app)
    .post("/api/login")
    .send({ correo, contraseña: "pass123" });


    const decodedToken = jwt.decode(res.body.token);
    users[name] = { id: decodedToken.id, token: res.body.token };
    console.log(`Usuario ${name} creado con ID: ${decodedToken.id}`);
    id++;
  }
}, 10000); // 10 segundos para crear usuarios

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Permisos y flujos básicos", () => {

  test("normal NO puede crear libro", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${users.usuarioSinPermisos1.token}`)
      .send({ titulo:"X", autor:"Y" });
    expect(res.statusCode).toBe(403);
  });

  test("admin NO creador de libros NO puede crear libro", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${users.adminNoCreadorDeLibros.token}`)
      .send({ titulo:"X", autor:"Y" });
    expect(res.statusCode).toBe(403);
  });

  test("creador de libros crea 20 libros", async () => {
    for(let i=1; i<=20; i++){
      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${users.creadorDeLibros.token}`)
        .send({ titulo:`Book ${i}`, autor:"Autor" });
      expect(res.statusCode).toBe(201);
      bookIds.push(res.body.book._id);
    }
    expect(bookIds.length).toBe(20);
  });

  test("normal NO puede modificar libro", async () => {
    const res = await request(app)
      .put(`/api/books/${bookIds[0]}`)
      .set("Authorization", `Bearer ${users.usuarioSinPermisos2.token}`)
      .send({ titulo:"XXX" });
    expect(res.statusCode).toBe(403);
  });

  test("admin NO modificador de libros NO puede modificar libro", async () => {
    const res = await request(app)
      .put(`/api/books/${bookIds[0]}`)
      .set("Authorization", `Bearer ${users.adminNoModificadorDeLibros.token}`)
      .send({ titulo:"YYY" });
    expect(res.statusCode).toBe(403);
  });

  test("admin modificador de libros modifica un libro", async () => {
    const res = await request(app)
      .put(`/api/books/${bookIds[0]}`)
      .set("Authorization", `Bearer ${users.modificadorDeLibros.token}`)
      .send({ titulo:"Zzz" });
    expect(res.statusCode).toBe(200);
    expect(res.body.book.titulo).toBe("Zzz");
  });

  test("admin modificador de libros NO puede deshabilitar libros", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookIds[1]}`)
      .set("Authorization", `Bearer ${users.modificadorDeLibros.token}`);
    expect(res.statusCode).toBe(403);
  });

  test("admin NO modificador de usuarios NO puede modificar otro usuario", async () => {
    const target = users.usuarioSinPermisos4;
    const res = await request(app)
      .put(`/api/users/${target.id}`)
      .set("Authorization", `Bearer ${users.adminNoModificadorDeUsuarios.token}`)
      .send({ nombre:"Hacker" });
    expect(res.statusCode).toBe(403);
  });

  test("normal NO puede deshabilitar libro", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookIds[2]}`)
      .set("Authorization", `Bearer ${users.usuarioSinPermisos6.token}`);
    expect(res.statusCode).toBe(403);
  });

  test("admin NO deshabilitador de libros NO puede inhabilitar libro", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookIds[2]}`)
      .set("Authorization", `Bearer ${users.adminNoDeshabilitadorDeLibros.token}`);
    expect(res.statusCode).toBe(403);
  });

  test("deshabilitador de libros deshabilita un libro", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookIds[2]}`)
      .set("Authorization", `Bearer ${users.deshabilitadorDeLibros.token}`);
    expect(res.statusCode).toBe(200);
    const b = await BookModel.findById(bookIds[2]);
    expect(b.habilitado).toBe(false);
  });

  test("normal reserva libro habilitado y disponible", async () => {
    const id = bookIds[3];
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${users.usuarioSinPermisos7.token}`)
      .send({ libro:id, fechaEntrega: new Date(Date.now()+86400000) });
    expect(res.statusCode).toBe(201);
    reservationId = res.body.reservation._id;
  });

  test("normal reserva libro habilitado y NO disponible y NO tiene éxito", async () => {
    await BookModel.findByIdAndUpdate(bookIds[4],{ disponibilidad:false, habilitado:true });
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${users.usuarioSinPermisos8.token}`)
      .send({ libro:bookIds[4], fechaEntrega:new Date(Date.now()+86400000) });
    expect(res.statusCode).toBe(400);
  });

  test("normal reserva libro NO habilitado y disponible y NO tiene éxito", async () => {
    await BookModel.findByIdAndUpdate(bookIds[5],{ disponibilidad:true, habilitado:false });
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${users.usuarioSinPermisos9.token}`)
      .send({ libro:bookIds[5], fechaEntrega:new Date(Date.now()+86400000) });
    expect(res.statusCode).toBe(400);
  });

  test("admin modificador de usuarios NO puede inhabilitar otro usuario", async () => {
    const target = users.usuarioSinPermisos11;
    const res = await request(app)
    .delete(`/api/users/${target.id}`)
    .set("Authorization", `Bearer ${users.modificadorDeUsuarios.token}`);
    expect(res.statusCode).toBe(403); // Corregido: esperar 403 en lugar de 200
  });








  test("deshabilitador de usuarios inhabilita un usuario", async () => {
    const target = users.usuarioSinPermisos7;

    console.log("Usuario objetivo:", target);


    const res = await request(app)
      .delete(`/api/users/${target.id}`)
      .set("Authorization", `Bearer ${users.deshabilitadorDeLibros.token}`);
    expect(res.statusCode).toBe(200);
    // Verificar que el usuario fue deshabilitado
    const u = await UserModel.findById(target.id);
    expect(u.habilitado).toBe(false);
  });

  test("Dios modifica otro usuario", async () => {
    const target = users.usuarioSinPermisos8;

    console.log("ID del usuario objetivo:", target._id);

    const res = await request(app)
      .put(`/api/users/${target.id}`)
      .set("Authorization", `Bearer ${users.Dios.token}`)
      .send({ nombre: "ModifiedByGod" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.nombre).toBe("ModifiedByGod");
  });

  test("Dios se modifica a sí mismo", async () => {
    const me = users.Dios;

    console.log("ID del usuario objetivo:", me._id);

    const res = await request(app)
      .put(`/api/users/${me.id}`)
      .set("Authorization", `Bearer ${me.token}`)
      .send({ nombre: "GodRenamed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.nombre).toBe("GodRenamed");
  });

  test("Dios inhabilita un usuario", async () => {
    const target = users.usuarioSinPermisos9;

    console.log("ID del usuario objetivo:", target._id);

    const res = await request(app)
      .delete(`/api/users/${target.id}`)
      .set("Authorization", `Bearer ${users.Dios.token}`);
    expect(res.statusCode).toBe(200);
    // Verificar que el usuario fue deshabilitado
    const u = await UserModel.findById(target.id);
    expect(u.habilitado).toBe(false);
  });

  test("normal se modifica a sí mismo", async () => {
    const me = users.usuarioSinPermisos3;

    console.log("ID del usuario objetivo:", me._id);

    const res = await request(app)
      .put(`/api/users/${me.id}`)
      .set("Authorization", `Bearer ${me.token}`)
      .send({ nombre:"MeAgain" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.nombre).toBe("MeAgain");
  });

  test("admin modificador de usuarios modifica otro usuario", async () => {
    const target = users.usuarioSinPermisos5;

    console.log("ID del usuario objetivo:", target._id);

    const res = await request(app)
      .put(`/api/users/${target.id}`)
      .set("Authorization", `Bearer ${users.modificadorDeUsuarios.token}`)
      .send({ nombre:"Fixed" });
    expect(res.statusCode).toBe(200);
  });

  /*test("normal termina reserva", async () => {
    const res = await request(app)
      .put(`/api/reservations/${reservationId}/end`)
      .set("Authorization", `Bearer ${users.usuarioSinPermisos7.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.reservation.devuelto).toBe(true);
  });*/

});
