# Admin portal and chat assistant: setup

The website now has an admin portal at **/admin**, a chat assistant on every page, an apply form with
CV upload, and saves every contact-form enquiry. Everything is stored in Supabase. Until the steps
below are done the public site works as before: the assistant answers from the site's pages, and
saving a lead or an application shows a "please email us" message.

Do steps 1 to 4 once. Step 5 is for testing on your own computer, step 6 for the live site.

## 1. Create the tables (Supabase SQL editor)

1. Open the Supabase project → **SQL Editor** → **New query**.
2. If `0001_init.sql` was never run, paste `supabase/migrations/0001_init.sql` and press **Run**.
3. Paste `supabase/migrations/0002_admin_cms_chatbot.sql` and press **Run**.
4. Paste `supabase/migrations/0003_website_cms.sql` and press **Run** (website content and the media library).

This adds the admin, chatbot, openings and settings tables, a private `resumes` bucket for CVs, your
current job openings, 12 starter chatbot answers and the default settings. Running it twice is safe.

## 2. Turn on email sign-in

Supabase → **Authentication** → **Sign In / Providers** → **Email**: enabled. Turn **off**
"Allow new users to sign up", so only people you add can ever get a login.

## 3. Create the first admin

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**. Enter your work email
   and a strong password, and tick **Auto Confirm User**.
2. SQL Editor, with your email:

   ```sql
   insert into public.admin_users (user_id, email, name, role)
   select id, email, 'Your Name', 'admin' from auth.users where email = 'you@in2itebs.com';
   ```

Everyone after that is added from **/admin → Users**, with a role: admin, sales, hr or editor.

## 4. Find the three keys

Supabase → **Project Settings**:

| Setting | Where | Example |
|---|---|---|
| `SUPABASE_URL` | Data API → Project URL | `https://abcd.supabase.co` |
| `SUPABASE_SECRET_KEY` | API Keys → Secret key | `sb_secret_...` (never share it) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | API Keys → Publishable key | `sb_publishable_...` |

## 5. Test on your computer

Create `web/.env.local` (git never commits it):

