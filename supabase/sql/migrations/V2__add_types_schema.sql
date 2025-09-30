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

DROP TABLE currency;
CREATE TABLE currency (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    symbol TEXT NOT NULL
);

ALTER TABLE currency ENABLE ROW LEVEL SECURITY;

INSERT INTO currency (key, symbol) VALUES
    ('HUF', 'Ft'),
    ('RSD', 'RSD'),
    ('EUR', '€'),
    ('USD', '$'),
    ('GPB', '£');

DROP TABLE odometer_log_type;
CREATE TABLE odometer_log_type (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE
);

ALTER TABLE odometer_log_type ENABLE ROW LEVEL SECURITY;

INSERT INTO odometer_log_type (key) VALUES
    ('SERVICE'),
    ('FUEL'),
    ('SIMPLE');

DROP TABLE fuel_unit;
CREATE TABLE fuel_unit (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    short TEXT NOT NULL,
    conversion_factor NUMERIC NOT NULL
);

ALTER TABLE fuel_unit ENABLE ROW LEVEL SECURITY;

INSERT INTO fuel_unit (key, short, conversion_factor) VALUES
    ('LITER', 'L', 1),
    ('GALLON', 'gal', 3.78541), -- US gallon → liter
    ('CUBIC_METER', 'm³', 1000), -- 1 m³ → 1000 liter
    ('KWH', 'kWh', 9.5); -- 1 kWh ~ liter

DROP TABLE odometer_unit;
CREATE TABLE odometer_unit (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    short TEXT NOT NULL,
    conversion_factor NUMERIC NOT NULL
);

ALTER TABLE odometer_unit ENABLE ROW LEVEL SECURITY;

INSERT INTO odometer_unit (key, short, conversion_factor) VALUES
    ('KILOMETER', 'km', 1),
    ('MILE', 'mi', 1.60934); -- 1 mi → km

CREATE TABLE fuel_type (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE
);

INSERT INTO fuel_type (key) VALUES
('GASOLINE'),
('DIESEL'),
('ELECTRIC'),
('HYBRID'),
('LPG');

ALTER TABLE fuel_type ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_all_fuel_type ON fuel_type
    FOR SELECT USING (true);

CREATE POLICY "expense type owner and global can view" ON public.expense_type FOR SELECT TO authenticated USING ((owner_id IS NULL) OR (auth.uid() = owner_id));
CREATE POLICY "expense type owner can insert" ON public.expense_type FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "expense type update policy" ON public.expense_type FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "expense type delete policy" ON public.expense_type FOR DELETE TO authenticated USING (auth.uid() = owner_id);


CREATE POLICY select_all_currency ON currency FOR SELECT USING (true);

CREATE POLICY select_all_odometer_log_type ON odometer_log_type FOR SELECT USING (true);

CREATE POLICY select_all_fuel_unit ON fuel_unit FOR SELECT USING (true);

CREATE POLICY select_all_odometer_unit ON odometer_unit FOR SELECT USING (true);