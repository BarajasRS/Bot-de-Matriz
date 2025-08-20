require('dotenv').config();

const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require('@bot-whatsapp/bot');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MongoAdapter = require('@bot-whatsapp/database/mongo');


// ================= CONST DE TELÉFONOS =================
const PHONE_CAFETERIA_PB    = '481 119 2380';  // Cafetería (Plaza Bugambilias)
const PHONE_RESTAURANTE_979 = '481 145 3203';  // Restaurante (Plaza 979)
const PHONE_EXP_979         = '481 107 1673';  // Expendio Plaza 979
const PHONE_EXP_BUG         = '481 120 1783';  // Expendio Plaza Bugambilias


// ================= FLUJO DE BIENVENIDA =================
const flowWelcome = addKeyword(EVENTS.WELCOME).addAnswer(
  `☕ ¡Hola! Bienvenido a la Cafetería SEROGA 🍰  
El auténtico sabor de la Huasteca en cada bebida y antojo. 

Selecciona una opción escribiendo *solamente* el número:

1️⃣ Ver menú de Cafeteria 📋  
2️⃣ Horarios de atención 🕘  
3️⃣ ¿Dónde nos encontramos? 📍  
4️⃣ Realizar un pedido 🚗  
5️⃣ Sucursales y expendios 🏪  
6️⃣ Quiero dejar una queja o comentario 📩  
7️⃣ Problema con factura o asistencia 📄  
8️⃣ Promociones y eventos especiales 🎉
9️⃣ Ninguna de las anteriores ❓
🔟 Numero de contacto De Sucursales


Escribe *MENÚ* para volver a este listado.`
);

// ================= FLUJO MENÚ =================
const flowMenu = addKeyword(
  [/^\s*(?:menu|menú)\s*$/i],
  { regex: true }
).addAnswer(
  ` ☕ ¡Hola! Bienvenido a la Cafetería SEROGA 🍰  
El auténtico sabor de la Huasteca en cada bebida y antojo. 

Selecciona una opción escribiendo *solamente* el número:

1️⃣ Ver menú de Cafeteria 📋  
2️⃣ Horarios de atención 🕘  
3️⃣ ¿Dónde nos encontramos? 📍  
4️⃣ Realizar un pedido 🚗  
5️⃣ Sucursales y expendios 🏪  
6️⃣ Quiero dejar una queja o comentario 📩  
7️⃣ Problema con factura o asistencia 📄  
8️⃣ Promociones y eventos especiales 🎉
9️⃣ Ninguna de las anteriores ❓
🔟 Numero de contacto De Sucursales


Escribe *MENÚ* para volver a este listado.`
);

// ================= FLUJOS NUMÉRICOS =================
const flowVerMenu = addKeyword(
  [/^\s*1\s*$/],
  { regex: true }
).addAnswer(
  `📋 _Menú de Cafetería SEROGA:_  
Consulta nuestro menú actualizado con precios aquí:  
📲 https://drive.google.com/file/d/1Y6i5S0LNYWFvNVUss9qeeexdVO5fs6X-/view?usp=sharing

🔙 Escribe *MENÚ* para regresar.`
);

const flowHorarios = addKeyword(
  [/^\s*2\s*$/],
  { regex: true }
).addAnswer(
  `☕ Cafetería 
📍 Plaza Bugambilias, Blvd. México-Laredo #933
🕒 Horario: L-S: 7 am - 10 pm | Dom: 8 am - 10 pm
🔙 Escribe *MENÚ* para regresar`
);

const flowUbicacion = addKeyword(
  [/^\s*3\s*$/],
  { regex: true }
).addAnswer(
  `☕ Cafetería:
📍 Plaza Bugambilias, Blvd. México-Laredo #933

🔙 Escribe *MENÚ* para regresar.`
);

const flowPedido = addKeyword([/^\s*4\s*$/], { regex: true }).addAnswer(
  `🚗 ¿Quieres pedir algo delicioso?  
Puedes hacerlo fácilmente por estas opciones:

🛵 Uber Eats: Búscanos como “Restaurante SEROGA”  
🤝 Mandaditos: También puedes enviarlo con tu repartidor de confianza.

📌 Si deseas que preparemos tu pedido por este medio, por favor *indica claramente lo siguiente*:

🍽 Para alimentos:  
- Nombre del platillo  
- Cantidad  
- Observaciones (por ejemplo: sin cebolla, extra salsa, etc.)
(Si es otro platillo, especificar igualmente).

☕ Para cafés:  
- Tipo de café  
- ¿Caliente o helado?  
- Tamaño y tipo de leche (entera, deslactosada, light)  
- ¿Deseas leche de coco o almendra? (+13 $)  
- ¿Café descafeinado? (+10 $)  

 Para frappés y helados:  
- Todos los frappés llevan leche deslactosada  
- ¿Quieres leche de coco o almendra? (+10 $)  
- ¿Agregar tapiocas? (+5 $)

🔁 Cuando termines tu pedido, te confirmaremos disponibilidad y tiempos.  
🔙 Escribe MENÚ para regresar`
);