```
SITE_ENV=preview
SUPABASE_URL=https://abcd.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Then `cd web`, `npm run dev`, and try:

- **Chat**: the round button bottom-right. Ask "do you do SAP migrations?", then press
  **Share my requirement** and fill in the steps.
- **Apply**: Career → Current Openings → Apply Now, with a PDF CV.
- **Contact form**: submit an enquiry.
- **Admin**: http://127.0.0.1:3107/admin/ → sign in → the lead, the chat and the application are there.

## 6. Make it work on the live site

### 6a. Cloudflare: the page cache for instant edits (once)

Website edits go live within seconds because pages are served from a cache the site can refresh
itself. That cache is an R2 bucket:

1. Cloudflare dashboard → **R2 Object Storage** → **Create bucket**.
2. Name it exactly **`in2it-ebs-next-cache`**, location Automatic → **Create bucket**.
   (R2 asks for a payment method the first time; the free tier covers this site.)
3. The API token GitHub deploys with (`CLOUDFLARE_API_TOKEN`) needs **Workers R2 Storage: Edit** as
   well as **Workers Scripts: Edit**: Cloudflare → My Profile → API Tokens → edit the token → add the
   permission → Continue to summary → Update token. The secret value does not change.

The two Durable Objects the cache also uses are created by the deploy itself; nothing to do.

Size note: the Worker is about 3 MB compressed. The free Workers plan allows 3 MB and the paid plan
($5 a month) 10 MB, so the paid plan leaves room to grow.

### 6b. GitHub secrets

GitHub → repository → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `SUPABASE_URL` | as above (probably already there) |
| `SUPABASE_SECRET_KEY` | as above (probably already there) |
| `SUPABASE_PUBLISHABLE_KEY` | the publishable key (`sb_publishable_...`) |

Push to main. The deploy uploads them to Cloudflare. Check `/api/health/` on the live site:
`supabaseConfigured` and `adminSignInConfigured` should both be `true`.

## 7. Editing the website

Everything below is live on the website **within seconds of pressing Save**, with no rebuild:

| Where in /admin | What it changes |
|---|---|
| **Website content → Service pages** | Every page in the Services menu: headline, introduction, sections (headings, text, bullets), closing text, hero picture, search title and description |
| **Website content → Industry pages / Partner pages** | The same for the 14 industry and 10 partner pages |
| **Website content → News & articles** | Add, edit or remove articles on /insights/ and the homepage news strip |
| **Website content → Leadership / Offices / Testimonials** | The team (with photos), office addresses and phone numbers (contact page, map, footer), client quotes |
| **Media library** | Upload PNG, JPG or WebP images (up to 5 MB), then choose them in any editor above |
| **Page heroes** | The title, intro and picture at the top of any page |
| **Job openings, Chatbot FAQs, Site settings** | The careers page, the chat assistant, the announcement banner |
| **Visual editor** | The live website itself: click text and pictures on any page and edit them in place |
| **Page builder** | New pages built from blocks, and the homepage's section order (see below) |
| **Website content → Homepage hero** | The five headline slides at the top of the homepage |

**Pictures.** Every picture box offers, in this order: pictures **used before on this page** (and
its **original picture**), your **uploads**, the **website's own images** (every picture the site
shipped with) and the **hero image library**, so a replaced picture can always be put back. A
service, industry or partner page's picture can be set in two places, its editor (Hero picture) and
Page heroes; the one chosen last is shown, and the editor says when Page heroes is the one in use.

Every save is kept: the **History** panel beside each editor restores any earlier version in one
click, and **Reset to original** returns a page to the text the website shipped with. Page menus and
addresses (URLs) stay in code, so an edit in the admin can never break the navigation.

## 8. The visual editor (edit the website on the page)

**/admin → Visual editor** shows the real website. Open any page from the address box (it suggests
every page), or switch to **Browse** and click through the site; the panel on the right always
shows what can be edited on the page you are on.

- **Edit mode**: everything editable gets a dashed outline when you point at it. Click a headline,
  paragraph or list item and type straight onto the page (Enter or Esc finishes). Click a picture
  and its picker opens in the panel.
- **The panel** holds the same fields as Website content, for this page: the page's own content
  (service, industry, partner page, article), its hero, and on the homepage the hero slides,
  leaders, testimonials and offices. Typing in the panel updates the page as you type.
- **Save changes** (Ctrl+S) puts every edit on the page live at once. **Discard** drops them.
  Every save is kept in the history of the full editor ("Open the full editor").
- **Desktop / tablet / phone** shows the page at each width.

Text that is part of a page's fixed design (for example the About page's long copy) is not
outlined: change it in the page builder by building a new version of the page, or ask for it to
be made editable.

## 9. The page builder

**/admin → Page builder** builds whole pages from ready-made blocks, in the site's own design:

- **New page**: give it a title and an address (for example `offers/sap-health-check`), pick a
  starting layout (landing page, service page or blank) and the builder opens.
- **Add blocks** (left): Hero, Call to action, Text, Rich text, Quote, Questions and answers,
  Picture and text, Picture, YouTube video, Cards, Numbers, Space, Client testimonials, Client
  logos and Enquiry form. Drag one onto the page, or click it to add it below the selected block.
  Hovering over the page shows **Add block here** between blocks.
- **Move blocks**: drag the grip on a block's toolbar, or drag rows in **Layers**. The arrows move
  one step. Lists inside a block (cards, questions, figures) are dragged by their ⠿ grip.
- **Edit**: click a block; its settings open on the right and the page updates as you type.
  Click empty space (or the settings icon) for the page's title, address and Google description.
- **Desktop / tablet / phone** buttons at the top show the page at each width.
- **Undo / redo** (Ctrl+Z / Ctrl+Shift+Z), **Save draft** (Ctrl+S), **Versions** (any earlier
  save or publish, loaded back into the editor), **Preview** (the saved draft in a new tab).
- **Publish** puts the page live at its address straight away. After later edits the button reads
  **Update live page**; until then visitors keep seeing the published version. **Unpublish** (page
  settings) takes it off the website and keeps the draft.

**Homepage layout** (top of the Page builder screen) shows the homepage's own sections as dashed
boxes. Drag them into a new order, remove the ones you do not want (they come back from the
"Homepage sections (removed)" group), and add your own blocks between them. Publish to apply it;
**Go back to the original layout** restores the shipped homepage.

New pages are not added to the header menu automatically: link to them from a button, a card or
another page's text, or ask for them to be added to the menu.

## Who can see what

| Role | Sections |
|---|---|
| admin | everything, including Users and the Page builder |
| sales | Dashboard, Leads, Chat transcripts |
| hr | Dashboard, Applications, Job openings |
| editor | Dashboard, Chat transcripts, Visual editor, Page builder, Website content, Media library, Chatbot FAQs, Site settings, Page heroes |

## Later: AI and voice

The assistant answers today from the FAQs and the site's own pages, with no AI model. When NVIDIA NIM
(DeepSeek) is added, the same matching step becomes the "approved passages" the model may answer from,
and Sarvam voice plugs into the same chat engine (see `docs/website-platform-blueprint.docx`,
sections 7 and 8). Leads, transcripts and the admin stay exactly as they are.
