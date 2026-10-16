# Mohamed Yasser — Portfolio

One website, two tracks: **Data Analysis** and **Front-End Development**.
Plain HTML + CSS + JavaScript. No build step, no backend, no database.

## Folder structure

```
portfolio/
├── index.html                  ← page structure (rarely needs editing)
├── css/style.css               ← design + colors (top of file)
├── js/main.js                  ← builds the cards from your data files
├── data/
│   ├── profile.js              ← name, title, bio, photo, contact, skills
│   ├── data-projects.js        ← Data Analysis projects
│   └── frontend-projects.js    ← Front-End projects
└── assets/img/                 ← put your photo and screenshots here
```

## How to edit

### 1. Your info, photo, contact and skills → `data/profile.js`
- Change `bio` to your own words.
- Photo: copy your image to `assets/img/me.jpg`, then set `photo: "assets/img/me.jpg"`.
- Contact: fill in the links you want. Any field left as `""` is hidden automatically.
- Skills: add or remove items in the two lists.

### 2. Add a Data Analysis project → `data/data-projects.js`
Copy one `{ ... }` block, paste it after the last one (add a comma between blocks), and edit it:

```js
{
  title: "Sales Dashboard 2025",
  image: "assets/img/sales-dashboard.png",
  overview: "What the dashboard covers, or the question it answers.",
  tools: ["Excel", "Power BI"],
  steps: ["Cleaned the data", "Built the model", "Designed the dashboard"],   // optional: [] hides it
  findings: ["Finding one", "Finding two"],                                    // optional: [] hides it
  liveUrl: "https://...",      // leave "" to hide the button
  githubUrl: "https://..."     // leave "" to hide the button
}
```

**Details window + video:** clicking a dashboard image (or the "Details" button) opens a window with the big image, overview, steps and findings. To add a video, put a link in the `video` field:
```js
video: "https://youtu.be/XXXXXXXXXXX",     // YouTube (upload as "Unlisted"), recommended for big videos
// or
video: "assets/video/my-dashboard.mp4",    // a small compressed file inside the site (under ~20 MB)
```
Leave `video` out and the window shows the image only.

### 3. Add a Front-End project → `data/frontend-projects.js`
Same idea, and the same details window and `video` field work here too (clicking a project image opens it):

```js
{
  title: "Weather App",
  image: "assets/img/weather-app.png",
  description: "What it is and what it does.",
  tech: ["HTML", "CSS", "JavaScript"],
  features: ["Responsive layout", "Search by city"],
  video: "https://youtu.be/XXXXXXXXXXX",   // optional, YouTube link or assets/video/file.mp4
  liveUrl: "https://...",
  githubUrl: "https://github.com/..."
}
```

### Sample projects
Your 4 Power BI dashboards are already in. Add your own `steps` and `findings` to each one, they stay hidden until you do.
Your 3 front-end projects are in too. Add `tech` (e.g. `["HTML","CSS","JavaScript"]`), `features`, and your GitHub / live links to each one, they stay hidden until you do.

### Images
- Save screenshots in `assets/img/` and point `image` to them.
- Recommended size: about **1200 × 750 px** for front-end, **1200 × 675 px** for data.
- Use `.webp` or compressed `.jpg` to keep the site fast.

### Colors
Open `css/style.css`. The first ~50 lines hold all colors:
`--data` is the cobalt-blue accent (Data Analysis), `--front` is ink black (Front-End). To change the whole feel, change just those two lines (and the dark-mode ones below).
The dark theme colors are in the `[data-theme="dark"]` block.

## Preview on your computer
Just double-click `index.html`. It works without a server.

## Publish for free
**Netlify (easiest):** go to app.netlify.com/drop and drag the whole `portfolio` folder onto the page.

**GitHub Pages:** create a repository, upload the files, then Settings → Pages → deploy from the `main` branch.

After publishing, update the title and `og:` tags in `index.html` if you want, and add a custom domain if you have one.

## SEO notes
Already included: page title, meta description, Open Graph tags, semantic HTML, image alt text, lazy-loaded images, fast static files.

## Contact form
The form sends messages to the email in `data/profile.js` (`contact.email`) using the free FormSubmit service, so no backend is needed.
**One-time activation:** after you publish the site, send one test message from the form. FormSubmit emails you an activation link, click it once, and from then on every message arrives in your inbox. If the form can't send, visitors get a button that opens their email app instead.
The WhatsApp button opens a chat with the number in `contact.whatsapp` (international format, e.g. `https://wa.me/201021005243`).
