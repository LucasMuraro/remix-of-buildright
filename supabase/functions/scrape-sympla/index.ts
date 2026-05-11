import { corsHeaders } from '@supabase/supabase-js/cors';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ScrapeResult {
  title: string;
  description?: string;
  event_date: string;
  city: string;
  state: string;
  venue?: string;
  address?: string;
  instagram_url?: string;
  flyer_url?: string;
  genre?: string;
}

// Brazilian state map (uppercase abbreviations + common full names)
const STATE_MAP: Record<string, string> = {
  'sao paulo': 'SP', 'são paulo': 'SP',
  'rio de janeiro': 'RJ',
  'belo horizonte': 'MG', 'minas gerais': 'MG',
  'porto alegre': 'RS', 'rio grande do sul': 'RS',
  'curitiba': 'PR', 'paraná': 'PR', 'parana': 'PR',
};

function inferGenre(text: string): string | null {
  const t = text.toLowerCase();
  if (/sertanej|fern[ae]ira|maraisa|matogrosso/.test(t)) return 'Sertanejo';
  if (/eletr[oô]nic|techno|house|dj set|rave/.test(t)) return 'Eletrônico';
  if (/funk|baile|mc /.test(t)) return 'Funk';
  if (/pagode|samba|roda de samba/.test(t)) return 'Pagode';
  if (/rock|indie/.test(t)) return /indie/.test(t) ? 'Indie' : 'Rock';
  if (/hip ?hop|rap/.test(t)) return 'Hip Hop';
  if (/forr[oó]|p[ée] de serra/.test(t)) return 'Forró';
  if (/open ?bar/.test(t)) return 'Open Bar';
  if (/bar |pub /.test(t)) return 'Bar';
  return null;
}

async function parseSymplaPage(url: string): Promise<ScrapeResult> {
  const html = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RolezimBot/1.0)' },
  }).then(r => r.text());

  // Sympla embeds JSON-LD schema.org Event data
  const ldMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)];
  let event: any = null;
  for (const m of ldMatches) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of arr) {
        if (item['@type'] === 'Event' || item['@type']?.includes?.('Event')) {
          event = item;
          break;
        }
      }
      if (event) break;
    } catch { /* ignore */ }
  }

  if (!event) throw new Error('Não foi possível extrair os dados do evento desta página.');

  const loc = event.location || {};
  const addr = loc.address || {};
  const cityRaw: string = (addr.addressLocality || '').trim();
  const stateRaw: string = (addr.addressRegion || '').trim();

  let state = stateRaw.length === 2 ? stateRaw.toUpperCase() : (STATE_MAP[stateRaw.toLowerCase()] || STATE_MAP[cityRaw.toLowerCase()] || '');
  // If still empty, try to infer from city name
  if (!state) state = STATE_MAP[cityRaw.toLowerCase()] || '';

  const flyerUrl: string | undefined = Array.isArray(event.image) ? event.image[0] : event.image;

  // Try to extract Instagram handle/url from the full page HTML or description
  let instagramUrl: string | undefined;
  const igMatch =
    html.match(/https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9_.]+)/i) ||
    (event.description || '').match(/@([A-Za-z0-9_.]{2,30})/);
  if (igMatch) {
    instagramUrl = igMatch[0].startsWith('http')
      ? igMatch[0].split('?')[0]
      : `https://instagram.com/${igMatch[1]}`;
  }

  return {
    title: event.name,
    description: event.description?.slice(0, 1000),
    event_date: new Date(event.startDate).toISOString(),
    city: cityRaw,
    state,
    venue: loc.name,
    address: [addr.streetAddress, addr.addressLocality].filter(Boolean).join(', '),
    flyer_url: flyerUrl,
    instagram_url: instagramUrl,
    genre: inferGenre(`${event.name} ${event.description || ''}`) || undefined,
  };
}

async function downloadAndStoreFlyer(supabase: any, imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    const ext = (imageUrl.split('?')[0].split('.').pop() || 'jpg').slice(0, 4);
    const path = `scraped/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('flyers').upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
    });
    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }
    const { data } = supabase.storage.from('flyers').getPublicUrl(path);
    return data.publicUrl;
  } catch (e) {
    console.error('Download flyer error:', e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'URL é obrigatória' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!url.includes('sympla.com.br')) {
      return new Response(JSON.stringify({ error: 'Por enquanto só suportamos URLs do Sympla' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Auth: require an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: 'Sessão inválida' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleData } = await admin.from('user_roles').select('role').eq('user_id', userData.user.id).eq('role', 'admin').maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Apenas admins podem importar' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = await parseSymplaPage(url);
    if (!parsed.flyer_url) {
      return new Response(JSON.stringify({ error: 'Evento sem foto/flyer — não importado. Só aceitamos eventos com imagem.' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const storedFlyer = await downloadAndStoreFlyer(admin, parsed.flyer_url);
    if (!storedFlyer) {
      return new Response(JSON.stringify({ error: 'Falha ao baixar a foto do evento — não importado.' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: inserted, error } = await admin.from('events').insert({
      title: parsed.title,
      description: parsed.description,
      city: parsed.city,
      state: parsed.state,
      venue: parsed.venue,
      address: parsed.address,
      event_date: parsed.event_date,
      genre: parsed.genre,
      flyer_url: storedFlyer || parsed.flyer_url,
      ticket_url: url,
      status: 'approved', // auto-approve scraping per user choice
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, event: inserted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('scrape-sympla error:', e);
    return new Response(JSON.stringify({ error: e.message || 'Erro ao raspar' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
