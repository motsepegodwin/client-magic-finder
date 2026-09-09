CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_code TEXT,
  route_name TEXT NOT NULL,
  origin TEXT,
  destination TEXT,
  fee_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_number TEXT UNIQUE,
  initials TEXT,
  surname TEXT NOT NULL,
  first_names TEXT,
  id_number TEXT,
  phone TEXT,
  email TEXT,
  province TEXT DEFAULT 'Mpumalanga',
  municipality TEXT,
  route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
  route_taxi_line TEXT,
  vehicle_count INTEGER NOT NULL DEFAULT 0,
  address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  registration_number TEXT NOT NULL,
  make TEXT,
  model TEXT,
  permit_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_type TEXT NOT NULL DEFAULT 'membership',
  reference_number TEXT,
  received_by TEXT,
  notes TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  receipt_number TEXT NOT NULL UNIQUE,
  receipt_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  received_from TEXT,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_type TEXT NOT NULL DEFAULT 'membership',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.penalties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'outstanding',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.funeral_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  monthly_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  dependants_count INTEGER NOT NULL DEFAULT 0,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE SEQUENCE public.receipt_seq START 1001;

GRANT ALL ON public.routes, public.members, public.vehicles, public.payments, public.receipts, public.penalties, public.funeral_plans TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.receipt_seq TO service_role;
GRANT SELECT ON public.routes, public.members, public.vehicles, public.payments, public.receipts, public.penalties, public.funeral_plans TO authenticated;

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funeral_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in staff can view routes" ON public.routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in staff can view members" ON public.members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in staff can view vehicles" ON public.vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in staff can view payments" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in staff can view receipts" ON public.receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in staff can view penalties" ON public.penalties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed-in staff can view funeral plans" ON public.funeral_plans FOR SELECT TO authenticated USING (true);

INSERT INTO public.routes (id, route_code, route_name, origin, destination, fee_amount) VALUES
 ('11111111-1111-4111-8111-000000000001','BTA-R01','Bushbuckridge - Hazyview','Bushbuckridge','Hazyview',65.00),
 ('11111111-1111-4111-8111-000000000002','BTA-R02','Bushbuckridge - Acornhoek','Bushbuckridge','Acornhoek',40.00),
 ('11111111-1111-4111-8111-000000000003','BTA-R03','Thulamahashe - Nelspruit','Thulamahashe','Mbombela',150.00),
 ('11111111-1111-4111-8111-000000000004','BTA-R04','Mkhuhlu - Hazyview','Mkhuhlu','Hazyview',55.00);

INSERT INTO public.members (id, member_number, initials, surname, first_names, id_number, phone, email, municipality, route_id, route_taxi_line, vehicle_count, status) VALUES
 ('22222222-2222-4222-8222-000000000001','BTA-0001','S M','Mnisi','Sipho Mandla','8503125678083','0731234567','sipho.mnisi@example.co.za','Bushbuckridge','11111111-1111-4111-8111-000000000001','Bushbuckridge - Hazyview',2,'active'),
 ('22222222-2222-4222-8222-000000000002','BTA-0002','T N','Nkosi','Thandi Nomsa','9007140123084','0824567890','thandi.nkosi@example.co.za','Bushbuckridge','11111111-1111-4111-8111-000000000002','Bushbuckridge - Acornhoek',1,'active'),
 ('22222222-2222-4222-8222-000000000003','BTA-0003','J K','Mathebula','Jabulani Kenneth','7811025432087','0715558822','jabulani.mathebula@example.co.za','Thulamahashe','11111111-1111-4111-8111-000000000003','Thulamahashe - Nelspruit',3,'active'),
 ('22222222-2222-4222-8222-000000000004','BTA-0004','P R','Chiloane','Precious Refilwe','9204236789081','0762223344','precious.chiloane@example.co.za','Mkhuhlu','11111111-1111-4111-8111-000000000004','Mkhuhlu - Hazyview',1,'active'),
 ('22222222-2222-4222-8222-000000000005','BTA-0005','L B','Ubisi','Lucky Bongani','8809118765082','0798887766','lucky.ubisi@example.co.za','Bushbuckridge','11111111-1111-4111-8111-000000000001','Bushbuckridge - Hazyview',2,'suspended');

