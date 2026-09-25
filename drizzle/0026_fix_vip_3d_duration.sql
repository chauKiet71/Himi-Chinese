UPDATE "vip_plans"
SET "duration_days" = 3,
    "updated_at" = now()
WHERE upper(trim("code")) IN ('VIP_3D', 'VIP_3N')
  AND "duration_days" <> 3;
