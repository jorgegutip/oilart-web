// netlify/functions/products.js
//
// Endpoint: /.netlify/functions/products
// GET     -> devuelve el catálogo público (sin necesidad de login)
// POST    -> añade o actualiza un producto (requiere sesión de Netlify Identity)
// DELETE  -> elimina un producto (requiere sesión de Netlify Identity)
//
// La lista completa de productos se guarda como un único objeto JSON
// en Netlify Blobs, bajo la clave "catalogo".

const { getStore } = require("@netlify/blobs");

const STORE_NAME = "oilart-productos";
const KEY = "catalogo";

function getAllowedEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAuthorized(context) {
  const user = context.clientContext && context.clientContext.user;
  if (!user) return { ok: false, reason: "No has iniciado sesión." };

  const allowed = getAllowedEmails();
  if (allowed.length && !allowed.includes((user.email || "").toLowerCase())) {
    return { ok: false, reason: "Este usuario no tiene permiso de administrador." };
  }
  return { ok: true, user };
}

exports.handler = async (event, context) => {
  const store = getStore(STORE_NAME);

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    if (event.httpMethod === "GET") {
      const list = (await store.get(KEY, { type: "json" })) || [];
      return { statusCode: 200, headers, body: JSON.stringify(list) };
    }

    if (event.httpMethod === "POST") {
      const auth = isAuthorized(context);
      if (!auth.ok) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: auth.reason }) };
      }

      const body = JSON.parse(event.body || "{}");
      const product = body.product;
      if (!product || !product.nombre || !product.descripcion || !product.imagen) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Faltan datos del producto." }) };
      }

      let list = (await store.get(KEY, { type: "json" })) || [];

      if (body.action === "update" && product.id) {
        list = list.map((p) => (p.id === product.id ? product : p));
      } else {
        product.id = "p_" + Date.now();
        list.push(product);
      }

      await store.setJSON(KEY, list);
      return { statusCode: 200, headers, body: JSON.stringify(list) };
    }

    if (event.httpMethod === "DELETE") {
      const auth = isAuthorized(context);
      if (!auth.ok) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: auth.reason }) };
      }

      const body = JSON.parse(event.body || "{}");
      let list = (await store.get(KEY, { type: "json" })) || [];
      list = list.filter((p) => p.id !== body.id);

      await store.setJSON(KEY, list);
      return { statusCode: 200, headers, body: JSON.stringify(list) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método no permitido" }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Error del servidor: " + err.message }) };
  }
};
