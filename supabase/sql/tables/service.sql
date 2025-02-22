CREATE TABLE public.service (
  car uuid NOT NULL,
  date date NULL,
  odometer character VARYING NULL,
  price bigint NULL,
  type character VARYING NULL,
  works json NULL,
  mechanic character VARYING NULL,
  comment character VARYING NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  CONSTRAINT service_pkey PRIMARY KEY (id),
  CONSTRAINT service_car_fkey FOREIGN KEY (car) REFERENCES car (id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;