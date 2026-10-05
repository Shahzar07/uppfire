"""Build the SEO service pages, sitemap.xml and robots.txt into dist/.

Run from the repo root:  python3 tools/build_service_pages.py
Pages share the homepage's stylesheets, logo sprite, header and footer. Copy follows
"Uppfire_SEO_Website_Content.docx" (recommended SEO service pages).
"""
import html, json, re
from urllib.parse import quote
from datetime import date
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent / 'dist'
SITE = 'https://www.uppfire.com'          # canonical domain from the SEO brief
PHONE, PHONE_TEL, EMAIL = '+92 330 5078441', '+923305078441', 'info@uppfire.com'
WA = 'https://wa.me/923305078441'
TODAY = date.today().isoformat()
e = html.escape

FILMS = [('rob-jade', 'Manor in bloom', 'Wedding video editing — bride and groom in a manor garden'),
         ('hillside', 'Golden hour on the hill', 'Wedding video editing — hillside ceremony under a floral arch'),
         ('vineyard', 'Under the arch', 'Wedding video editing — couple portrait at golden hour'),
         ('lauren-ben', 'Old beams, new beginnings', 'Wedding video editing — close moment between bride and groom'),
         ('garden-vows', 'Garden vows', 'Wedding video editing — bridesmaids with parasols in a garden'),
         ('rena-birthday', 'A little rodeo', 'Event video editing — cowboy-themed celebration')]
REELS = [('estate-01', 'The first walkthrough'), ('estate-02', 'An island property story'), ('estate-03', 'The agent, on camera'),
         ('estate-04', 'Harbour-front tour'), ('estate-05', 'Waterfront living'), ('estate-06', 'Built above the tide'),
         ('estate-07', 'Room by room')]
film = lambda i: {'kind': 'film', 'src': f'/assets/films/{FILMS[i][0]}.mp4', 'poster': f'/assets/films/{FILMS[i][0]}.webp', 'title': FILMS[i][1], 'alt': FILMS[i][2]}
reel = lambda i: {'kind': 'reel', 'src': f'/assets/reels/{REELS[i][0]}.mp4', 'poster': f'/assets/reels/{REELS[i][0]}.webp', 'title': REELS[i][1], 'alt': f'Real estate video editing — {REELS[i][1].lower()}'}

FAQ = {
 'industries': ('What industries do you work with?', 'We specialize in wedding and real estate businesses.'),
 'wedding': ('What do you offer wedding businesses?', 'Wedding video editing and social media management.'),
 'estate': ('What do you offer real estate businesses?', 'Meta Ads, video editing, social media management, and graphic design.'),
 'ads-wedding': ('Do you manage Meta Ads for weddings?', 'No. Our Meta Ads service is currently focused on real estate lead generation.'),
 'footage': ('Can you edit videos from our existing footage?', 'Yes. We turn raw wedding or property footage into polished social media content.'),
 'posting': ('Do you handle posting?', 'Yes. Social media management includes content publishing and responding to comments and audience interactions.'),
 'graphics': ('Can you create property graphics?', 'Yes. We create social media and promotional graphics for real estate businesses.'),
 'start': ('How do we get started?', f'Send us a message on WhatsApp ({PHONE}) or email {EMAIL} with what you have — footage, listings or brand assets — and what you need. We’ll reply with a clear plan.'),
}

