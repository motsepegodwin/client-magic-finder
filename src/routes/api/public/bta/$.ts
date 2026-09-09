import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const fail = (message: string, status = 400) =>
  json({ success: false, error: message }, status);

async function db() {
  const { bushTaxiDb } = await import("@/integrations/bushtaxi/client.server");
  return bushTaxiDb();
}

const MEMBER_SELECT = "*, routes(id, route_name, route_code)";

function memberFields(body: Record<string, unknown>) {
  const allowed = [
    "member_number",
    "initials",
    "surname",
    "first_names",
    "id_number",
    "phone",
    "email",
    "province",
    "municipality",
    "route_id",
    "route_taxi_line",
    "vehicle_count",
    "address",
    "notes",
    "status",
  ];
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key] === "" ? null : body[key];
  }
  return out;
}

async function handle(request: Request, splat: string) {
  const url = new URL(request.url);
  const path = "/" + splat.replace(/^\/+/, "");
  const supabase = await db();
  const method = request.method.toUpperCase();
  const q = (url.searchParams.get("q") || "").trim();
  const id = url.searchParams.get("id");

  if (path === "/dashboard") {
    const [members, vehicles, routes, payments] = await Promise.all([
      supabase.from("members").select("id", { count: "exact", head: true }),
      supabase.from("vehicles").select("id", { count: "exact", head: true }),
      supabase.from("routes").select("id", { count: "exact", head: true }),
      supabase.from("payments").select("amount"),
    ]);
    const total = (payments.data || []).reduce(
      (s: number, p: { amount: number | string }) => s + Number(p.amount || 0),
      0,
    );
    return json({
      success: true,
      members: members.count || 0,
      vehicles: vehicles.count || 0,
      routes: routes.count || 0,
      total_collections: total,
    });
  }

  if (path === "/members") {
    if (method === "GET") {
      let query = supabase.from("members").select(MEMBER_SELECT).order("member_number");
      if (id) query = query.eq("id", id);
      if (q) {
        const like = `%${q}%`;
        query = query.or(
          [
            "surname",
            "first_names",
            "initials",
            "id_number",
            "phone",
            "email",
            "municipality",
            "province",
            "member_number",
            "route_taxi_line",
          ]
            .map((c) => `${c}.ilike.${like}`)
            .join(","),
        );
      }
      const { data, error } = await query.limit(200);
      if (error) return fail(error.message, 500);
      return json({ success: true, members: data || [] });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (method === "POST") {
      const fields = memberFields(body);
      if (!fields['surname']) return fail("Surname is required");
      if (!fields['member_number']) {
        const { data: last } = await supabase
          .from("members")
          .select("member_number")
          .not("member_number", "is", null)
          .order("member_number", { ascending: false })
          .limit(1);
        const lastNum = Number(String(last?.[0]?.member_number || "").replace(/\D/g, "")) || 0;
        fields['member_number'] = "BTA-" + String(lastNum + 1).padStart(4, "0");
      }
      const { data, error } = await supabase
        .from("members")
        .insert(fields as never)
        .select(MEMBER_SELECT)
        .single();
      if (error) return fail(error.message, 500);
      return json({ success: true, member: data });
    }

    if (method === "PUT") {
      if (!id) return fail("Member id is required");
      const { data, error } = await supabase
        .from("members")
        .update({ ...memberFields(body), updated_at: new Date().toISOString() } as never)
        .eq("id", id)
        .select(MEMBER_SELECT)
        .single();
      if (error) return fail(error.message, 500);
      return json({ success: true, member: data });
    }
  }

  if (path === "/routes" && method === "GET") {
    const { data, error } = await supabase.from("routes").select("*").order("route_code");
    if (error) return fail(error.message, 500);
    return json({ success: true, routes: data || [] });
  }

  if (path === "/vehicles" && method === "GET") {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, members(id, first_names, surname)")
      .order("registration_number");
    if (error) return fail(error.message, 500);
    return json({ success: true, vehicles: data || [] });
  }

  if (path === "/penalties" && method === "GET") {
    const { data, error } = await supabase
      .from("penalties")
      .select("*, members(id, first_names, surname), vehicles(registration_number)")
      .order("created_at", { ascending: false });
    if (error) return fail(error.message, 500);
    return json({ success: true, penalties: data || [] });
  }

  if (path === "/funeral-plans" && method === "GET") {
    const { data, error } = await supabase
      .from("funeral_plans")
      .select("*, members(id, first_names, surname)")
      .order("created_at", { ascending: false });
    if (error) return fail(error.message, 500);
    return json({ success: true, funeral_plans: data || [] });
  }

  if (path === "/receipts" && method === "GET") {
    const { data, error } = await supabase
      .from("receipts")
      .select("*, members(id, first_names, surname)")
      .order("receipt_date", { ascending: false });
    if (error) return fail(error.message, 500);
    return json({ success: true, receipts: data || [] });
  }

  if (path === "/payments") {
    if (method === "GET") {
      const { data, error } = await supabase
        .from("payments")
        .select("*, members(id, first_names, surname)")
        .order("payment_date", { ascending: false });
      if (error) return fail(error.message, 500);
      return json({ success: true, payments: data || [] });
    }

    if (method === "POST") {
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const memberId = body['member_id'] ? String(body['member_id']) : "";
      const amount = Number(body['amount']);
      if (!memberId) return fail("Select a member first");
      if (!amount || amount <= 0) return fail("Enter a valid amount");

      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id, first_names, surname")
        .eq("id", memberId)
        .single();
      if (memberError || !member) return fail("Member not found", 404);

      const payment = {
        member_id: memberId,
        amount,
        payment_method: String(body['payment_method'] || "cash"),
        payment_type: String(body['payment_type'] || "membership"),
        reference_number: (body['reference_number'] as string) || null,
        received_by: (body['received_by'] as string) || null,
        notes: (body['notes'] as string) || null,
      };
      const { data: savedPayment, error: paymentError } = await supabase
        .from("payments")
        .insert(payment as never)
        .select("*")
        .single();
      if (paymentError) return fail(paymentError.message, 500);

      const { data: lastReceipt } = await supabase
        .from("receipts")
        .select("receipt_number")
        .order("receipt_number", { ascending: false })
        .limit(1);
      const lastNum = Number(String(lastReceipt?.[0]?.receipt_number || "").replace(/\D/g, "")) || 1000;
      const receipt = {
        payment_id: savedPayment.id,
        member_id: memberId,
        receipt_number: "BTA-" + (lastNum + 1),
        received_from: [member.first_names, member.surname].filter(Boolean).join(" "),
        amount,
        payment_method: payment.payment_method,
        payment_type: payment.payment_type,
      };
      const { data: savedReceipt, error: receiptError } = await supabase
        .from("receipts")
        .insert(receipt as never)
        .select("*, members(id, first_names, surname)")
        .single();
      if (receiptError) return fail(receiptError.message, 500);

      return json({ success: true, payment: savedPayment, receipt: savedReceipt });
    }
  }

  return fail("Unknown endpoint " + path, 404);
}

export const Route = createFileRoute("/api/public/bta/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => handle(request, (params as { _splat?: string })._splat || ""),
      POST: async ({ request, params }) => handle(request, (params as { _splat?: string })._splat || ""),
      PUT: async ({ request, params }) => handle(request, (params as { _splat?: string })._splat || ""),
    },
  },
});
