CREATE TABLE public.car (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    owner uuid NOT NULL,
    name character VARYING NULL,
    brand character VARYING NULL,
    model character VARYING NULL,
    "modelYear" text NULL,
    image character VARYING NULL,
    "odometerMeasurement" character VARYING NULL,
    "odometerValue" bigint NULL,
    "fuelType" character VARYING NULL,
    "fuelTankSize" bigint NULL,
    "fuelValue" bigint NULL,
    "fuelMeasurement" character VARYING NULL,
    "createdAt" text NOT NULL DEFAULT ''::text,
    CONSTRAINT cars_pkey PRIMARY KEY (id),
    CONSTRAINT cars_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;