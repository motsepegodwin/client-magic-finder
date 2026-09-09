ALTER TABLE bush_taxi.members
  ADD COLUMN IF NOT EXISTS vehicle_registration text,
  ADD COLUMN IF NOT EXISTS employment_duration text,
  ADD COLUMN IF NOT EXISTS employment_start_date date;

NOTIFY pgrst, 'reload schema';