<template>
  <div class="landing">

    <!-- ─── hedha navbar publique ─── -->
    <nav class="landing-nav">
      <div class="landing-nav-brand">
        <i class="bi bi-book-half"></i> BookShop
      </div>
      <div class="landing-nav-links">
        <a href="#hero"     @click.prevent="scrollTo('hero')">Accueil</a>
        <a href="#about"    @click.prevent="scrollTo('about')">À propos</a>
        <a href="#catalogue" @click.prevent="scrollTo('catalogue')">Catalogue</a>
        <router-link to="/login"  class="btn-nav-outline">Connexion</router-link>
        <router-link to="/signup" class="btn-nav-fill">S'inscrire</router-link>
      </div>
    </nav>

    <!-- ─── hedhy l Carousel ─── -->
    <section class="hero" id="hero">
      <div class="hero-carousel">
        <div
          class="hero-slide"
          v-for="(slide, i) in slides"
          :key="i"
          :class="{ active: currentSlide === i }"
          :style="{ backgroundImage: `url(${slide.bg})` }"
        >
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <span class="hero-tag">{{ slide.tag }}</span>
            <h1>{{ slide.title }}</h1>
            <p>{{ slide.desc }}</p>
            <div class="hero-actions">
              <router-link to="/signup" class="btn-hero-primary">
                <i class="bi bi-person-plus"></i> Rejoindre la bibliothèque
              </router-link>
              <a @click.prevent="scrollTo('catalogue')" class="btn-hero-outline" href="#">
                <i class="bi bi-grid-3x3-gap"></i> Voir les livres
              </a>
            </div>
          </div>
        </div>

        <!-- hedhom dots mtaa l carousel-->
        <div class="carousel-dots">
          <button
            v-for="(_, i) in slides"
            :key="i"
            :class="{ active: currentSlide === i }"
            @click="currentSlide = i"
          ></button>
        </div>

        <!-- Arrows -->
        <button class="carousel-arrow left" @click="prevSlide">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="carousel-arrow right" @click="nextSlide">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>

    <!-- ───  hedhom Stats rapides ─── -->
    <section class="landing-stats">
      <div class="stat-item">
        <div class="stat-number">{{ totalBooks }}+</div>
        <div class="stat-label">Livres disponibles</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">{{ totalAuthors }}+</div>
        <div class="stat-label">Auteurs référencés</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">Gratuit et accessible</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">❤️</div>
        <div class="stat-label">Gérez vos favoris</div>
      </div>
    </section>

    <!-- ─── hedha l About ─── -->
    <section class="about-section" id="about">
      <div class="about-content">
        <div class="about-text">
          <span class="section-tag">À propos</span>
          <h2>Une bibliothèque <em>moderne</em><br />pour les passionnés de lecture</h2>
          <p>
            BookShop est une plateforme dédiée aux amoureux des livres. Parcourez
            notre catalogue, découvrez de nouveaux auteurs, et créez votre propre
            liste de favoris personnalisée.
          </p>
          <ul class="about-features">
            <li><i class="bi bi-check-circle-fill"></i> Catalogue riche et varié</li>
            <li><i class="bi bi-check-circle-fill"></i> Liste de favoris personnelle</li>
            <li><i class="bi bi-check-circle-fill"></i> Filtrage par année de publication</li>
            <li><i class="bi bi-check-circle-fill"></i> Interface moderne et intuitive</li>
          </ul>
          <router-link to="/signup" class="btn-hero-primary" style="display:inline-flex;margin-top:8px">
            <i class="bi bi-rocket-takeoff"></i> Commencer maintenant
          </router-link>
        </div>
        <div class="about-image">
          <div class="about-img-stack">
            <div class="about-img-card card-1">
              <i class="bi bi-book-half"></i>
              <span>Catalogue</span>
            </div>
            <div class="about-img-card card-2">
              <i class="bi bi-heart-fill"></i>
              <span>Favoris</span>
            </div>
            <div class="about-img-card card-3">
              <i class="bi bi-people-fill"></i>
              <span>Auteurs</span>
            </div>
            <div class="about-img-main">
              <i class="bi bi-book-half" style="font-size:4rem;color:var(--gold)"></i>
              <div style="font-family:'Playfair Display',serif;font-size:1.4rem;margin-top:12px">BookShop</div>
              <div style="color:var(--text-muted);font-size:0.85rem">Bibliothèque en ligne</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ───  hedha l Catalogue public ─── -->
    <section class="catalogue-section" id="catalogue">
      <div class="section-header">
        <span class="section-tag">Catalogue</span>
        <h2>Découvrez nos livres</h2>
        <p>Parcourez librement notre sélection. Connectez-vous pour ajouter des favoris.</p>
      </div>

      <div class="public-filter">
        <input
          class="filter-input"
          v-model="search"
          placeholder="🔍 Rechercher un titre..."
          style="width:280px"
        />
        <input class="filter-input" type="number" v-model="startYear" placeholder="Année début" />
        <input class="filter-input" type="number" v-model="endYear"   placeholder="Année fin" />
        <button class="btn-gold" @click="filterBooks">
          <i class="bi bi-search"></i> Filtrer
        </button>
        <button class="btn-navy" v-if="search||startYear||endYear" @click="resetFilter"
          style="padding:10px 16px">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div v-if="loadingBooks" class="spinner-wrap"><div class="spinner-pro"></div></div>

      <div class="public-books-grid" v-else>
        <div class="public-book-card" v-for="book in displayed" :key="book.id">
          <div class="public-book-img">
            <img :src="book.image" :alt="book.title" @error="onImgError" />
            <div class="public-book-overlay">
              <router-link to="/login" class="overlay-btn">
                <i class="bi bi-heart"></i> Ajouter aux favoris
              </router-link>
            </div>
          </div>
          <div class="public-book-body">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-meta">
              <span class="meta-chip year">{{ book.year }}</span>
              <span class="meta-chip editor">{{ book.editor }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!displayed.length && !loadingBooks" class="empty-state">
        <i class="bi bi-journal-x"></i>
        <h4>Aucun livre trouvé</h4>
      </div>
    </section>

    <!-- ─── CTA ─── -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Prêt à rejoindre la bibliothèque ?</h2>
        <p>Créez votre compte gratuitement et accédez à toutes les fonctionnalités.</p>
        <div class="cta-actions">
          <router-link to="/signup" class="btn-hero-primary">
            <i class="bi bi-person-plus"></i> Créer un compte
          </router-link>
          <router-link to="/login" class="btn-hero-outline">
            <i class="bi bi-box-arrow-in-right"></i> Se connecter
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── Footer ─── -->
    <footer class="landing-footer">
      <div class="footer-brand">
        <i class="bi bi-book-half"></i> BookShop
      </div>
      <p>© 2026 BookShop — Bibliothèque en ligne. Tous droits réservés.</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getAllBooks, getAllAuthors }   from '../services/api.js'

