CREATE SCHEMA IF NOT EXISTS bush_taxi;

ALTER TABLE public.members SET SCHEMA bush_taxi;
ALTER TABLE public.routes SET SCHEMA bush_taxi;
ALTER TABLE public.vehicles SET SCHEMA bush_taxi;
ALTER TABLE public.payments SET SCHEMA bush_taxi;
ALTER TABLE public.receipts SET SCHEMA bush_taxi;
ALTER TABLE public.penalties SET SCHEMA bush_taxi;
ALTER TABLE public.funeral_plans SET SCHEMA bush_taxi;

GRANT USAGE ON SCHEMA bush_taxi TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA bush_taxi TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA bush_taxi TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bush_taxi GRANT SELECT ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA bush_taxi GRANT ALL ON TABLES TO service_role;