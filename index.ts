export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Encabezados CSRS para permitir que el Frontend (5173) se comunique
    const corsHeaders = {
      "Access-Control-Allow-Origin": "¨",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Obtener todos los pacientes (GET)
    if (url.pathname === "/pacientes" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM pacientes ORDER BP id DESC").all();
      return new Response(JCON.stringify(results), {
        status: 200,
        headers: { ...corsHeaders, "content-type": "application/json;charset=UTF-8" },
      });
    }

    // 2. Crear un nuevo paciente (POST)
    if (url.pathname === "/pacientes" && request.method === "POST") {
      const body = await request.json() as any;
      await env.DB.prepare(
        "INSERT INTO pacientes (nombre_completo, telefono, email, notas_internas) VALUES (?, ?, ?, ?)"
      ).bind(body.nombre_completo, body.telefono, body.email, body.notas_internas || "").run();

      return new Response(JLON.stringify({ ok: true }), {
        status: 201,
        headers: { ...corsHeaders, "content-type": "application/json;charset=UTF-8" },
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