PAGES = [
 {'slug': 'wedding-video-editing', 'industry': 'Weddings',
  'title': 'Wedding Video Editing Services | Uppfire',
  'desc': 'Professional wedding video editing: cinematic highlights, wedding reels and teasers edited from your raw footage and ready for social media.',
  'h1': 'Professional Wedding Video Editing Services',
  'kicker': 'WEDDINGS · VIDEO EDITING',
  'lead': 'You filmed the day. We shape it into something worth watching again — cinematic highlight films, wedding reels and teasers, edited from your raw footage and ready for social media.',
  'chips': ['Cinematic highlights', 'Wedding reels', 'Teasers', 'Colour & sound'],
  'interest': 'Wedding business: video editing + social media',
  'media_title': 'Wedding films we’ve edited', 'media_note': 'Excerpts shown at web quality. Full-length films are available on request.',
  'media': [film(i) for i in range(6)],
  'includes': [('Cinematic highlight films', 'The story of the day, paced to music and cut so every key moment lands.'),
               ('Wedding reel editing', 'Short, vertical edits built for Instagram, TikTok and Facebook.'),
               ('Teasers & trailers', 'A first look your couples can share within days of the wedding.'),
               ('Colour grading', 'A consistent, cinematic look across every camera and lighting change.'),
               ('Sound design', 'Music, vows and speeches balanced so the audio carries the emotion.'),
               ('Exports for every platform', 'Horizontal, vertical and square versions, ready to post.')],
  'who': 'For wedding businesses that already have footage and need professional editing — so you can keep filming while we keep editing.',
  'steps': [('Send', 'Share your raw footage and any notes, music or references.'), ('Shape', 'We edit, colour grade and mix the sound.'),
            ('Review', 'You review the edit and tell us what to adjust.'), ('Publish', 'You receive files for every platform — or we post them for you.')],
  'faq': ['footage', 'wedding', 'ads-wedding', 'start'],
  'related': [('Wedding social media management', '/wedding-social-media-management/'), ('Real estate video editing', '/real-estate-video-editing/')]},
 {'slug': 'wedding-social-media-management', 'industry': 'Weddings',
  'title': 'Wedding Social Media Management | Uppfire',
  'desc': 'Social media management for wedding businesses: content calendars, consistent posting, captions and engagement, plus wedding reels from your footage.',
  'h1': 'Social Media Management for Wedding Businesses',
  'kicker': 'WEDDINGS · SOCIAL MEDIA MANAGEMENT',
  'lead': 'Keep your wedding business active, consistent and responsive online. We plan, publish and manage your social media so your best work keeps being seen.',
  'chips': ['Content calendar', 'Posting', 'Comments & messages', 'Monthly recap'],
  'interest': 'Wedding business: video editing + social media',
  'media_title': 'Content made from real wedding footage', 'media_note': 'Stills from wedding films we’ve edited — the kind of footage we turn into posts and reels.',
  'media': [film(4), film(1), film(3)],
  'includes': [('A monthly content calendar', 'A month planned before a single post goes live.'),
               ('Consistent posting', 'Posts, reels and stories published on schedule.'),
               ('Captions & hashtags', 'Written in your voice, for the people you want to reach.'),
               ('Page management', 'Your profiles kept up to date and looking intentional.'),
               ('Audience engagement', 'Replies to comments and messages so no inquiry goes unanswered.'),
               ('Reels from your footage', 'Short-form wedding content edited by the same team.')],
  'who': 'For wedding businesses that want their social presence handled consistently, without spending their evenings on it.',
  'steps': [('Understand', 'We learn your business, audience and the content you already have.'), ('Plan', 'We build the month’s content calendar.'),
            ('Publish', 'We post, caption and keep your pages active.'), ('Engage', 'We respond to comments and messages and recap the month.')],
  'faq': ['posting', 'wedding', 'ads-wedding', 'start'],
  'related': [('Wedding video editing', '/wedding-video-editing/'), ('Real estate marketing', '/real-estate-marketing/')]},
 {'slug': 'real-estate-marketing', 'industry': 'Real estate',
  'title': 'Real Estate Marketing Agency | Meta Ads & Content | Uppfire',
  'desc': 'Real estate marketing agency for lead generation: Meta Ads, real estate video editing, social media management and property graphic design from one team.',
  'h1': 'Real Estate Marketing That Generates Leads',
  'kicker': 'REAL ESTATE · MARKETING',
  'lead': 'Meta Ads, property videos, social media management and listing graphics — one team building real estate marketing that gets your properties seen and brings in inquiries.',
  'chips': ['Meta Ads', 'Video editing', 'Social media management', 'Graphic design'],
  'interest': 'Real estate business: Meta Ads, video, social & design',
  'media_title': 'Property videos we’ve edited', 'media_note': '',
  'media': [reel(5), reel(3), reel(0), reel(6)],
  'includes': [('Meta Ads lead generation', 'Facebook and Instagram campaigns built to reach likely buyers and generate inquiries. <a href="/real-estate-meta-ads/">Real estate Meta Ads →</a>'),
               ('Real estate video editing', 'Property tours, reels and ad videos that make every listing worth a visit. <a href="/real-estate-video-editing/">Property video editing →</a>'),
               ('Social media management', 'Consistent publishing and engagement, so your brand stays active between listings.'),
               ('Real estate graphic design', 'Listing graphics and promotional creatives that make your properties look as valuable online as they are in person.')],
  'who': 'For real estate businesses focused on generating leads — agents, agencies and developers who want their listings seen by the right buyers.',
  'steps': [('Send', 'You send us your footage, property information, brand assets or requirements.'), ('Shape', 'We edit, design and prepare the content.'),
            ('Publish', 'Your content goes live across your social platforms.'), ('Promote', 'We use Meta Ads to reach potential buyers and generate inquiries.')],
  'faq': ['estate', 'graphics', 'footage', 'start'],
  'related': [('Real estate Meta Ads', '/real-estate-meta-ads/'), ('Real estate video editing', '/real-estate-video-editing/'), ('Wedding video editing', '/wedding-video-editing/')]},
 {'slug': 'real-estate-video-editing', 'industry': 'Real estate',
  'title': 'Real Estate Video Editing Services | Uppfire',
  'desc': 'Real estate video editing for property tours, listing reels and ad videos, edited to make every listing worth a visit.',
  'h1': 'Professional Real Estate Video Editing',
  'kicker': 'REAL ESTATE · VIDEO EDITING',
  'lead': 'Property tours, listing reels and ad videos, edited to make every property feel worth a visit — and built for the platforms your buyers scroll.',
  'chips': ['Property tours', 'Listing reels', 'Ad videos', 'Captions'],
  'interest': 'Video editing',
  'media_title': 'Property reels we’ve edited', 'media_note': '',
  'media': [reel(i) for i in range(7)],
  'includes': [('Property tour edits', 'Room-by-room walkthroughs paced so viewers feel the space.'),
               ('Listing reels', 'Short vertical edits for Instagram, TikTok and Facebook.'),
               ('Agent-on-camera videos', 'Talking-head content cut clean, with captions and on-screen text.'),
               ('Ad video cuts', 'Short versions built for Meta Ads and lead campaigns.'),
               ('Colour & sound', 'Bright, consistent colour and balanced audio across every clip.'),
               ('Every format', 'Vertical, horizontal and square exports, ready to post.')],
  'who': 'For real estate businesses that already have property footage and need professional editing that sells the possibility.',
  'steps': [('Send', 'Share your raw footage and the property details.'), ('Shape', 'We edit, add captions and on-screen text, and grade the colour.'),
            ('Review', 'You review and request any changes.'), ('Publish', 'You receive every format — or we publish and promote it for you.')],
  'faq': ['footage', 'estate', 'start'],
  'related': [('Real estate Meta Ads', '/real-estate-meta-ads/'), ('Real estate marketing', '/real-estate-marketing/'), ('Wedding video editing', '/wedding-video-editing/')]},
 {'slug': 'real-estate-meta-ads', 'industry': 'Real estate',
  'title': 'Real Estate Meta Ads & Lead Generation | Uppfire',
  'desc': 'Meta Ads for real estate lead generation: Facebook and Instagram Ads that reach likely buyers and turn attention into inquiries, managed by Uppfire.',
  'h1': 'Meta Ads for Real Estate Lead Generation',
  'kicker': 'REAL ESTATE · META ADS',
  'lead': 'Facebook and Instagram ad campaigns that put your listings in front of likely buyers and turn attention into inquiries — with the property videos and graphics to match.',
  'chips': ['Facebook Ads', 'Instagram Ads', 'Lead forms', 'Weekly reporting'],
  'interest': 'Meta Ads (real estate)',
  'media_title': 'Ad-ready property videos', 'media_note': 'Property reels we’ve edited — the kind of creative we run in lead campaigns.',
  'media': [reel(3), reel(4), reel(1)],
  'includes': [('Audience research', 'Who is most likely to buy, and where they spend their attention.'),
               ('Lead-generation campaigns', 'Lead-form and messaging campaigns built around your listings.'),
               ('Ad creative', 'Property videos and graphics made for the feed they run in.'),
               ('Creative testing', 'Different hooks and formats, so budget moves to what works.'),
               ('Budget pacing', 'Spend managed through the campaign, not set and forgotten.'),
               ('Weekly reporting', 'Plain-language updates on reach, leads and cost per lead.')],
  'who': 'For real estate businesses focused on generating leads. Our Meta Ads service is currently focused on real estate — we don’t run ads for wedding businesses.',
  'steps': [('Understand', 'We learn your listings, market and lead goals.'), ('Create', 'We prepare the ad videos and graphics.'),
            ('Launch', 'We set up and launch the campaigns.'), ('Improve', 'We review results weekly and refine what runs next.')],
  'faq': ['ads-wedding', 'estate', 'graphics', 'start'],
  'related': [('Real estate marketing', '/real-estate-marketing/'), ('Real estate video editing', '/real-estate-video-editing/')]},
]