// Carousel fyh 3 slides, kol wa7ed fih background image w text overlay
const slides = [
  {
    bg:    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600',
    tag:   '📚 Bienvenue',
    title: 'Votre bibliothèque en ligne',
    desc:  'Découvrez des milliers de livres, gérez vos favoris et explorez de nouveaux horizons littéraires.',
  },
  {
    bg:    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600',
    tag:   '❤️ Favoris',
    title: 'Sauvegardez vos coups de cœur',
    desc:  'Créez votre liste personnelle et retrouvez vos livres préférés à tout moment.',
  },
  {
    bg:    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600',
    tag:   '✨ Découverte',
    title: 'Explorez de nouveaux auteurs',
    desc:  'Parcourez notre catalogue varié et découvrez des auteurs du monde entier.',
  },
]
// state mtaa l Carousel 
const currentSlide = ref(0)
let autoplay = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Stats
const totalBooks   = ref(0)
const totalAuthors = ref(0)

// Catalogue public
const books       = ref([])
const displayed   = ref([])
const loadingBooks = ref(true)
const search      = ref('')
const startYear   = ref('')
const endYear     = ref('')

onMounted(async () => {
  // Autoplay carousel
  autoplay = setInterval(nextSlide, 4000)

  try {
    const [bRes, aRes] = await Promise.all([getAllBooks(), getAllAuthors()])
    books.value         = bRes.data.listeBooks || []
    displayed.value     = [...books.value]
    totalBooks.value    = books.value.length
    totalAuthors.value  = aRes.data?.length || 0
  } finally {
    loadingBooks.value = false
  }
})

