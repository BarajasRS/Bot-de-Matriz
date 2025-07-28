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

const flowWelcome = addKeyword(EVENTS.WELCOME).addAnswer(
  `¡Hola! 😊 Bienvenido a Café SEROGA☕
¡Es un gusto atenderte desde nuestra sucursal del centro . Por favor, elige la opción que mejor se adapte a lo que necesitas:

Por favor escribe solo el número de la opción que te interesa (por ejemplo: 1)

📋 ¿Qué deseas consultar?
1️⃣ Ver precios del café
2️⃣ Conocer nuestras variedades de café
3️⃣ Información sobre pedidos y envíos
4️⃣ Número para hacer un pedido de Café SEROGA a toda la República  
5️⃣ ¿Dónde se encuentra Café SEROGA?
6️⃣ Numero de contacto De Sucursales
7️⃣ Quejas y aclaraciones
8️⃣ 👤 Hablar con personal 

🛒 También puedes pedir desde nuestro perfil en Mercado Libre:
https://listado.mercadolibre.com.mx/_CustId_1938105423

🔁 Puedes escribir “MENÚ” en cualquier momento para regresar a este listado. `
);

// ================= FLUJO MENÚ =================
const flowMenu = addKeyword(
  [/^\s*(?:menu|menú)\s*$/i],
  { regex: true }
).addAnswer(
  `¡Hola! 😊 Bienvenido a Café SEROGA☕
¡Es un gusto atenderte desde nuestra sucursal del centro . Por favor, elige la opción que mejor se adapte a lo que necesitas:
Por favor escribe solo el número de la opción que te interesa (por ejemplo: 1)

 Aquí está el menú nuevamente:

📋 ¿Qué deseas consultar?

1️⃣ Ver precios del café.
2️⃣ Conocer nuestras variedades de café.
3️⃣ Información sobre pedidos y envíos.
4️⃣ Número para hacer un pedido de Café SEROGA a toda la República. 
5️⃣ ¿Dónde se encuentra Café SEROGA?
6️⃣ Numero de contacto De Sucursales.
7️⃣ Quejas y aclaraciones.
8️⃣ 👤 Hablar con personal.


🛒 También puedes pedir desde nuestro perfil en Mercado Libre:
https://listado.mercadolibre.com.mx/_CustId_1938105423

🔁 Puedes escribir “MENÚ” en cualquier momento para regresar a este listado.
`
);

// ================= FLUJOS NUMÉRICOS =================
const flowPrecios = addKeyword([/^\s*1\s*$/], { regex: true }).addAnswer(
  `☕ Precios actualizados de nuestros cafés SEROGA
¡Elige tu favorito y haz tu pedido con confianza!

📦 Precio por kilo:
• Caracolillo: $400
• Supremo (mezcla Caracolillo y Planchuela): $400
• Mezcla Don Juan: $400
• Planchuela: $400
• Descafeinado: $435
• Oscuro: $355
• Huasteco: $330
• Xilitla: $330

📦 Presentaciones por paquete:
• Bolsa 10/4 (10 bolsas de 250 g): $750
• Caja 20/4 (20 bolsas de 250 g): $1,500
• Caja 10/2 (10 bolsas de 500 g): $1,500
• Caja 50B (50 sobres de 50 g): $860
• Bolsa 25B (25 sobres de 50 g): $430

💡 Si necesitas recomendación según el sabor que te gusta, vuelve al menú y elige la opción 2 para conocer nuestras variedades.

🔙 Escribe MENÚ para regresar al menú principal.`
);

const flowInfoCafe = addKeyword([/^\s*2\s*$/], { regex: true }).addAnswer(
  `📜 Conoce nuestras variedades de café SEROGA
Cada una tiene un perfil único de sabor y aroma, ¡descubre la que mejor se adapta a tu gusto! ☕

• Caracolillo – Fuerte e intenso, con aroma profundo. Para quienes aman un café robusto.
• Supremo – Mezcla equilibrada de Caracolillo y Planchuela (50/50). Sabor completo y redondo.
• Mezcla Don Juan – Nuestra mezcla especial: Huasteco, Caracolillo, Planchuela y un toque de Oscuro. Compleja y balanceada.
• Planchuela – Suave y con notas achocolatadas. Ideal si prefieres un café más ligero.
• Descafeinado – Todo el sabor, sin cafeína. Perfecto para disfrutar en cualquier momento.
• Oscuro – De tostado fuerte e intenso. Excelente para quienes disfrutan sabores más profundos.
• Huasteco – Tradicional y aromático. Un café clásico que nunca falla.
• Xilitla – Originario de la sierra. Aroma envolvente y sabor suave para todos los días.

🔙 Escribe MENÚ para regresar al menú principal.`
);