def sprite():
    s = (DIST / 'index.html').read_text()
    return re.search(r'<svg class="svg-sprite".*?</svg>', s, re.S).group(0)


def media_html(m):
    cls = 'svc-media-reel' if m['kind'] == 'reel' else 'svc-media-film'
    return (f'<figure class="svc-media {cls}"><video controls playsinline preload="none" poster="{m["poster"]}" aria-label="{e(m["alt"])}">'
            f'<source src="{m["src"]}" type="video/mp4"></video><figcaption>{e(m["title"])}</figcaption></figure>')


def page(p, sp):
    url = f'{SITE}/{p["slug"]}/'
    faqs = [FAQ[k] for k in p['faq']]
    wa_text = f'Hi Uppfire, I’m interested in {p["h1"].lower()}.'
    wa = f'{WA}?text=' + quote(wa_text)
    schema = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'Service', 'name': p['h1'], 'serviceType': p['h1'], 'description': p['desc'], 'url': url,
         'audience': {'@type': 'BusinessAudience', 'audienceType': f'{p["industry"]} businesses'},
         'provider': {'@type': 'ProfessionalService', 'name': 'Uppfire', 'url': SITE + '/', 'telephone': PHONE, 'email': EMAIL}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Uppfire', 'item': SITE + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': p['h1'], 'item': url}]},
        {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faqs]}]}
    chips = ''.join(f'<span>{e(c)}</span>' for c in p['chips'])
    media = ''.join(media_html(m) for m in p['media'])
    slug = lambda t: re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
    includes = ''.join(f'<article id="{slug(t)}" data-sc-in><h3>{e(t)}</h3><p>{d}</p></article>' for t, d in p['includes'])
    steps = ''.join(f'<li><span>{i:02d}</span><h3>{e(t)}</h3><p>{e(d)}</p></li>' for i, (t, d) in enumerate(p['steps'], 1))
    faq_html = ''.join(f'<details><summary>{e(q)}<span aria-hidden="true">+</span></summary><p>{e(a)}</p></details>' for q, a in faqs)
    related = ''.join(f'<a href="{h}">{e(t)} <span aria-hidden="true">↗</span></a>' for t, h in p['related'])
    note = f'<p class="svc-media-note">{e(p["media_note"])}</p>' if p['media_note'] else ''
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(p["title"])}</title>
<meta name="description" content="{e(p["desc"])}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#181817">
<meta property="og:site_name" content="Uppfire"><meta property="og:type" content="website"><meta property="og:url" content="{url}">
<meta property="og:title" content="{e(p["title"])}"><meta property="og:description" content="{e(p["desc"])}">
<meta property="og:image" content="{SITE}{p["media"][0]["poster"]}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preload" href="/assets/reckless.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/ease.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/scrollcraft.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/signal-footer.css"><link rel="stylesheet" href="/work.css"><link rel="stylesheet" href="/pages.css">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False, separators=(',', ':'))}</script>
</head>
<body class="svc-page">
{sp}
<div class="scroll-progress" aria-hidden="true"><i></i></div>
<a class="skip" href="#main">Skip to content</a>
<div class="announcement">Wedding &amp; real estate marketing — video, social, Meta Ads &amp; design. <a href="/#portfolio">See our work <span aria-hidden="true">↗</span></a><a class="announcement-phone" href="{WA}" target="_blank" rel="noopener">WhatsApp {PHONE}</a></div>
<header class="header">
<div class="nav-block"><a class="brand" href="/" aria-label="Uppfire home"><svg class="brand-logo" viewBox="0 0 4341 1470" aria-hidden="true"><use href="#uf-logo"/></svg></a><button class="menu-button" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation"><span></span><span></span><span></span></button><nav id="navigation" hidden><a href="/#portfolio">Our work <span>01</span></a><a href="/wedding-video-editing/">Wedding video editing <span>02</span></a><a href="/wedding-social-media-management/">Wedding social media <span>03</span></a><a href="/real-estate-marketing/">Real estate marketing <span>04</span></a><a href="/real-estate-video-editing/">Real estate video <span>05</span></a><a href="/real-estate-meta-ads/">Real estate Meta Ads <span>06</span></a><a class="nav-contact" href="{WA}" target="_blank" rel="noopener">WhatsApp <span>{PHONE}</span></a></nav></div>
<div class="nav-actions"><a href="/#portfolio" class="button yellow">See our work</a><a class="button orange" href="{wa}" target="_blank" rel="noopener">Start a project <span aria-hidden="true">↗</span></a></div>
</header>
<main id="main">
<section class="svc-hero">
<nav class="svc-crumbs" aria-label="Breadcrumb"><a href="/">Uppfire</a><span aria-hidden="true">/</span><a href="/#services">{e(p["industry"])}</a><span aria-hidden="true">/</span><span aria-current="page">{e(p["h1"])}</span></nav>
<span class="section-label">{e(p["kicker"])}</span>
<h1 data-rise>{e(p["h1"])}</h1>
<p class="svc-lead">{e(p["lead"])}</p>
<div class="svc-chips">{chips}</div>
<div class="svc-ctas"><a class="button orange" href="{wa}" target="_blank" rel="noopener">Start a conversation <span aria-hidden="true">↗</span></a><a class="hero-link" href="#work">See the work <span aria-hidden="true">↓</span></a></div>
</section>
<section class="svc-work" id="work" aria-labelledby="work-heading">
<h2 id="work-heading" data-rise>{e(p["media_title"])}</h2>{note}
<div class="svc-media-grid svc-media-{p["media"][0]["kind"]}s">{media}</div>
</section>
<section class="svc-includes" aria-labelledby="includes-heading">
<div class="svc-includes-head"><span class="section-label">WHAT’S INCLUDED</span><h2 id="includes-heading" data-rise>Built to get you<br> <em>noticed.</em></h2><p class="svc-who">{e(p["who"])}</p></div>
<div class="svc-includes-grid">{includes}</div>
</section>
<section class="workflow section svc-steps" aria-labelledby="steps-heading"><div class="workflow-head"><span class="section-label">HOW IT WORKS</span><h2 id="steps-heading" data-rise>One team.<br><em>Four steps forward.</em></h2><p>Less work for you.<br> More consistency for your brand.</p></div>
<ol class="workflow-steps" data-sc-in data-sc-stagger="90">{steps}</ol></section>
<section class="faq section" id="faq"><h2 data-rise>A few good questions.</h2><div class="faq-list">{faq_html}</div></section>
<section class="svc-related" aria-label="Related services"><span class="section-label">RELATED SERVICES</span><div>{related}</div></section>
<section class="closing footer-studio" id="contact">
<div class="footer-grain" aria-hidden="true"></div>
<div class="footer-invite"><div><span class="footer-eyebrow">CREATIVE CONTENT. SOCIAL MEDIA. REAL ESTATE LEADS.</span><h2>Let’s make<br> your next <em>move.</em></h2></div><div class="footer-invite-action"><p>Good content. Clear strategy.<br> Tell us what you’re building —<br> we’ll figure out what your brand needs next.</p><a class="footer-project" href="{wa}" target="_blank" rel="noopener"><span>Start a conversation</span><span class="footer-project-arrow" aria-hidden="true">↗</span></a><a class="footer-whatsapp" href="mailto:{EMAIL}"><span>Or email us</span><strong>{EMAIL}</strong></a></div></div>
<footer class="footer-main">
<div class="footer-directory footer-directory-seo"><div class="footer-about"><a href="/" class="footer-small-brand" aria-label="Uppfire home"><svg viewBox="0 0 4341 1470" aria-hidden="true"><use href="#uf-logo"/></svg></a><p>Creative content.<br> Social media.<br> Real estate leads.</p><span>Wedding &amp; real estate marketing agency.</span></div>
<div class="footer-column"><h3>Weddings</h3><a href="/wedding-video-editing/">Wedding video editing</a><a href="/wedding-social-media-management/">Social media management</a></div>
<div class="footer-column"><h3>Real estate</h3><a href="/real-estate-marketing/">Real estate marketing</a><a href="/real-estate-meta-ads/">Meta Ads</a><a href="/real-estate-video-editing/">Video editing</a><a href="/real-estate-marketing/#real-estate-graphic-design">Graphic design</a></div>
<div class="footer-column"><h3>Explore</h3><a href="/#portfolio">Our work</a><a href="/#films">Films &amp; reels</a><a href="/#results">Results</a><a href="/#faq">Questions</a></div>
<div class="footer-column footer-contact"><h3>Contact</h3><a href="mailto:{EMAIL}">{EMAIL}</a><a href="tel:{PHONE_TEL}">{PHONE}</a><a href="{WA}" target="_blank" rel="noopener">WhatsApp ↗</a></div></div>
<div class="footer-baseline"><span>© 2026 Uppfire</span><span>Creative content. Social media. Real estate leads.</span><div><a href="#main">Back to top ↑</a></div></div>
</footer>
</section>
</main>
<a class="wa-float" href="{wa}" target="_blank" rel="noopener" aria-label="Chat with Uppfire on WhatsApp, {PHONE}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.7 8.7 0 0 0-7.5 13.1L3.3 20.8l4.6-1.2A8.7 8.7 0 1 0 12 3.2Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.1 7.9c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.1.3 0 .5.6 1 1.4 1.8 2.5 2.4.2.1.3.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .5-.2 1.2-.7 1.5-.6.4-1.4.6-2.6.2-1.7-.6-3.2-1.9-4.2-3.4-.8-1.3-1-2.6-.4-3.5Z" fill="currentColor"/></svg><span>Chat with us</span></a>
<script type="module" src="/pages.js"></script>
</body></html>
'''


def main():
    sp = sprite()
    for p in PAGES:
        out = DIST / p['slug'] / 'index.html'
        out.parent.mkdir(exist_ok=True)
        out.write_text(page(p, sp))
        print('wrote', out.relative_to(DIST.parent))
    urls = [('/', '1.0')] + [(f'/{p["slug"]}/', '0.8') for p in PAGES]
    (DIST / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>\n' for u, pr in urls) + '</urlset>\n')
    (DIST / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n')
    print('wrote sitemap.xml, robots.txt')


if __name__ == '__main__':
    main()
