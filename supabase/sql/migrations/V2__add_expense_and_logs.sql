DROP TABLE expense_type
CREATE TABLE expense_type
(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(64) NOT NULL DEFAULT 'OTHER',
    owner_id UUID, -- if no owner then its global
    FOREIGN KEY (owner_id) REFERENCES user_account (id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE expense_type ENABLE ROW LEVEL SECURITY;

INSERT INTO expense_type (key)
VALUES
('SERVICE'),
('FUEL'),
('VEHICLE_INSPECTION'),
('WASH'),
('TOLL'),
('PARKING'),
('INSURANCE'),
('11111111-1111-1111-1111-111111111111', 'OTHER');

DROP TABLE expense CASCADE;
CREATE TABLE expense
(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    car_id UUID NOT NULL,
    type_id UUID NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111',
    amount NUMERIC(10, 2) NOT NULL, -- price
    currency VARCHAR(3) NOT NULL, -- {'HUF', 'RSD', 'EUR', 'USD', 'GBP'...}
    note TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (car_id) REFERENCES car (id) ON UPDATE CASCADE ON DELETE CASCADE
    FOREIGN KEY (type_id) REFERENCES expense_type (id) ON UPDATE CASCADE ON DELETE SET DEFAULT
);

ALTER TABLE public.expense ENABLE ROW LEVEL SECURITY;

DROP TABLE fuel_log CASCADE;
CREATE TABLE fuel_log
(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    car_id UUID NOT NULL, -- because of powersync sync rule
    expense_id UUID NOT NULL,
    current_odometer BIGINT NOT NULL, -- current odometer value
    quantity NUMERIC(10,3) NOT NULL,
    price_per_unit NUMERIC(10,3) NOT NULL,
    unit VARCHAR(3) DEFAULT 'l' NOT NULL, --{ 'l', 'gal' }     unit VARCHAR(8) DEFAULT 'L' NOT NULL CHECK (unit IN ('L', 'GAL', 'KG'))
    FOREIGN KEY (expense_id) REFERENCES expense (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES car (id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE public.fuel_log ENABLE ROW LEVEL SECURITY;

CREATE TYPE odometer_log_type AS ENUM (
  'SERVICE',
  'FUEL',
  'SIMPLE'
);

DROP TABLE odometer_log CASCADE;
CREATE TABLE odometer_log
(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    car_id UUID NOT NULL,
    type odometer_log_type NOT NULL DEFAULT 'SIMPLE',
    value       BIGINT     DEFAULT 0    NOT NULL,
    unit VARCHAR(6) DEFAULT 'km' NOT NULL, --{ 'km', 'mi' }
    note TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (car_id) REFERENCES car (id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE public.odometer_log ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- expense - access via the linked car`s owner
CREATE POLICY "expense owner can view" ON public.expense FOR SELECT TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));
CREATE POLICY "expense owner can insert" ON public.expense FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));
CREATE POLICY "expense owner can update" ON public.expense FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id)) WITH CHECK ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));
CREATE POLICY "expense owner can delete" ON public.expense FOR DELETE TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));

-- fuel_log - access via the linked car`s owner
CREATE POLICY "fuel_log owner can view" ON public.fuel_log FOR SELECT TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car c JOIN public.expense e ON e.car_id = c.id WHERE e.id = expense_id));
CREATE POLICY "fuel_log owner can insert" ON public.fuel_log FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = (SELECT owner_id FROM public.car c JOIN public.expense e ON e.car_id = c.id WHERE e.id = expense_id));
CREATE POLICY "fuel_log owner can update" ON public.fuel_log FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car c JOIN public.expense e ON e.car_id = c.id WHERE e.id = expense_id)) WITH CHECK ((SELECT auth.uid()) = (SELECT owner_id FROM public.car c JOIN public.expense e ON e.car_id = c.id WHERE e.id = expense_id));
CREATE POLICY "fuel_log owner can delete" ON public.fuel_log FOR DELETE TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car c JOIN public.expense e ON e.car_id = c.id WHERE e.id = expense_id));

-- odometer_log - access via the linked car`s owner
CREATE POLICY "odometer_log owner can view" ON public.odometer_log FOR SELECT TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));
CREATE POLICY "odometer_log owner can insert" ON public.odometer_log FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));
CREATE POLICY "odometer_log owner can update" ON public.odometer_log FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id)) WITH CHECK ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));
CREATE POLICY "odometer_log owner can delete" ON public.odometer_log FOR DELETE TO authenticated USING ((SELECT auth.uid()) = (SELECT owner_id FROM public.car WHERE id = car_id));

-- Indexes to speed up the look‑ups used in the policies
CREATE INDEX idx_expense_car_id ON public.expense (car_id);
CREATE INDEX idx_expense_date ON public.expense (date);
CREATE INDEX idx_fuel_log_expense_id ON public.fuel_log (expense_id);
CREATE INDEX idx_odometer_log_car_id ON public.odometer_log (car_id);
CREATE INDEX idx_odometer_log_date ON public.odometer_log (date);