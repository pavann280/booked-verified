
CREATE TYPE public.app_role AS ENUM ('admin','customer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), COALESCE(NEW.email,''), NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.services (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 30
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.providers (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  reviews integer NOT NULL DEFAULT 0,
  slots text[] NOT NULL DEFAULT '{}',
  service_id text REFERENCES public.services(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.providers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.providers TO authenticated;
GRANT ALL ON public.providers TO service_role;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers public read" ON public.providers FOR SELECT USING (true);
CREATE POLICY "providers admin write" ON public.providers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id text NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  service_name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  appointment_date date NOT NULL,
  time_slot text NOT NULL,
  status text NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed','Completed','Cancelled')),
  price integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX appointments_no_double_booking
  ON public.appointments (provider_id, appointment_date, time_slot)
  WHERE status <> 'Cancelled';
CREATE INDEX appointments_user_idx ON public.appointments (user_id);

CREATE POLICY "appointments read" ON public.appointments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "appointments insert own" ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "appointments update" ON public.appointments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "appointments admin delete" ON public.appointments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

INSERT INTO public.services (id,name,category,icon,duration_minutes) VALUES
 ('s1','General Physician','Healthcare','stethoscope',30),
 ('s2','Dental Checkup','Healthcare','tooth',45),
 ('s3','Haircut & Styling','Salon & Beauty','scissors',45),
 ('s4','Spa & Facial','Salon & Beauty','sparkles',60),
 ('s5','Car Wash Premium','Car Wash','car',60),
 ('s6','Bike Wash','Bike Wash','bike',45),
 ('s7','Car Repair','Mechanic','wrench',120),
 ('s8','Bike Service','Mechanic','settings',90),
 ('s9','Wedding Planning','Event Services','party-popper',120),
 ('s10','AC Service','Home Services','snowflake',60);

INSERT INTO public.providers (id,name,category,location,price,rating,reviews,slots,service_id) VALUES
 ('p1','AIG Hospitals','Healthcare','Gachibowli, Hyderabad',850,4.9,432,'{09:00,10:30,14:00,16:00,17:30}','s1'),
 ('p2','Apollo Dental','Healthcare','Jubilee Hills',750,4.8,289,'{09:30,11:30,14:30,16:30}','s2'),
 ('p3','Style Studio','Salon & Beauty','Hitech City',499,4.7,321,'{10:30,12:30,15:00,17:30,19:00}','s3'),
 ('p4','Luxury Spa','Salon & Beauty','Madhapur',1500,4.9,456,'{09:00,11:00,13:00,15:00,17:00}','s4'),
 ('p5','HydroWash Express','Car Wash','Hitech City',399,4.8,415,'{09:00,10:30,12:00,14:00,16:00,17:30}','s5'),
 ('p6','Bike Glamour','Bike Wash','Madhapur',199,4.7,234,'{10:00,11:30,14:00,16:30,18:00}','s6'),
 ('p7','AutoCare Center','Mechanic','Uppal',1499,4.9,512,'{08:00,10:00,13:00,15:00,17:00}','s7'),
 ('p8','Speed Garage','Mechanic','Kukatpally',799,4.7,278,'{09:00,11:00,14:00,16:30}','s8'),
 ('p9','Royal Events','Event Services','Secunderabad',5000,4.8,189,'{10:00,12:00,14:00,16:00}','s9'),
 ('p10','CoolCare AC','Home Services','Gachibowli',599,4.8,234,'{08:30,11:00,13:30,16:00}','s10');