onUnmounted(() => clearInterval(autoplay))

function filterBooks() {
  displayed.value = books.value.filter((b) => {
    const matchSearch = search.value
      ? b.title.toLowerCase().includes(search.value.toLowerCase())
      : true
    const matchStart = startYear.value ? b.year >= Number(startYear.value) : true
    const matchEnd   = endYear.value   ? b.year <= Number(endYear.value)   : true
    return matchSearch && matchStart && matchEnd
  })
}

function resetFilter() {
  search.value    = ''
  startYear.value = ''
  endYear.value   = ''
  displayed.value = [...books.value]
}

function onImgError(e) {
  e.target.src = 'https://placehold.co/300x260/1e2f45/c9a84c?text=📖'
}
</script>

<style scoped>
/* ─── Navbar ─── */
.landing-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 48px;
  background: rgba(13,27,42,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}

.landing-nav-brand {
  font-family: 'Playfair Display', serif;
  color: white;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.landing-nav-brand i { color: var(--gold); }

.landing-nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.landing-nav-links a {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.landing-nav-links a:hover { color: white; }

.btn-nav-outline {
  border: 1.5px solid rgba(255,255,255,0.35) !important;
  border-radius: 8px !important;
  padding: 8px 20px !important;
  color: white !important;
  transition: all 0.2s !important;
}

.btn-nav-outline:hover {
  border-color: var(--gold) !important;
  color: var(--gold) !important;
}

.btn-nav-fill {
  background: var(--gold) !important;
  color: var(--navy) !important;
  border-radius: 8px !important;
  padding: 8px 20px !important;
  font-weight: 700 !important;
  transition: filter 0.2s !important;
}

.btn-nav-fill:hover { filter: brightness(1.1); }

/* ─── Hero ─── */
.hero { height: 100vh; position: relative; }

.hero-carousel { height: 100%; position: relative; overflow: hidden; }

.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero-slide.active { opacity: 1; }

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(13,27,42,0.85) 0%,
    rgba(13,27,42,0.45) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 80px;
  max-width: 700px;
}

.hero-tag {
  display: inline-block;
  background: rgba(201,168,76,0.25);
  border: 1px solid rgba(201,168,76,0.4);
  color: var(--gold-light);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
  width: fit-content;
}

.hero-content h1 {
  font-family: 'Playfair Display', serif;
  color: white;
  font-size: 3.6rem;
  line-height: 1.15;
  margin-bottom: 18px;
}

.hero-content p {
  color: rgba(255,255,255,0.72);
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 32px;
}

.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--gold), #b8922a);
  color: var(--navy);
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s;
  box-shadow: 0 4px 20px rgba(201,168,76,0.4);
}

.btn-hero-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
  color: var(--navy);
}

