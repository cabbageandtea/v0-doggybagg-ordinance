-- DoggyBagg: Performance indexes for getUserProperties and compliance queries
-- Run after 006. Prevents slow-downs as user base grows.

-- Critical: getUserProperties filters by user_id and orders by created_at
create index if not exists idx_properties_user_id on public.properties(user_id);
create index if not exists idx_properties_user_created on public.properties(user_id, created_at desc);

-- Optional: filtering by reporting_status (e.g. dashboard status filter, violation counts)
create index if not exists idx_properties_reporting_status on public.properties(user_id, reporting_status);

-- Ordinances: join on property_id for compliance checks (predictPropertyRisk, generateComplianceCertificate)
-- 001 already has ordinances_property_id_idx; add violation_date for date-range queries
create index if not exists idx_ordinances_property_violation_date on public.ordinances(property_id, violation_date desc);
