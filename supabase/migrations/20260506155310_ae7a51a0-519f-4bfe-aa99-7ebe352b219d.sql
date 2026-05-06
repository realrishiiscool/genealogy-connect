
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'boutique_owner', 'customer');
CREATE TYPE public.user_status AS ENUM ('active', 'pending', 'restricted');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  user_type public.app_role NOT NULL DEFAULT 'customer',
  status public.user_status NOT NULL DEFAULT 'active',
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  boutique_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roles table (separate, for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  code TEXT;
  exists_check INT;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    SELECT count(*) INTO exists_check FROM public.profiles WHERE referral_code = code;
    EXIT WHEN exists_check = 0;
  END LOOP;
  RETURN code;
END;
$$;

-- Auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_type public.app_role;
  v_referral_code TEXT;
  v_referred_by UUID;
  v_input_ref TEXT;
BEGIN
  v_user_type := COALESCE((NEW.raw_user_meta_data->>'user_type')::public.app_role, 'customer');
  v_input_ref := NEW.raw_user_meta_data->>'referral_code_input';

  IF v_user_type = 'customer' THEN
    v_referral_code := public.generate_referral_code();
    IF v_input_ref IS NOT NULL AND length(v_input_ref) > 0 THEN
      SELECT id INTO v_referred_by FROM public.profiles
        WHERE referral_code = upper(v_input_ref) AND user_type = 'customer' LIMIT 1;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, mobile, user_type, referral_code, referred_by, boutique_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'mobile',
    v_user_type,
    v_referral_code,
    v_referred_by,
    NEW.raw_user_meta_data->>'boutique_name'
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_user_type);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies
-- profiles: anyone authenticated can read (needed for genealogy + admin views); only self can update; admin can update all
CREATE POLICY "Authenticated can view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles: users can view their own roles, admins view all
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