const flowSucursales = addKeyword(
  [/^\s*5\s*$/],
  { regex: true }
).addAnswer(
  `📍 ¿Dónde puedes encontrarnos?

Estos son nuestros puntos de venta oficiales en Ciudad Valles, SLP:

🍽 Restaurante 
📍 Plaza 979, Blvd. México-Laredo (frente a Burger King)
🕒 Horario: L-D: 7 am - 10:30 pm | 
☕ Expendio
📍 Plaza 979, Blvd. México-Laredo (frente a Burger King)
🕒 Horario: L-D: 7 am - 9 pm | 
☕ Cafetería 
📍 Plaza Bugambilias, Blvd. México-Laredo #933
🕒 Horario: L-S: 7 am - 10 pm | Dom: 8 am - 10 pm
☕ Expendio
📍 Plaza Bugambilias, Blvd. México-Laredo #933
🕒 Horario: L-S: 7 am - 10 pm | Dom: 8 am - 9 pm
🏬 Matriz (Centro)
📍 Mercado Municipal, Tramo #79, Zona Centro
🕒 Horario: L-S: 8 am - 1 pm y 4 pm - 8 pm | Dom: 8 am - 3 pm
(Martes cerrado)
🔙 Escribe *MENÚ* para regresar.`
);

const flowQueja = addKeyword([/^\s*6\s*$/], { regex: true }).addAnswer(
  `✉ ¿Tuviste algún detalle en tu visita o pedido?  
Cuéntanos a continuación para darte seguimiento y ayudarte lo antes posible. ¡Queremos seguir mejorando por ti! 😊

🔙 Escribe MENÚ para regresar.`
);


const flowFactura = addKeyword([/^\s*7\s*$/], { regex: true }).addAnswer(
  `📄 ¿Tienes algún problema con tu factura?  
Escríbenos en el siguiente mensaje detallando tu caso.
Necesitamos 
•Constancia de situación fiscal 
•Correo electrónico 
•Tipo de pago, en caso de ser con tarjeta especificar débito o crédito 
•Comprobante de la compra 

⚠ Recuerda: Las facturas solo pueden emitirse el mismo día de la compra.  
Gracias por tu comprensión.

🔙 Escribe MENÚ para regresar.
`
);

const flowPromociones = addKeyword(
  [/^\s*8\s*$/],
  { regex: true }
).addAnswer(
  `🎉 Promociones y eventos especiales  
¡Gracias por seguir nuestras novedades!  
Aquí anunciamos promociones como música en vivo, descuentos o regalos especiales. 🪗🎁

📲 Te recomendamos seguirnos en Facebook para estar al día:  
https://www.facebook.com/CafeSeroga

🔙 Escribe MENÚ para regresar.`
);

const flowNinguna = addKeyword([/^\s*9\s*$/], { regex: true }).addAnswer(
  `❓ _Ninguna de las anteriores_  
Por favor describe lo que nos quieres decir o tu problema y en un momento te atenderemos. 😊

🔙 Escribe *MENÚ* para regresar.`
);

const flowContacto = addKeyword([/^\s*10\s*$/], { regex: true }).addAnswer(
  `📞 *Información de contacto por sucursal* 📞
¿Quieres comunicarte directamente con alguno de nuestros puntos? Aquí te dejamos los números:

☕ Cafetería (Plaza Bugambilias)  
📲 ${PHONE_CAFETERIA_PB}

🍽️ Restaurante (Plaza 979)  

📲 ${PHONE_RESTAURANTE_979}

☕ Expendio Plaza 979  
📲 ${PHONE_EXP_979}

☕ Expendio Plaza Bugambilias  
📲 ${PHONE_EXP_BUG}

📝 Estamos para ayudarte con gusto en cualquiera de nuestras sucursales.  
🔙 Escribe *MENÚ* para regresar al inicio.`
);


// ================= FLUJO IGNORAR =================
const flowIgnorar = addKeyword(['']).addAction(async (ctx, { endFlow }) => {
  const msg = ctx.body.toLowerCase().trim();
  const valid = ['1','2','3','4','5','6','7','menu','menú'];
  if (!valid.includes(msg)) {
    // termina el flujo sin responder, permitiendo conversación libre
    return endFlow();
  }
});

// ================= INICIALIZACIÓN DEL BOT =================
const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: process.env.MONGO_DB_URI,
    dbName: process.env.MONGO_DB_NAME
  });

  const flow = createFlow([
    flowWelcome,
    flowMenu,
    flowVerMenu,
    flowHorarios,
    flowUbicacion,
    flowPedido,
    flowSucursales,
    flowQueja,
    flowFactura,
    flowPromociones,
    flowNinguna,
    flowContacto,
    flowIgnorar   // debe ir al final
  ]);

  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow,
    provider: adapterProvider,
    database: adapterDB
  });

  QRPortalWeb();
};

main();