INSERT INTO public.vehicles (id, member_id, registration_number, make, model, permit_number, status) VALUES
 ('33333333-3333-4333-8333-000000000001','22222222-2222-4222-8222-000000000001','JHB 452 MP','Toyota','Quantum Ses''fikile','PRM-10021','active'),
 ('33333333-3333-4333-8333-000000000002','22222222-2222-4222-8222-000000000001','KMR 118 MP','Toyota','Quantum Ses''fikile','PRM-10022','active'),
 ('33333333-3333-4333-8333-000000000003','22222222-2222-4222-8222-000000000002','LTZ 903 MP','Nissan','NV350 Impendulo','PRM-10035','active'),
 ('33333333-3333-4333-8333-000000000004','22222222-2222-4222-8222-000000000003','MPB 774 MP','Toyota','Quantum Ses''fikile','PRM-10048','active'),
 ('33333333-3333-4333-8333-000000000005','22222222-2222-4222-8222-000000000004','NDX 216 MP','Mercedes-Benz','Sprinter','PRM-10052','inactive');

INSERT INTO public.payments (id, member_id, amount, payment_method, payment_type, reference_number, received_by, payment_date) VALUES
 ('44444444-4444-4444-8444-000000000001','22222222-2222-4222-8222-000000000001',850.00,'cash','membership','REF-2026-001','BTA Administrator', now() - interval '21 days'),
 ('44444444-4444-4444-8444-000000000002','22222222-2222-4222-8222-000000000002',400.00,'eft','route','REF-2026-002','BTA Administrator', now() - interval '14 days'),
 ('44444444-4444-4444-8444-000000000003','22222222-2222-4222-8222-000000000003',1200.00,'card','membership','REF-2026-003','BTA Administrator', now() - interval '9 days'),
 ('44444444-4444-4444-8444-000000000004','22222222-2222-4222-8222-000000000004',300.00,'mobile','funeral_plan','REF-2026-004','BTA Administrator', now() - interval '5 days'),
 ('44444444-4444-4444-8444-000000000005','22222222-2222-4222-8222-000000000005',500.00,'cash','penalty','REF-2026-005','BTA Administrator', now() - interval '2 days');

INSERT INTO public.receipts (payment_id, member_id, receipt_number, receipt_date, received_from, amount, payment_method, payment_type) VALUES
 ('44444444-4444-4444-8444-000000000001','22222222-2222-4222-8222-000000000001','BTA-1001', now() - interval '21 days','Sipho Mandla Mnisi',850.00,'cash','membership'),
 ('44444444-4444-4444-8444-000000000002','22222222-2222-4222-8222-000000000002','BTA-1002', now() - interval '14 days','Thandi Nomsa Nkosi',400.00,'eft','route'),
 ('44444444-4444-4444-8444-000000000003','22222222-2222-4222-8222-000000000003','BTA-1003', now() - interval '9 days','Jabulani Kenneth Mathebula',1200.00,'card','membership'),
 ('44444444-4444-4444-8444-000000000004','22222222-2222-4222-8222-000000000004','BTA-1004', now() - interval '5 days','Precious Refilwe Chiloane',300.00,'mobile','funeral_plan'),
 ('44444444-4444-4444-8444-000000000005','22222222-2222-4222-8222-000000000005','BTA-1005', now() - interval '2 days','Lucky Bongani Ubisi',500.00,'cash','penalty');

SELECT setval('public.receipt_seq', 1005, true);

INSERT INTO public.penalties (member_id, vehicle_id, reason, amount, amount_paid, status) VALUES
 ('22222222-2222-4222-8222-000000000005','33333333-3333-4333-8333-000000000001','Operating outside allocated rank',500.00,500.00,'paid'),
 ('22222222-2222-4222-8222-000000000003','33333333-3333-4333-8333-000000000004','Overloading passengers',750.00,250.00,'outstanding'),
 ('22222222-2222-4222-8222-000000000002','33333333-3333-4333-8333-000000000003','Missed association meeting',200.00,0.00,'outstanding');

INSERT INTO public.funeral_plans (member_id, plan_name, monthly_amount, dependants_count, balance, status) VALUES
 ('22222222-2222-4222-8222-000000000001','Family Plan A',150.00,4,0.00,'active'),
 ('22222222-2222-4222-8222-000000000003','Family Plan B',220.00,6,440.00,'active'),
 ('22222222-2222-4222-8222-000000000004','Single Plan',90.00,1,90.00,'active');