const flowPedidos = addKeyword([/^\s*3\s*$/], { regex: true }).addAnswer(
  `🚚 Información sobre pedidos y envíos

¡Llevamos el auténtico sabor de la Huasteca Potosina hasta la puerta de tu casa! ☕📦

📍 Envíos a todo México
• Costo de envío: $300 pesos (hasta 5 kilos de café).
• Si tu pedido supera los 5 kilos, el costo adicional es de $22 pesos por kilo extra.
• Tiempo estimado de entrega: entre 2 a 5 días hábiles, según tu ubicación.

💳 Formas de pago
• Transferencia o depósito bancario (te damos los datos cuando confirmas tu pedido).
• También puedes comprar por Mercado Libre si lo prefieres:
👉 https://listado.mercadolibre.com.mx/_CustId_1938105423

📝 ¿Cómo hacer tu pedido?
	1.	Indica la variedad de café y cuántos kilos deseas.
	2.	Proporciónanos tus datos completos:
• Nombre completo
• Dirección con código postal
• Teléfono de contacto
	3.	Te enviamos los datos de pago.
	4.	Una vez validado el pago, preparamos tu pedido y te compartimos la guía de rastreo.

📌 Tip: Puedes pedir desde 1 kilo en adelante. Te recomendamos aprovechar el envío pidiendo varios kilos. 😉

✅ Para continuar con tu pedido, regresa al MENÚ y selecciona la opción 4. Ahí te daremos el número para pedidos de café a toda la República. 📞

🔙 Escribe MENÚ para volver al menú principal.`
);

const flowHacerPedido = addKeyword([/^\s*4\s*$/], { regex: true }).addAnswer(
  `📲 Realizar un pedido
Para hacer tu pedido, por favor envía un mensaje de WhatsApp al siguiente número:
👉 +52 481 153 9541
Ahí te atenderemos con gusto para tomar tu orden y darte toda la información que necesites.

🕒 Horario de atención:
Todos los días de 7:00 am a 10 pm

🔙 Escribe MENÚ para regresar al listado principal.
`
);

const flowUbicacion = addKeyword([/^\s*5\s*$/], { regex: true }).addAnswer(
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
🔙 Escribe MENÚ para volver al menú principal.`
);

// ================= NUEVO: CONTACTO =================
const flowContacto = addKeyword([/^\s*6\s*$/], { regex: true }).addAnswer(
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

// ================= NUEVO: QUEJAS/ACLARACIONES =================
const flowQuejas = addKeyword([/^\s*7\s*$/], { regex: true }).addAnswer(
  `  ✉ Quejas, comentarios o aclaraciones ✉

En Café SEROGA nos importa tu experiencia.
Si tienes alguna queja, sugerencia o comentario sobre tu compra, atención o pedido, puedes escribirnos tu mensaje aquí mismo. 📩

Nuestro equipo lo revisará con atención y te daremos seguimiento lo antes posible.
¡Gracias por ayudarnos a mejorar! 

🔙 Escribe MENÚ para regresar al menú principal.    `
);

// ================= NUEVO: Personal =================
const flowPersonal = addKeyword([/^\s*8\s*$/], { regex: true }).addAnswer(
  `En Café SEROGA nos importa tu experiencia 🤝 ✉
Si necesitas ayuda personalizada, aclarar alguna situación o simplemente quieres comunicarte con nuestro equipo, por favor escribe tu mensaje a continuación y con gusto te atenderemos lo antes posible.

🔙 Escribe MENÚ para regresar al menú principal.    `
);


// ================= FLUJO IGNORAR =================
const flowIgnorar = addKeyword(['']).addAction(async (ctx, { endFlow }) => {
  const mensaje = ctx.body.toLowerCase().trim();
  const comandosExactos = ['1','2','3','4','5','6','7','8'];
  const comandosMenu    = ['menú','menu'];
  
  if (!comandosExactos.includes(mensaje) && !comandosMenu.includes(mensaje)) {
    return endFlow();
  }
});

// ================= INICIALIZACIÓN DEL BOT =================
const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: process.env.MONGO_DB_URI,
    dbName: "cafe-seroga"
  });

  const adapterFlow = createFlow([
    flowWelcome,
    flowMenu,
    flowPrecios,
    flowInfoCafe,
    flowPedidos,
    flowHacerPedido,
    flowUbicacion,
    flowContacto,
    flowQuejas,
    flowPersonal,
    flowIgnorar
  ]);

  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  });

  QRPortalWeb();
};

main();