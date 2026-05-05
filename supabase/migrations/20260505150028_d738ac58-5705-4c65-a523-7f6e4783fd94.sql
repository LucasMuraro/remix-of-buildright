-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  venue TEXT,
  address TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  genre TEXT,
  flyer_url TEXT,
  instagram_url TEXT,
  ticket_url TEXT,
  submitter_email TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX events_city_idx ON public.events (city);
CREATE INDEX events_date_idx ON public.events (event_date);
CREATE INDEX events_status_idx ON public.events (status);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved events"
  ON public.events FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can submit events"
  ON public.events FOR INSERT
  WITH CHECK (true);

-- Storage bucket for flyers
INSERT INTO storage.buckets (id, name, public)
VALUES ('flyers', 'flyers', true);

CREATE POLICY "Public can view flyers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'flyers');

CREATE POLICY "Anyone can upload flyers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'flyers');