.btn-hero-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 2px solid rgba(255,255,255,0.45);
  color: white;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-hero-outline:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.carousel-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.carousel-dots button {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.carousel-dots button.active {
  background: var(--gold);
  width: 24px;
  border-radius: 4px;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  width: 48px; height: 48px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
  z-index: 10;
}

.carousel-arrow:hover { background: var(--gold); border-color: var(--gold); color: var(--navy); }
.carousel-arrow.left  { left: 30px; }
.carousel-arrow.right { right: 30px; }

/* ─── Stats ─── */
.landing-stats {
  background: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 36px 60px;
}

.stat-item { text-align: center; padding: 0 48px; }

.stat-number {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  color: var(--gold);
  font-weight: 700;
}

.stat-label {
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  margin-top: 4px;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: rgba(255,255,255,0.12);
}

/* ─── About ─── */
.about-section {
  padding: 100px 80px;
  background: white;
}

.about-content {
  display: flex;
  align-items: center;
  gap: 80px;
  max-width: 1100px;
  margin: 0 auto;
}

.about-text { flex: 1; }

.section-tag {
  display: inline-block;
  background: #fff8e6;
  color: var(--gold);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(201,168,76,0.25);
}

.about-text h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  line-height: 1.2;
  margin-bottom: 18px;
  color: var(--text-main);
}

.about-text h2 em { color: var(--gold); font-style: italic; }

.about-text p {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 22px;
}

.about-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.about-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.about-features li i { color: var(--success); font-size: 1rem; }

.about-image { flex: 1; display: flex; justify-content: center; }

.about-img-stack {
  position: relative;
  width: 320px;
  height: 320px;
}

.about-img-main {
  width: 200px; height: 200px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(13,27,42,0.15);
  border: 1px solid var(--border);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.about-img-card {
  position: absolute;
  width: 100px; height: 100px;
  border-radius: 16px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px;
  font-size: 1.6rem;
  font-weight: 700;
  font-size: 0.82rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.about-img-card span { font-size: 0.78rem; font-weight: 700; }

.card-1 { background:#f0f4ff; color:#3a5bd9; top:0; left:0; }
.card-1 i::before { content: '\f130'; font-size:1.4rem; }
.card-2 { background:#fff0f3; color:#e05252; bottom:0; right:0; }
.card-2 i { font-size:1.4rem; }
.card-3 { background:#f0fdf4; color:#3dba7f; bottom:0; left:0; }
.card-3 i { font-size:1.4rem; }

/* ─── Catalogue public ─── */
.catalogue-section {
  padding: 100px 80px;
  background: var(--cream);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  margin: 12px 0 10px;
  color: var(--text-main);
}

.section-header p {
  color: var(--text-muted);
  font-size: 1rem;
}

.public-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.public-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.public-book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(13,27,42,0.08);
  border: 1px solid var(--border);
  transition: transform 0.25s, box-shadow 0.25s;
}

.public-book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(13,27,42,0.14);
}

.public-book-img {
  height: 240px;
  position: relative;
  overflow: hidden;
  background: var(--navy);
}

.public-book-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.public-book-card:hover .public-book-img img { transform: scale(1.06); }

.public-book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13,27,42,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.public-book-card:hover .public-book-overlay { opacity: 1; }

.overlay-btn {
  background: var(--gold);
  color: var(--navy);
  font-weight: 700;
  font-size: 0.82rem;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: filter 0.2s;
}

.overlay-btn:hover { filter: brightness(1.1); color: var(--navy); }

.public-book-body {
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ─── CTA ─── */
.cta-section {
  background: linear-gradient(135deg, var(--navy) 0%, #162032 100%);
  padding: 100px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a84c' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.cta-content { position: relative; z-index: 1; }

.cta-content h2 {
  font-family: 'Playfair Display', serif;
  color: white;
  font-size: 2.6rem;
  margin-bottom: 14px;
}

.cta-content p {
  color: rgba(255,255,255,0.6);
  font-size: 1.05rem;
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── Footer ─── */
.landing-footer {
  background: #080f18;
  padding: 30px 60px;
  text-align: center;
}

.footer-brand {
  font-family: 'Playfair Display', serif;
  color: var(--gold);
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.landing-footer p {
  color: rgba(255,255,255,0.3);
  font-size: 0.82rem;
}
</style>