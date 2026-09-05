<template>
  <div class="portfolio-container">
    <header class="top-navbar">
      <button class="logo-button-left" @click.prevent="changePage('portfolio')" aria-label="Vai al portfolio">
        <span class="logo-pill">
          <img src="../assets/Logo_rob1.png" alt="Logo Roberta" class="logo" />
        </span>
      </button>
      <div class="social-buttons-header">
        <a href="https://linktr.ee/RoPhil?utm_source=linktree_profile_share&ltsid=rophil-portfolio-fix" target="_blank" rel="noopener noreferrer" aria-label="Linktree">
          <v-icon class="white-icon">mdi-link-variant</v-icon>
        </a>
        <a href="https://www.instagram.com/rophil.art" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <v-icon class="white-icon">mdi-instagram</v-icon>
        </a>
        <a href="https://www.linkedin.com/in/rophil/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <v-icon class="white-icon">mdi-linkedin</v-icon>
        </a>
        <a href="mailto:rophil.art@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
          <v-icon class="white-icon">mdi-gmail</v-icon>
        </a>
      </div>
      <button
        v-if="!lightboxVisible"
        class="menu-button"
        @click="toggleNav"
        :aria-expanded="String(navOpen)"
        aria-label="Apri o chiudi menu"
      >
        <v-icon v-if="navOpen" class="menu-button-icon">mdi-close</v-icon>
        <img v-else src="../assets/hamburger_custom.png" alt="" aria-hidden="true" class="menu-button-img" />
      </button>
    </header>

    <aside :class="['sidenav', { 'is-open': navOpen }]">
      <nav>
        <ul>
          <li><a href="#" @click.prevent="changePage('portfolio')">Portfolio</a></li>
          <li><a href="#" @click.prevent="changePage('about')">About Me</a></li>
          <!-- <li><a href="#" @click.prevent="changePage('my-projects')">My Projects</a></li> -->
          <li v-if="isAdmin"><a href="#" @click.prevent="changePage('manage-categories')">Gestione Categorie</a></li>
          <li v-if="isAdmin"><a href="#" @click.prevent="changePage('manage-slider')" data-testid="manage-slider-link">Gestione Slider</a></li>
          <li><a href="#" @click.prevent="changePage('contact')">Contact Me</a></li>
          <li v-if="!user"><a href="#" @click.prevent="changePage('login')">Admin Login</a></li>
          <li v-if="user"><a href="#" @click.prevent="logout">Logout</a></li>
        </ul>
      </nav>
      <div class="social-buttons">
        <a href="https://www.instagram.com/rophil.art" target="_blank"><v-icon>mdi-instagram</v-icon></a>
        <a href="https://linktr.ee/RoPhil?utm_source=linktree_profile_share&ltsid=rophil-portfolio-fix" target="_blank"><v-icon>mdi-link-variant</v-icon></a>
        <a href="https://www.linkedin.com/in/rophil/" target="_blank"><v-icon>mdi-linkedin</v-icon></a>
        <a href="mailto:rophil.art@gmail.com" target="_blank"><v-icon class="white-icon">mdi-gmail</v-icon></a>
      </div>
    </aside>
    <div v-if="navOpen" class="sidenav-backdrop" @click="closeNav"></div>

    <div :class="['main-content-wrapper', { 'shifted': navOpen }]">

      <section
        v-if="currentPage === 'portfolio' && currentHeroSlide"
        class="hero-slider"
        data-testid="hero-slider"
        aria-roledescription="carousel"
        aria-label="In evidenza"
        @mouseenter="pauseHero"
        @mouseleave="resumeHero"
        @touchstart="onHeroTouchStart"
        @touchend="onHeroTouchEnd"
      >
        <transition :name="heroTransitionName">
          <div
            :key="currentHeroSlide.id"
            class="hero-slide"
            :style="{ backgroundImage: `url(${currentHeroSlide.src})` }"
            data-testid="hero-slide"
          >
            <div class="hero-overlay" :style="heroOverlayStyle(currentHeroSlide)"></div>
            <div class="hero-content">
              <h2 v-if="currentHeroSlide.title" class="hero-title" data-testid="hero-title">{{ currentHeroSlide.title }}</h2>
              <p v-if="currentHeroSlide.subtitle" class="hero-subtitle" data-testid="hero-subtitle">{{ currentHeroSlide.subtitle }}</p>
              <p v-if="currentHeroSlide.description" class="hero-description" data-testid="hero-description">{{ currentHeroSlide.description }}</p>
              <div v-if="currentHeroSlide.ctas && currentHeroSlide.ctas.length" class="hero-ctas">
                <template v-for="(cta, i) in currentHeroSlide.ctas">
                  <a
                    v-if="cta.linkType === 'external'"
                    :key="`cta-${i}`"
                    :href="cta.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hero-cta-button"
                    :data-testid="`hero-cta-button-${i}`"
                  >{{ cta.label }}</a>
                  <button
                    v-else
                    :key="`cta-${i}`"
                    type="button"
                    class="hero-cta-button"
                    :data-testid="`hero-cta-button-${i}`"
                    @click="handleHeroCta(cta)"
                  >{{ cta.label }}</button>
                </template>
              </div>
            </div>
          </div>
        </transition>

        <template v-if="activeSlides.length > 1">
          <button class="hero-arrow hero-arrow-left" @click="prevHeroSlide" aria-label="Slide precedente" data-testid="hero-arrow-prev">
            <v-icon>mdi-chevron-left</v-icon>
          </button>
          <button class="hero-arrow hero-arrow-right" @click="nextHeroSlide()" aria-label="Slide successiva" data-testid="hero-arrow-next">
            <v-icon>mdi-chevron-right</v-icon>
          </button>
          <div class="hero-dots" aria-label="Indicatori slide">
            <button
              v-for="(slide, i) in activeSlides"
              :key="slide.id"
              class="hero-dot"
              :class="{ active: i === safeHeroIndex }"
              :aria-label="`Vai alla slide ${i + 1}`"
              :data-testid="`hero-dot-${i}`"
              @click="goToHeroSlide(i)"
            ></button>
          </div>
        </template>

        <button v-if="isAdmin" class="hero-manage-btn" @click="changePage('manage-slider')" data-testid="hero-manage-button">
          <v-icon small>mdi-pencil</v-icon> Gestisci slider
        </button>
      </section>

      <section v-if="currentPage === 'portfolio'" class="portfolio-section">
        <h1 class="mt-8">{{ capitalizedPageTitle }}</h1>
        <div class="filter-pyramid">
          <div class="filter-bar filter-bar-main">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="selectFilter(filter)"
              :class="{ active: activeMainFilter && activeMainFilter.id === filter.id }"
            >
              {{ displayFilterName(filter) }}
            </button>
          </div>
          <div v-if="visibleSubcategories.length" class="filter-bar filter-bar-sub">
            <button
              class="back-button"
              :class="{ active: activeFilter && activeMainFilter && activeFilter.id === activeMainFilter.id }"
              @click="selectFilter(activeMainFilter)"
              :title="`Tutto in ${activeMainFilter.name}`"
              data-testid="subfilter-all-button"
            >
              All
            </button>
            <button
              v-for="sub in visibleSubcategories"
              :key="sub.id"
              @click="selectFilter(sub, activeMainFilter)"
              :class="{ active: activeFilter && activeFilter.id === sub.id }"
            >
              {{ sub.name }}
            </button>
          </div>
        </div>
        <div v-if="images.length === 0" class="empty-portfolio">
          <h2>Il portfolio è attualmente vuoto.</h2>
          <p v-if="!isAdmin">Le opere verranno caricate presto!</p>
          <p v-if="isAdmin">Usa il pulsante <v-icon small>mdi-plus</v-icon> in basso a destra per iniziare.</p>
        </div>
        <draggable v-else v-model="images" tag="main" class="masonry-grid" :disabled="!isAdmin" @end="saveImages">
          <div v-for="image in filteredImages" :key="image.id" class="masonry-item" :class="{ 'draggable-item': isAdmin }">
            <div class="image-wrapper" :class="{ 'is-video': image.type === 'youtube' }" @click="!isAdmin && openLightbox(image)" :data-testid="`portfolio-item-${image.id}`">
              <img
                :src="image.type === 'youtube' ? youtubeThumb(image.youtubeId) : image.src"
                :alt="image.alt"
                loading="lazy"
                :data-image-id="image.id"
                @load="onImgLoad(image)"
                @error="onImgLoad(image)"
                :class="{ loaded: image.loaded, 'video-thumb': image.type === 'youtube' }"
              />
              <div v-if="image.type === 'youtube'" class="play-badge" aria-hidden="true">
                <v-icon>mdi-play</v-icon>
              </div>
              <div class="overlay"><span>{{ image.alt }}</span></div>
            </div>
            <div v-if="isAdmin" class="admin-card-controls">
              <button @click.stop="removeCard(image.id)" class="remove-button">Rimuovi</button>
            </div>
          </div>
        </draggable>
      </section>

      <section v-if="currentPage === 'about'" class="about-container">
        <div class="about-content">
          <div v-if="isAdmin" class="edit-about-button-container">
            <button v-if="!isEditingAbout" @click="startEditingAbout" class="edit-button">
              <v-icon left>mdi-pencil</v-icon> Modifica About
            </button>
            <div v-else>
              <button @click="cancelEditingAbout" class="edit-button cancel">Annulla</button>
              <button @click="saveAboutContent" class="edit-button save">Salva Modifiche</button>
            </div>
          </div>
          <div v-if="isEditingAbout" class="section-images-editor" data-testid="section-images-editor">
            <h3>Immagini tra i paragrafi</h3>
            <p class="editor-hint">Scegli dopo quale paragrafo mostrare un'immagine. Aggiungi sempre un testo alternativo per l'accessibilità.</p>
            <div v-for="slot in aboutImageSlots" :key="slot.key" class="section-image-row" :data-testid="`section-image-row-${slot.key}`">
              <div class="section-image-info">
                <strong>{{ slot.label }}</strong>
                <template v-if="editableSectionImages && editableSectionImages[slot.key]">
                  <img :src="editableSectionImages[slot.key].src" class="section-image-preview" alt="Anteprima" />
                  <input
                    type="text"
                    class="alt-input"
                    placeholder="Testo alternativo"
                    :value="editableSectionImages[slot.key].alt"
                    @input="updateSectionImageAlt(slot.key, $event.target.value)"
                    :data-testid="`section-image-alt-${slot.key}`"
                  />
                </template>
              </div>
              <div class="section-image-actions">
                <button type="button" class="action-btn" @click="triggerSectionImageUpload(slot.key)" :data-testid="`section-image-upload-${slot.key}`">
                  {{ editableSectionImages && editableSectionImages[slot.key] ? 'Sostituisci' : 'Carica immagine' }}
                </button>
                <button v-if="editableSectionImages && editableSectionImages[slot.key]" type="button" class="action-btn delete" @click="removeSectionImage(slot.key)">Rimuovi</button>
              </div>
            </div>
            <input type="file" ref="sectionImageInput" accept="image/*" style="display:none" @change="handleSectionImageUpload" />
          </div>
          <div class="about-intro-grid">
            <div class="intro-image-wrapper">
              <img :src="aboutContent.imageUrl" alt="Roberta, a.k.a. RoPhil" class="profile-photo" />
              <div v-if="isEditingAbout" class="edit-image-overlay" @click="triggerAboutImageUpload">
                <v-icon large>mdi-camera</v-icon>
                <span>Cambia Immagine</span>
                <input type="file" ref="aboutImageInput" @change="handleAboutImageUpload" accept="image/*" style="display: none;" />
              </div>
            </div>
            <div class="intro-text-wrapper">
              <div v-if="!isEditingAbout">
                <h2 class="section-title">{{ aboutContent.headline }}</h2>
                <p>{{ aboutContent.intro_p1 }}</p>
              </div>
              <div v-else>
                <textarea v-model="editableAboutContent.headline" class="editable-field headline"></textarea>
                <textarea v-model="editableAboutContent.intro_p1" class="editable-field" rows="6"></textarea>
              </div>
            </div>
          </div>
          <figure v-if="sectionImage('intro')" class="about-inline-figure" data-testid="about-figure-intro">
            <img :src="sectionImage('intro').src" :alt="sectionImage('intro').alt || ''" loading="lazy" />
          </figure>
          <div class="about-section">
            <div v-if="!isEditingAbout">
              <h2 class="section-title">{{ aboutContent.journey_headline }}</h2>
              <p>{{ aboutContent.journey_p1 }}</p>
              <p>{{ aboutContent.journey_p2 }}</p>
            </div>
            <div v-else>
              <textarea v-model="editableAboutContent.journey_headline" class="editable-field headline"></textarea>
              <textarea v-model="editableAboutContent.journey_p1" class="editable-field" rows="4"></textarea>
              <textarea v-model="editableAboutContent.journey_p2" class="editable-field" rows="4"></textarea>
            </div>
          </div>
          <figure v-if="sectionImage('journey')" class="about-inline-figure" data-testid="about-figure-journey">
            <img :src="sectionImage('journey').src" :alt="sectionImage('journey').alt || ''" loading="lazy" />
          </figure>
          <div class="about-section about-curiosity">
            <div v-if="!isEditingAbout">
              <h2 class="section-title">{{ aboutContent.curiosity_headline }}</h2>
              <p>{{ aboutContent.curiosity_p1 }}</p>
              <p>{{ aboutContent.curiosity_p2 }}</p>
            </div>
            <div v-else>
              <textarea v-model="editableAboutContent.curiosity_headline" class="editable-field headline"></textarea>
              <textarea v-model="editableAboutContent.curiosity_p1" class="editable-field" rows="3"></textarea>
              <textarea v-model="editableAboutContent.curiosity_p2" class="editable-field" rows="4"></textarea>
            </div>
          </div>
          <figure v-if="sectionImage('curiosity')" class="about-inline-figure" data-testid="about-figure-curiosity">
            <img :src="sectionImage('curiosity').src" :alt="sectionImage('curiosity').alt || ''" loading="lazy" />
          </figure>
          <div class="about-section about-cta">
            <div v-if="!isEditingAbout">
              <h2 class="section-title">{{ aboutContent.cta_headline }}</h2>
              <p>{{ aboutContent.cta_p1 }}</p>
            </div>
            <div v-else>
              <textarea v-model="editableAboutContent.cta_headline" class="editable-field headline"></textarea>
              <textarea v-model="editableAboutContent.cta_p1" class="editable-field" rows="4"></textarea>
            </div>
          </div>
          <figure v-if="sectionImage('cta')" class="about-inline-figure" data-testid="about-figure-cta">
            <img :src="sectionImage('cta').src" :alt="sectionImage('cta').alt || ''" loading="lazy" />
          </figure>
          <div class="about-quote">
            <p v-if="!isEditingAbout">{{ aboutContent.quote }}</p>
            <textarea v-else v-model="editableAboutContent.quote" class="editable-field editable-quote" rows="2"></textarea>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'manage-categories' && isAdmin" class="manage-categories-container">
        <h1 class="page-title">Gestione Categorie</h1>
        <div class="category-manager">
          <draggable
            v-model="manageableFilters"
            tag="ul"
            class="category-list"
            handle=".drag-handle"
            @end="saveFilters"
          >
            <li v-for="filter in manageableFilters" :key="filter.id" class="category-item">
              <div class="category-item-content">
                <span class="drag-handle" title="Trascina per riordinare">
                  <v-icon small>mdi-drag</v-icon>
                </span>
                <div v-if="editingFilterId !== filter.id" class="category-name">
                  <span>{{ filter.name }}</span>
                  <div class="category-actions">
                    <button @click="startEditingFilter(filter)" class="action-btn">Rinomina</button>
                    <button @click="deleteFilter(filter.id)" class="action-btn delete">Elimina</button>
                  </div>
                </div>
                <div v-else class="category-edit">
                  <input v-model="editingFilterName" @keyup.enter="saveFilterEdit(filter)" @keyup.esc="cancelFilterEdit" />
                  <button @click="saveFilterEdit(filter)" class="action-btn save">Salva</button>
                  <button @click="cancelFilterEdit" class="action-btn cancel">Annulla</button>
                </div>
              </div>
              <draggable
                v-if="filter.subcategories"
                v-model="filter.subcategories"
                tag="ul"
                class="subcategory-list"
                handle=".drag-handle"
                @end="saveFilters"
              >
                <li v-for="sub in filter.subcategories" :key="sub.id" class="subcategory-item">
                  <span class="drag-handle" title="Trascina per riordinare">
                    <v-icon small>mdi-drag</v-icon>
                  </span>
                  <div v-if="editingFilterId !== sub.id" class="category-name">
                    <span>{{ sub.name }}</span>
                    <div class="category-actions">
                      <button @click="startEditingFilter(sub)" class="action-btn">Rinomina</button>
                      <button @click="deleteFilter(sub.id)" class="action-btn delete">Elimina</button>
                    </div>
                  </div>
                  <div v-else class="category-edit">
                    <input v-model="editingFilterName" @keyup.enter="saveFilterEdit(sub)" @keyup.esc="cancelFilterEdit" />
                    <button @click="saveFilterEdit(sub)" class="action-btn save">Salva</button>
                    <button @click="cancelFilterEdit" class="action-btn cancel">Annulla</button>
                  </div>
                </li>
              </draggable>
              <button @click="addSubcategory(filter)" class="add-subcategory-btn">+ Aggiungi Sottocategoria</button>
            </li>
          </draggable>
          <div class="add-category-container">
            <button @click="addCategory" class="cta-button">Aggiungi Nuova Categoria</button>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'manage-slider' && isAdmin" class="manage-slider-container" data-testid="manage-slider-section">
        <h1 class="page-title">Gestione Hero Slider</h1>
        <p class="editor-hint">Trascina le slide per riordinarle. Le slide disattivate non vengono mostrate ai visitatori.</p>
        <div class="slider-manager">
          <div v-if="heroSlides.length === 0" class="empty-portfolio" data-testid="slider-empty-state">
            <h2>Nessuna slide presente.</h2>
            <p>Aggiungi la prima slide con il pulsante qui sotto.</p>
          </div>
          <draggable
            v-else
            v-model="heroSlides"
            tag="ul"
            class="slide-admin-list"
            handle=".drag-handle"
            @end="saveSlideOrder"
          >
            <li v-for="slide in heroSlides" :key="slide.id" class="slide-admin-item" :class="{ inactive: slide.active === false }" :data-testid="`slide-admin-item-${slide.id}`">
              <span class="drag-handle" title="Trascina per riordinare">
                <v-icon small>mdi-drag</v-icon>
              </span>
              <img :src="slide.src" class="slide-admin-thumb" alt="Anteprima slide" />
              <div class="slide-admin-info">
                <strong>{{ slide.title || 'Senza titolo' }}</strong>
                <span class="slide-admin-meta">
                  {{ slide.transition === 'slide' ? 'Scorrimento' : 'Dissolvenza' }} ·
                  {{ slide.duration || 6 }}s ·
                  {{ (slide.ctas || []).length }} CTA ·
                  {{ slide.active === false ? 'Disattivata' : 'Attiva' }}
                </span>
              </div>
              <label class="slide-active-toggle">
                <input type="checkbox" :checked="slide.active !== false" @change="toggleSlideActive(slide)" :data-testid="`slide-active-toggle-${slide.id}`" />
                Attiva
              </label>
              <div class="category-actions">
                <button @click="openSlideModal(slide)" class="action-btn" :data-testid="`slide-edit-button-${slide.id}`">Modifica</button>
                <button @click="deleteSlide(slide.id)" class="action-btn delete" :data-testid="`slide-delete-button-${slide.id}`">Elimina</button>
              </div>
            </li>
          </draggable>
          <div class="add-category-container">
            <button @click="openSlideModal(null)" class="cta-button" data-testid="add-slide-button">Aggiungi Nuova Slide</button>
          </div>
        </div>
      </section>

      <section v-if="currentPage === 'contact'" class="contact-container">
        <h1 class="page-title">Let's Get in Touch</h1>
        <div class="contact-content">
          <p class="contact-intro">Whether you have a project in mind, a collaboration proposal, or just want to say hi, I'd love to hear from you. Fill out the form below or find me on my social networks.</p>
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="contact-name">Name</label>
              <input type="text" id="contact-name" name="name" v-model="contactForm.name" required>
            </div>
            <div class="form-group">
              <label for="contact-email">Email</label>
              <input type="email" id="contact-email" name="email" v-model="contactForm.email" required>
            </div>
            <div class="form-group">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="6" v-model="contactForm.message" required></textarea>
            </div>
            <button type="submit" class="cta-button" :disabled="isSubmittingContact">
              {{ isSubmittingContact ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </section>

      <section v-if="currentPage === 'login' && !user" class="contact-container">
        <h1 class="page-title">Admin Login</h1>
        <div class="contact-content">
          <form class="contact-form" @submit.prevent="login">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="loginForm.email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" v-model="loginForm.password" required>
            </div>
            <button type="submit" class="cta-button">Login</button>
          </form>
        </div>
      </section>

      <footer>
        <p data-testid="footer-copyright">&copy; 2026 RoPhil Portfolio</p>
        <!-- <div class="footer-social-buttons">
          <a href="https://www.instagram.com/rophil.art" target="_blank"><v-icon>mdi-instagram</v-icon></a>
          <a href="https://x.com/RoPhil_Art" target="_blank"><v-icon>mdi-twitter</v-icon></a>
          <a href="https://www.linkedin.com/in/rophil/" target="_blank"><v-icon>mdi-linkedin</v-icon></a>
          <a href="mailto:rophil.art@gmail.com" target="_blank"><v-icon>mdi-gmail</v-icon></a>
        </div> -->
      </footer>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <h2>Aggiungi Nuova Card</h2>
        <form @submit.prevent="addCard">
          <div class="form-group">
            <label for="altText">Testo Alternativo</label>
            <input type="text" v-model="newCard.alt" id="altText" required>
          </div>
          <div class="form-group">
            <label for="tag">Categoria</label>
            <select v-model="newCard.tag" id="tag" required>
              <option value="" disabled>Seleziona una categoria</option>
              <optgroup v-for="cat in categoryOptions" :key="cat.id" :label="cat.isParent ? cat.name : null">
                <option :value="cat.id" :disabled="cat.isParent">{{ cat.name }}</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group">
            <label for="mediaType">Tipo di contenuto</label>
            <select v-model="newCard.type" id="mediaType" data-testid="card-type-select">
              <option value="image">Immagine</option>
              <option value="youtube">Video YouTube</option>
            </select>
          </div>
          <div class="form-group" v-if="newCard.type === 'image'">
            <label for="imageFile">Immagine</label>
            <input type="file" @change="handleFileUpload" id="imageFile" accept="image/*" required>
          </div>
          <div class="form-group" v-else>
            <label for="youtubeUrl">Link YouTube</label>
            <input type="url" v-model.trim="newCard.youtubeUrl" id="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." required data-testid="youtube-url-input">
            <p v-if="youtubeUrlError" class="field-error" data-testid="youtube-url-error">{{ youtubeUrlError }}</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="closeAddModal">Annulla</button>
            <button type="submit" class="cta-button" :disabled="isUploading">{{ isUploading ? 'Elaborazione...' : 'Aggiungi' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSlideModal && editableSlide" class="modal-overlay" @click.self="closeSlideModal">
      <div class="modal-content slide-modal" data-testid="slide-modal">
        <h2>{{ editingSlideId ? 'Modifica Slide' : 'Nuova Slide' }}</h2>
        <form @submit.prevent="saveSlide">
          <div class="form-group">
            <label for="slideImageFile">Immagine di sfondo</label>
            <img v-if="editableSlide.src" :src="editableSlide.src" class="slide-image-preview" alt="Anteprima slide" data-testid="slide-image-preview" />
            <input type="file" id="slideImageFile" accept="image/*" @change="handleSlideImageUpload" data-testid="slide-image-input" />
          </div>
          <div class="form-group">
            <label for="slideTitle">Titolo</label>
            <input type="text" id="slideTitle" v-model="editableSlide.title" placeholder="Titolo della slide" data-testid="slide-title-input" />
          </div>
          <div class="form-group">
            <label for="slideSubtitle">Sottotitolo</label>
            <input type="text" id="slideSubtitle" v-model="editableSlide.subtitle" placeholder="Sottotitolo" data-testid="slide-subtitle-input" />
          </div>
          <div class="form-group">
            <label for="slideDescription">Testo descrittivo</label>
            <textarea id="slideDescription" rows="2" v-model="editableSlide.description" placeholder="Breve testo descrittivo (opzionale)" data-testid="slide-description-input"></textarea>
          </div>

          <div class="form-group">
            <label>Pulsanti CTA</label>
            <div v-for="(cta, i) in editableSlide.ctas" :key="i" class="cta-editor-row" :data-testid="`cta-editor-row-${i}`">
              <input type="text" v-model="cta.label" placeholder="Testo (es. Scopri di più)" :data-testid="`cta-label-input-${i}`" />
              <select v-model="cta.linkType" :data-testid="`cta-linktype-select-${i}`">
                <option value="internal">Pagina interna</option>
                <option value="external">Link esterno</option>
              </select>
              <select v-if="cta.linkType === 'internal'" v-model="cta.page" :data-testid="`cta-page-select-${i}`">
                <option v-for="p in heroInternalPages" :key="p.value" :value="p.value">{{ p.label }}</option>
              </select>
              <input v-else type="url" v-model.trim="cta.url" placeholder="https://..." :data-testid="`cta-url-input-${i}`" />
              <button type="button" class="cta-remove-btn" @click="removeSlideCta(i)" :aria-label="`Rimuovi CTA ${i + 1}`" :data-testid="`cta-remove-button-${i}`">
                <v-icon small>mdi-close</v-icon>
              </button>
            </div>
            <button type="button" class="add-subcategory-btn" @click="addSlideCta" data-testid="add-cta-button">+ Aggiungi CTA</button>
          </div>

          <div class="slide-config-grid">
            <div class="form-group">
              <label for="slideDuration">Durata (secondi)</label>
              <input type="number" id="slideDuration" min="2" max="30" v-model.number="editableSlide.duration" data-testid="slide-duration-input" />
            </div>
            <div class="form-group">
              <label for="slideTransition">Transizione</label>
              <select id="slideTransition" v-model="editableSlide.transition" data-testid="slide-transition-select">
                <option value="fade">Dissolvenza (fade)</option>
                <option value="slide">Scorrimento (slide)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="slideOverlay">Overlay</label>
              <select id="slideOverlay" v-model="editableSlide.overlay" data-testid="slide-overlay-select">
                <option value="dark">Scuro uniforme</option>
                <option value="gradient">Gradiente dal basso</option>
                <option value="none">Nessuno</option>
              </select>
            </div>
            <div class="form-group" v-if="editableSlide.overlay !== 'none'">
              <label for="slideOverlayOpacity">Intensità overlay: {{ editableSlide.overlayOpacity }}%</label>
              <input type="range" id="slideOverlayOpacity" min="0" max="90" step="5" v-model.number="editableSlide.overlayOpacity" data-testid="slide-overlay-opacity-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="slide-active-toggle">
              <input type="checkbox" v-model="editableSlide.active" data-testid="slide-active-checkbox" />
              Slide attiva (visibile sul sito)
            </label>
          </div>

          <p v-if="slideFormError" class="field-error" data-testid="slide-form-error">{{ slideFormError }}</p>
          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="closeSlideModal">Annulla</button>
            <button type="submit" class="cta-button" :disabled="isUploading || isSavingSlide" data-testid="slide-save-button">
              {{ isUploading ? 'Elaborazione immagine...' : (isSavingSlide ? 'Salvataggio...' : 'Salva Slide') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="lightboxVisible" class="lightbox" data-testid="lightbox">
      <template v-if="lightboxType === 'youtube'">
        <div class="video-frame-wrapper" @click.self="closeLightbox">
          <div class="video-frame-outer">
            <div class="video-frame">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${lightboxYoutubeId}?autoplay=1&rel=0`"
                title="Video YouTube"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                data-testid="lightbox-youtube-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          ref="zoomStage"
          class="zoom-stage"
          @click="onStageClick"
          @dblclick="onStageDblClick"
          @wheel.prevent="onZoomWheel"
          @mousedown="onPanStart"
          @mousemove="onPanMove"
          @mouseup="onPanEnd"
          @mouseleave="onPanEnd"
          @touchstart="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
        >
          <img
            ref="zoomImg"
            v-if="selectedImage"
            class="lightbox-content"
            :src="selectedImage"
            :style="zoomStyle"
            :class="{ 'is-zoomed': zoomScale > 1, 'is-interacting': zoomInteracting }"
            draggable="false"
            alt="Opera ingrandita"
          />
        </div>
        <div class="zoom-controls" @click.stop role="group" aria-label="Controlli zoom">
          <button type="button" @click="zoomOut" aria-label="Riduci zoom" data-testid="zoom-out-button">
            <v-icon>mdi-minus</v-icon>
          </button>
          <span class="zoom-level" data-testid="zoom-level">{{ Math.round(zoomScale * 100) }}%</span>
          <button type="button" @click="zoomIn" aria-label="Aumenta zoom" data-testid="zoom-in-button">
            <v-icon>mdi-plus</v-icon>
          </button>
          <button type="button" @click="resetZoom" aria-label="Ripristina dimensione originale" data-testid="zoom-reset-button">
            <v-icon>mdi-restore</v-icon>
          </button>
        </div>
      </template>
      <span class="close" @click="closeLightbox" role="button" tabindex="0" aria-label="Chiudi" @keydown.enter="closeLightbox" data-testid="lightbox-close">&times;</span>
    </div>

    <transition name="fade-in-up">
      <button v-show="showScrollToTop" class="scroll-to-top" :class="{ 'shifted-up': isAdmin }" @click="scrollToTop">
        <v-icon>mdi-arrow-up</v-icon>
      </button>
    </transition>

    <transition name="fade">
      <button v-if="isAdmin && currentPage === 'portfolio'" @click="showAddModal = true" class="fab">
        <v-icon>mdi-plus</v-icon>
      </button>
    </transition>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { auth, db } from '../firebaseConfig'; // Importa Firebase

// Dati di fallback da usare solo la PRIMA volta
const defaultFilters = [
  { name: 'All', id: 'all' },
  { name: 'Digital Art', id: 'digital-art' },
  { name: 'Sketchbook', id: 'sketchbook' },
  { name: 'Graphic Design', id: 'graphic-design', subcategories: [
      { name: 'Logos & Icons', id: 'logos-icons' },
      { name: 'Emojis', id: 'emojis' },
      { name: 'Promo Materials', id: 'promo-materials' }
    ] },
  { name: 'Animations', id: 'animations', subcategories: [
      { name: 'Frame by Frame', id: 'frame-by-frame' },
      { name: 'Loops & Shorts', id: 'loops-shorts' },
      { name: 'Timelapse & Process', id: 'timelapse-process' }
    ] },
  { name: 'NFT Projects', id: 'nft-projects', subcategories: [
      { name: 'Character Design', id: 'character-design' },
      { name: 'Accessories & Traits', id: 'accessories-traits' },
      { name: '1/1 Artworks', id: '1-1-artworks' }
    ] },
  { name: 'Commissions', id: 'commissions' }
];

const defaultAboutContent = {
  imageUrl: null, // Verrà popolato dinamicamente al primo avvio
  headline: "My name is Roberta, also known as RoPhil.",
  intro_p1: "I was born in 1995 and live in Italy. My passion for art didn’t begin at a specific moment—it has always been a part of me. As a child, I started drawing and simply never stopped. Growing up self-taught, I never doubted my love for art, though the journey to finding my path wasn’t always straightforward.",
  journey_headline: "The Journey",
  journey_p1: "Over time, I explored different creative forms. During my school years, I attended a graphic design institute, where I also developed an interest in photography...",
  journey_p2: "A new chapter began with my first iPad. It was the early days of NFTs, a time that inspired me to create not only images but also stories, characters, and worlds...",
  curiosity_headline: "Curiosity and Inspiration",
  curiosity_p1: "Today, I love moving between different creative disciplines and nurturing my curiosity: illustration, graphic design, logo and icon creation, along with small personal experiments in 3D art.",
  curiosity_p2: "Nature remains one of my greatest inspirations... or even from my cats, who often, unknowingly, become my best references.",
  cta_headline: "Let's Create Together",
  cta_p1: "My goal is to keep refining my style... each project will be a journey built with care.",
  quote: "\"Art is my way of telling the world’s stories—and I know I’ll never stop.\""
};

const CONTACT_FORM_RECIPIENT = 'rophil.art@gmail.com';


export default {
  name: 'PortfolioComponent',
  components: {
    draggable,
  },
  data() {
    return {
      // UI State
      currentPage: 'portfolio',
      navOpen: false,
      lightboxVisible: false,
      selectedImage: '',
      showScrollToTop: false,
      scrollLockActive: false,

      // Filters
      filters: [],
      activeFilter: null,
      parentFilter: null,

      // Data
      images: [],
      aboutContent: { imageUrl: require('../assets/rophil.jpg'), ...defaultAboutContent }, // Fallback visivo

      // Admin & Editing State
      user: null,
      isAdmin: false,
      loginForm: {
        email: '',
        password: ''
      },
      contactForm: {
        name: '',
        email: '',
        message: ''
      },
      isSubmittingContact: false,
      showAddModal: false,
      isUploading: false,
      newCard: {
        alt: '',
        tag: '',
        src: '',
        type: 'image',
        youtubeUrl: '',
        youtubeId: ''
      },
      youtubeUrlError: '',
      isEditingAbout: false,
      editableAboutContent: null,
      editingFilterId: null,
      editingFilterName: '',

      // Lightbox zoom state
      lightboxType: 'image',
      lightboxYoutubeId: '',
      zoomScale: 1,
      zoomTx: 0,
      zoomTy: 0,
      zoomInteracting: false,
      panState: null,
      pinchState: null,
      lastTapTime: 0,
      stageMoved: false,

      // About section images
      aboutSectionImages: {},
      editableSectionImages: null,
      pendingImageSlot: null,

      // Hero slider
      heroSlides: [],
      heroIndex: 0,
      heroTransitionName: 'hero-fade',
      heroPaused: false,
      heroTimer: null,
      heroTouchStartX: null,
      showSlideModal: false,
      editableSlide: null,
      editingSlideId: null,
      isSavingSlide: false,
      slideFormError: '',
    };
  },
  computed: {
    zoomStyle() {
      return {
        transform: `translate(${this.zoomTx}px, ${this.zoomTy}px) scale(${this.zoomScale})`
      };
    },
    aboutImageSlots() {
      const c = this.aboutContent || {};
      return [
        { key: 'intro', label: `Dopo l'introduzione` },
        { key: 'journey', label: `Dopo "${c.journey_headline || 'The Journey'}"` },
        { key: 'curiosity', label: `Dopo "${c.curiosity_headline || 'Curiosity and Inspiration'}"` },
        { key: 'cta', label: `Dopo "${c.cta_headline || "Let's Create Together"}"` }
      ];
    },
    capitalizedPageTitle() {
      if (!this.activeFilter) return 'Portfolio';
      if (this.activeFilter.name === 'All') return 'Portfolio';
      return this.activeFilter.name.charAt(0).toUpperCase() + this.activeFilter.name.slice(1);
    },
    activeMainFilter() {
      if (!this.activeFilter) return null;
      if (this.activeFilter.subcategories && this.activeFilter.subcategories.length > 0) {
        return this.activeFilter;
      }
      const parent = this.filters.find(
        filter => Array.isArray(filter.subcategories) && filter.subcategories.some(sub => sub.id === this.activeFilter.id)
      );
      return parent || this.activeFilter;
    },
    visibleSubcategories() {
      if (!this.activeMainFilter || !Array.isArray(this.activeMainFilter.subcategories)) return [];
      return this.activeMainFilter.subcategories;
    },
    filteredImages() {
      if (!this.activeFilter || this.activeFilter.id === 'all') {
        return this.images;
      }
      if (this.activeFilter.subcategories) {
        const subFilterIds = this.activeFilter.subcategories.map(sf => sf.id);
        return this.images.filter(img => subFilterIds.includes(img.tag));
      }
      return this.images.filter(img => img.tag === this.activeFilter.id);
    },
    categoryOptions() {
      const options = [];
      this.filters.forEach(filter => {
        if (filter.id === 'all') return;
        if (filter.subcategories && filter.subcategories.length > 0) {
          options.push({ name: filter.name, id: filter.id, isParent: true });
          filter.subcategories.forEach(sub => {
            options.push({ name: `  - ${sub.name}`, id: sub.id, isParent: false });
          });
        } else {
          options.push({ name: filter.name, id: filter.id, isParent: false });
        }
      });
      return options;
    },
    manageableFilters: {
      get() {
        return this.filters.filter(filter => filter.id !== 'all');
      },
      set(newOrder) {
        const allFilter = this.filters.find(filter => filter.id === 'all');
        this.filters = allFilter ? [allFilter, ...newOrder] : newOrder;
      }
    },
    activeSlides() {
      return this.heroSlides.filter(s => s.active !== false && s.src);
    },
    safeHeroIndex() {
      if (!this.activeSlides.length) return 0;
      return Math.min(this.heroIndex, this.activeSlides.length - 1);
    },
    currentHeroSlide() {
      if (!this.activeSlides.length) return null;
      return this.activeSlides[this.safeHeroIndex];
    },
    heroInternalPages() {
      return [
        { value: 'portfolio', label: 'Portfolio (Home)' },
        { value: 'about', label: 'About Me' },
        { value: 'contact', label: 'Contact Me' }
      ];
    }
  },
  methods: {
    // --- UI Navigation ---
    changePage(page) {
      this.currentPage = page;
      this.closeNav();
      this.scrollToTop();
      this.$nextTick(() => this.scheduleHeroAutoplay());
    },
    displayFilterName(filter) {
      if (!filter) return '';
      return filter.id === 'all' ? 'All Works' : filter.name;
    },
    selectFilter(filter, parent = null) {
      if (!filter) return;
      if (parent) {
        this.parentFilter = parent;
      } else if (filter.subcategories && filter.subcategories.length > 0) {
        this.parentFilter = filter;
      } else {
        this.parentFilter = null;
      }
      this.activeFilter = filter;
    },
    goBack() {
      this.parentFilter = null;
      this.activeFilter = this.filters[0];
    },

    // --- Data Persistence (Firebase) ---
    fetchImages() {
      db.collection('portfolioImages').orderBy('order', 'asc').get()
          .then(s => {
            this.images = s.docs.map(doc => ({ id: doc.id, ...doc.data(), loaded: false }));

          })
          .catch(err => console.error("Errore fetch immagini: ", err));
    },
    saveImages() {
      const batch = db.batch();
      this.images.forEach((img, i) => {
        batch.update(db.collection('portfolioImages').doc(img.id), { order: i });
      });
      batch.commit();
    },
    fetchAboutContent() {
      const docRef = db.collection('siteContent').doc('about');
      docRef.get()
          .then(doc => {
            if (doc.exists) {
              this.aboutContent = doc.data();
            } else {
              // Prima esecuzione in assoluto: converti l'immagine di default in Base64 e salva tutto
              const imageUrl = require('../assets/rophil.jpg');
              this.urlToBase64(imageUrl).then(base64 => {
                const contentToSave = { ...defaultAboutContent, imageUrl: base64 };
                this.aboutContent = contentToSave; // Aggiorna lo stato locale
                docRef.set(contentToSave); // Salva su Firestore per le volte successive
              });
            }
          })
          .catch(err => console.error("Errore fetch about: ", err));
    },
    saveAboutContent() {
      const batch = db.batch();
      batch.set(db.collection('siteContent').doc('about'), this.editableAboutContent);
      ['intro', 'journey', 'curiosity', 'cta'].forEach(key => {
        const ref = db.collection('aboutSectionImages').doc(key);
        const img = this.editableSectionImages && this.editableSectionImages[key];
        if (img && img.src) {
          batch.set(ref, { src: img.src, alt: img.alt || '' });
        } else {
          batch.delete(ref);
        }
      });
      batch.commit()
          .then(() => {
            this.aboutContent = JSON.parse(JSON.stringify(this.editableAboutContent));
            this.aboutSectionImages = JSON.parse(JSON.stringify(this.editableSectionImages || {}));
            this.isEditingAbout = false;
            this.editableAboutContent = null;
            this.editableSectionImages = null;
            alert('Sezione "About Me" aggiornata!');
          })
          .catch(err => {
            console.error("Errore salvataggio about: ", err);
            alert(`Errore durante il salvataggio: ${err.message}`);
          });
    },
    fetchFilters() {
      db.collection('siteContent').doc('categories').get()
          .then(doc => {
            if (doc.exists && doc.data().filtersArray) {
              this.filters = doc.data().filtersArray;
            } else {
              this.filters = defaultFilters;
              db.collection('siteContent').doc('categories').set({ filtersArray: defaultFilters });
            }
            this.activeFilter = this.filters[0];
          })
          .catch(err => console.error("Errore fetch categorie: ", err));
    },
    saveFilters() {
      db.collection('siteContent').doc('categories').set({ filtersArray: this.filters })
          .then(() => alert('Struttura categorie salvata!'))
          .catch(err => console.error("Errore salvataggio categorie: ", err));
    },

    // --- Hero Slider ---
    fetchHeroSlides() {
      db.collection('heroSlides').orderBy('order', 'asc').get()
          .then(s => {
            this.heroSlides = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.heroIndex = 0;
            this.scheduleHeroAutoplay();
          })
          .catch(err => console.error('Errore fetch hero slides: ', err));
    },
    stopHeroAutoplay() {
      if (this.heroTimer) {
        clearTimeout(this.heroTimer);
        this.heroTimer = null;
      }
    },
    scheduleHeroAutoplay() {
      this.stopHeroAutoplay();
      if (this.currentPage !== 'portfolio') return;
      if (this.heroPaused || document.hidden) return;
      if (this.activeSlides.length < 2) return;
      const slide = this.currentHeroSlide;
      const seconds = slide && Number(slide.duration) > 0 ? Number(slide.duration) : 6;
      this.heroTimer = setTimeout(() => this.nextHeroSlide(), seconds * 1000);
    },
    goToHeroSlide(newIndex, direction) {
      const total = this.activeSlides.length;
      if (!total) return;
      const idx = ((newIndex % total) + total) % total;
      if (idx === this.safeHeroIndex) {
        this.scheduleHeroAutoplay();
        return;
      }
      const dir = direction || (idx > this.safeHeroIndex ? 'next' : 'prev');
      const target = this.activeSlides[idx];
      const type = target && target.transition === 'slide' ? 'slide' : 'fade';
      this.heroTransitionName = type === 'fade' ? 'hero-fade' : (dir === 'prev' ? 'hero-slide-prev' : 'hero-slide-next');
      this.heroIndex = idx;
      this.scheduleHeroAutoplay();
    },
    nextHeroSlide() {
      this.goToHeroSlide(this.safeHeroIndex + 1, 'next');
    },
    prevHeroSlide() {
      this.goToHeroSlide(this.safeHeroIndex - 1, 'prev');
    },
    pauseHero() {
      this.heroPaused = true;
      this.stopHeroAutoplay();
    },
    resumeHero() {
      this.heroPaused = false;
      this.scheduleHeroAutoplay();
    },
    onHeroTouchStart(e) {
      if (e.touches && e.touches.length === 1) {
        this.heroTouchStartX = e.touches[0].clientX;
      }
    },
    onHeroTouchEnd(e) {
      if (this.heroTouchStartX === null) return;
      const endX = e.changedTouches && e.changedTouches.length ? e.changedTouches[0].clientX : null;
      if (endX !== null) {
        const delta = endX - this.heroTouchStartX;
        if (Math.abs(delta) > 45) {
          delta < 0 ? this.nextHeroSlide() : this.prevHeroSlide();
        }
      }
      this.heroTouchStartX = null;
    },
    onHeroVisibilityChange() {
      this.scheduleHeroAutoplay();
    },
    heroOverlayStyle(slide) {
      const raw = Number(slide.overlayOpacity);
      const op = (isNaN(raw) ? 45 : Math.min(90, Math.max(0, raw))) / 100;
      if (slide.overlay === 'none') return { background: 'transparent' };
      if (slide.overlay === 'gradient') {
        return {
          background: `linear-gradient(to top, rgba(0,0,0,${Math.min(op + 0.25, 0.9).toFixed(2)}) 0%, rgba(0,0,0,${(op * 0.6).toFixed(2)}) 50%, rgba(0,0,0,0.05) 100%)`
        };
      }
      return { background: `rgba(0,0,0,${op})` };
    },
    handleHeroCta(cta) {
      this.changePage(cta.page || 'portfolio');
    },

    // --- Hero Slider Admin ---
    blankSlide() {
      return {
        title: '',
        subtitle: '',
        description: '',
        src: '',
        active: true,
        duration: 6,
        transition: 'fade',
        overlay: 'dark',
        overlayOpacity: 45,
        ctas: []
      };
    },
    openSlideModal(slide) {
      if (slide) {
        this.editingSlideId = slide.id;
        const copy = JSON.parse(JSON.stringify(slide));
        this.editableSlide = {
          ...this.blankSlide(),
          ...copy,
          active: copy.active !== false,
          ctas: Array.isArray(copy.ctas) ? copy.ctas.map(c => ({ label: c.label || '', linkType: c.linkType === 'external' ? 'external' : 'internal', url: c.url || '', page: c.page || 'portfolio' })) : []
        };
      } else {
        this.editingSlideId = null;
        this.editableSlide = this.blankSlide();
      }
      this.slideFormError = '';
      this.showSlideModal = true;
    },
    closeSlideModal() {
      this.showSlideModal = false;
      this.editableSlide = null;
      this.editingSlideId = null;
      this.slideFormError = '';
    },
    handleSlideImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.compressImage(file, (result) => {
        this.editableSlide.src = result;
      });
    },
    addSlideCta() {
      this.editableSlide.ctas.push({ label: '', linkType: 'internal', url: '', page: 'portfolio' });
    },
    removeSlideCta(index) {
      this.editableSlide.ctas.splice(index, 1);
    },
    saveSlide() {
      this.slideFormError = '';
      const s = this.editableSlide;
      if (!s.src) {
        this.slideFormError = 'Carica un\'immagine di sfondo per la slide.';
        return;
      }
      for (const cta of s.ctas) {
        if (!cta.label || !cta.label.trim()) {
          this.slideFormError = 'Ogni pulsante CTA deve avere un testo.';
          return;
        }
        if (cta.linkType === 'external' && !/^https?:\/\/.+/.test(cta.url || '')) {
          this.slideFormError = `URL non valido per la CTA "${cta.label}". Deve iniziare con http:// o https://`;
          return;
        }
      }
      const payload = {
        title: (s.title || '').trim(),
        subtitle: (s.subtitle || '').trim(),
        description: (s.description || '').trim(),
        src: s.src,
        active: s.active !== false,
        duration: Math.min(30, Math.max(2, Number(s.duration) || 6)),
        transition: s.transition === 'slide' ? 'slide' : 'fade',
        overlay: ['dark', 'gradient', 'none'].includes(s.overlay) ? s.overlay : 'dark',
        overlayOpacity: Math.min(90, Math.max(0, Number(s.overlayOpacity) || 0)),
        ctas: s.ctas.map(c => ({
          label: c.label.trim(),
          linkType: c.linkType === 'external' ? 'external' : 'internal',
          url: c.linkType === 'external' ? (c.url || '').trim() : '',
          page: c.linkType === 'external' ? '' : (c.page || 'portfolio')
        }))
      };
      this.isSavingSlide = true;
      if (this.editingSlideId) {
        const id = this.editingSlideId;
        const existing = this.heroSlides.find(sl => sl.id === id);
        const order = existing ? existing.order : this.heroSlides.length;
        db.collection('heroSlides').doc(id).set({ ...payload, order })
            .then(() => {
              const idx = this.heroSlides.findIndex(sl => sl.id === id);
              if (idx !== -1) this.$set(this.heroSlides, idx, { id, ...payload, order });
              this.isSavingSlide = false;
              this.closeSlideModal();
              this.scheduleHeroAutoplay();
            })
            .catch(err => {
              this.isSavingSlide = false;
              this.slideFormError = `Errore durante il salvataggio: ${err.message}`;
            });
      } else {
        const order = this.heroSlides.length;
        db.collection('heroSlides').add({ ...payload, order })
            .then(docRef => {
              this.heroSlides.push({ id: docRef.id, ...payload, order });
              this.isSavingSlide = false;
              this.closeSlideModal();
              this.scheduleHeroAutoplay();
            })
            .catch(err => {
              this.isSavingSlide = false;
              this.slideFormError = `Errore durante il salvataggio: ${err.message}`;
            });
      }
    },
    deleteSlide(slideId) {
      if (!confirm('Eliminare definitivamente questa slide?')) return;
      db.collection('heroSlides').doc(slideId).delete()
          .then(() => {
            this.heroSlides = this.heroSlides.filter(sl => sl.id !== slideId);
            this.heroIndex = 0;
            this.saveSlideOrder();
            this.scheduleHeroAutoplay();
          })
          .catch(err => alert(`Errore: ${err.message}`));
    },
    toggleSlideActive(slide) {
      const newValue = slide.active === false;
      db.collection('heroSlides').doc(slide.id).update({ active: newValue })
          .then(() => {
            const idx = this.heroSlides.findIndex(sl => sl.id === slide.id);
            if (idx !== -1) this.$set(this.heroSlides[idx], 'active', newValue);
            this.heroIndex = 0;
            this.scheduleHeroAutoplay();
          })
          .catch(err => alert(`Errore: ${err.message}`));
    },
    saveSlideOrder() {
      if (!this.heroSlides.length) return;
      const batch = db.batch();
      this.heroSlides.forEach((slide, i) => {
        slide.order = i;
        batch.update(db.collection('heroSlides').doc(slide.id), { order: i });
      });
      batch.commit()
          .then(() => {
            this.heroIndex = 0;
            this.scheduleHeroAutoplay();
          })
          .catch(err => alert(`Errore nel salvataggio dell'ordine: ${err.message}`));
    },

    // --- Authentication (Firebase) ---
    login() {
      auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
          .then(cred => db.collection('admins').doc(cred.user.uid).get())
          .then(doc => {
            if (doc.exists) {
              alert('Login effettuato con successo come Admin!');
              this.changePage('portfolio');
            } else {
              auth.signOut();
              alert('Login riuscito, ma non hai i privilegi di amministratore.');
            }
          })
          .catch(error => {
            alert(`Errore di login: ${error.message}`);
          });
    },
    logout() {
      auth.signOut();
    },

    // --- Content Management ---
    closeAddModal() {
      this.showAddModal = false;
      this.newCard = { alt: '', tag: '', src: '', type: 'image', youtubeUrl: '', youtubeId: '' };
      this.youtubeUrlError = '';
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.compressImage(file, (result) => {
        this.newCard.src = result;
      });
    },
    addCard() {
      this.youtubeUrlError = '';
      if (this.newCard.type === 'youtube') {
        const id = this.extractYoutubeId(this.newCard.youtubeUrl);
        if (!id) {
          this.youtubeUrlError = 'Link YouTube non valido. Usa un URL come https://www.youtube.com/watch?v=... oppure https://youtu.be/...';
          return;
        }
        this.newCard.youtubeId = id;
        this.newCard.src = '';
      } else if (!this.newCard.src) {
        alert('Carica un\'immagine.');
        return;
      }
      if (!this.newCard.tag) {
        alert('Seleziona una categoria.');
        return;
      }
      this.isUploading = true;

      const cardData = {
        ...this.newCard,
        order: this.images.length
      };


      db.collection('portfolioImages').add({
        ...this.newCard,
        order: this.images.length
      })
          .then((docRef) => {
            const newImageForUI = {
              ...cardData,
              id: docRef.id, // Usa l'ID generato da Firestore
              loaded: false  // Imposta la proprietà reattiva per la nuova card
            };

            this.images.push(newImageForUI); // Aggiungi la nuova card alla fine dell'array locale

            this.isUploading = false;
            this.closeAddModal();
          })
          .catch(err => {
            this.isUploading = false;
            alert(`Errore: ${err.message}`);
          });
    },
    removeCard(cardId) {
      if (!confirm('Sei sicuro?')) return;
      db.collection('portfolioImages').doc(cardId).delete()
          .then(() => {
            this.fetchImages();
          })
          .catch(err => alert(`Errore: ${err.message}`));
    },
    startEditingAbout() {
      this.editableAboutContent = JSON.parse(JSON.stringify(this.aboutContent));
      this.editableSectionImages = JSON.parse(JSON.stringify(this.aboutSectionImages || {}));
      this.isEditingAbout = true;
    },
    cancelEditingAbout() {
      this.isEditingAbout = false;
      this.editableAboutContent = null;
      this.editableSectionImages = null;
    },
    triggerAboutImageUpload() {
      this.$refs.aboutImageInput.click();
    },
    handleAboutImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.compressImage(file, (result) => {
        this.editableAboutContent.imageUrl = result;
      });
    },
    addCategory() {
      const name = prompt("Nome della nuova categoria principale:");
      if (!name) return;
      const id = name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      this.filters.push({ name: name.trim(), id: id, subcategories: [] });
      this.saveFilters();
    },
    addSubcategory(parentFilter) {
      const name = prompt(`Nome della nuova sottocategoria per "${parentFilter.name}":`);
      if (!name) return;
      if (!parentFilter.subcategories) {
        this.$set(parentFilter, 'subcategories', []);
      }
      const id = name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      parentFilter.subcategories.push({ name: name.trim(), id: id });
      this.saveFilters();
    },
    startEditingFilter(filter) {
      this.editingFilterId = filter.id;
      this.editingFilterName = filter.name;
    },
    cancelFilterEdit() {
      this.editingFilterId = null;
      this.editingFilterName = '';
    },
    saveFilterEdit(filterToUpdate) {
      if (!this.editingFilterName) {
        alert("Il nome non può essere vuoto.");
        return;
      }

      let found = false;
      for (const f of this.filters) {
        if (f.id === filterToUpdate.id) {
          f.name = this.editingFilterName.trim();
          found = true;
          break;
        }
        if (f.subcategories) {
          for (const s of f.subcategories) {
            if (s.id === filterToUpdate.id) {
              s.name = this.editingFilterName.trim();
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
      this.saveFilters();
      this.cancelFilterEdit();
    },
    deleteFilter(filterId) {
      if (!confirm("Sei sicuro? Le card associate non verranno eliminate.")) return;
      this.filters = this.filters.filter(f => f.id !== filterId).map(f => {
        if (f.subcategories) {
          f.subcategories = f.subcategories.filter(s => s.id !== filterId);
        }
        return f;
      });
      this.saveFilters();
    },

    // --- Utility Methods ---
    urlToBase64(url) {
      return fetch(url)
          .then(response => response.blob())
          .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }));
    },
    // compressImage(file, callback) {
    //   const MAX_SIZE_BYTES = 1000000;
    //   const MAX_DIMENSION = 1920;
    //   const QUALITY = 0.75;
    //
    //   if (file.size <= MAX_SIZE_BYTES && file.type !== 'image/png') {
    //     const reader = new FileReader();
    //     reader.onload = e => callback(e.target.result);
    //     reader.readAsDataURL(file);
    //     return;
    //   }
    //
    //   this.isUploading = true;
    //   const reader = new FileReader();
    //   reader.onload = e => {
    //     const img = new Image();
    //     img.onload = () => {
    //       let { width, height } = img;
    //       if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    //         if (width > height) {
    //           height *= MAX_DIMENSION / width;
    //           width = MAX_DIMENSION;
    //         } else {
    //           width *= MAX_DIMENSION / height;
    //           height = MAX_DIMENSION;
    //         }
    //       }
    //
    //       const canvas = document.createElement('canvas');
    //       canvas.width = width;
    //       canvas.height = height;
    //       const ctx = canvas.getContext('2d');
    //       ctx.drawImage(img, 0, 0, width, height);
    //
    //       const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    //       const quality = file.type === 'image/png' ? 1.0 : QUALITY;
    //       callback(canvas.toDataURL(mime, quality));
    //       this.isUploading = false;
    //     };
    //     img.src = e.target.result;
    //   };
    //   reader.readAsDataURL(file);
    // },

    compressImage(file, callback) {
      const MAX_SIZE_BYTES = 1000000; // 1 MiB
      const MAX_DIMENSION = 1920;
      const MIME_TYPE = 'image/jpeg'; // Forza la conversione in JPEG per una compressione efficace

      this.isUploading = true;
      const reader = new FileReader();

      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // 1. Ridimensiona l'immagine se supera le dimensioni massime iniziali
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            } else {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
          }

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Funzione ricorsiva per tentare la compressione
          const attemptCompression = (currentWidth, currentHeight, quality) => {
            // Arrotonda le dimensioni per evitare errori nel canvas
            const w = Math.round(currentWidth);
            const h = Math.round(currentHeight);

            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);

            // Usa canvas.toBlob per ottenere la dimensione reale del file
            canvas.toBlob(
                (blob) => {
                  // 2. Controlla se la dimensione del file è inferiore alla soglia
                  if (blob.size <= MAX_SIZE_BYTES) {
                    // SUCCESSO: La dimensione è corretta, converti il blob in DataURL e termina
                    const blobReader = new FileReader();
                    blobReader.onloadend = () => {
                      callback(blobReader.result);
                      this.isUploading = false;
                    };
                    blobReader.readAsDataURL(blob);
                    return;
                  }

                  // 3. FALLIMENTO: Il file è ancora troppo grande, decidiamo come procedere

                  // Se la qualità è ancora abbastanza alta, la riduciamo
                  if (quality > 0.5) {
                    const nextQuality = quality - 0.1;
                    attemptCompression(currentWidth, currentHeight, nextQuality);
                  }
                  // Se la qualità è già bassa, dobbiamo ridurre le dimensioni dell'immagine
                  else {
                    const nextWidth = currentWidth * 0.9;
                    const nextHeight = currentHeight * 0.9;

                    // Condizione di arresto per evitare un ciclo infinito o immagini troppo piccole
                    if (nextWidth < 400) {
                      console.error("Impossibile comprimere l'immagine sotto 1 MiB senza degradarla eccessivamente.");
                      // In questo caso estremo, restituiamo l'ultimo risultato (anche se fuori misura)
                      const blobReader = new FileReader();
                      blobReader.onloadend = () => {
                        callback(blobReader.result);
                        this.isUploading = false;
                      };
                      blobReader.readAsDataURL(blob);
                      return;
                    }

                    // Riprova con dimensioni ridotte e ripristina la qualità iniziale
                    attemptCompression(nextWidth, nextHeight, 0.92);
                  }
                },
                MIME_TYPE,
                quality
            );
          };

          // Avvia il primo tentativo di compressione con alta qualità
          attemptCompression(width, height, 0.92);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    openLightbox(item) {
      if (item && typeof item === 'object' && item.type === 'youtube') {
        if (!item.youtubeId) return;
        this.lightboxType = 'youtube';
        this.lightboxYoutubeId = item.youtubeId;
        this.selectedImage = '';
      } else {
        this.lightboxType = 'image';
        this.selectedImage = item && typeof item === 'object' ? item.src : item;
      }
      this.resetZoom();
      this.lightboxVisible = true;
      this.lockBodyScroll();
    },
    closeLightbox() {
      this.lightboxVisible = false;
      this.lightboxYoutubeId = '';
      this.resetZoom();
      this.unlockBodyScroll();
    },

    // --- Zoom lightbox ---
    clampScale(s) {
      return Math.min(5, Math.max(1, s));
    },
    clampPan() {
      const img = this.$refs.zoomImg;
      if (!img) return;
      const maxX = Math.max(0, (img.offsetWidth * (this.zoomScale - 1)) / 2);
      const maxY = Math.max(0, (img.offsetHeight * (this.zoomScale - 1)) / 2);
      this.zoomTx = Math.min(maxX, Math.max(-maxX, this.zoomTx));
      this.zoomTy = Math.min(maxY, Math.max(-maxY, this.zoomTy));
    },
    setScale(s) {
      this.zoomScale = this.clampScale(s);
      if (this.zoomScale === 1) {
        this.zoomTx = 0;
        this.zoomTy = 0;
      } else {
        this.clampPan();
      }
    },
    zoomIn() {
      this.setScale(this.zoomScale * 1.3);
    },
    zoomOut() {
      this.setScale(this.zoomScale / 1.3);
    },
    resetZoom() {
      this.zoomScale = 1;
      this.zoomTx = 0;
      this.zoomTy = 0;
      this.zoomInteracting = false;
      this.panState = null;
      this.pinchState = null;
      this.stageMoved = false;
    },
    onZoomWheel(e) {
      this.setScale(this.zoomScale * Math.exp(-e.deltaY * 0.002));
    },
    onPanStart(e) {
      if (this.zoomScale <= 1) return;
      e.preventDefault();
      this.panState = { x: e.clientX, y: e.clientY, tx: this.zoomTx, ty: this.zoomTy };
      this.zoomInteracting = true;
    },
    onPanMove(e) {
      if (!this.panState) return;
      this.zoomTx = this.panState.tx + (e.clientX - this.panState.x);
      this.zoomTy = this.panState.ty + (e.clientY - this.panState.y);
      this.stageMoved = true;
      this.clampPan();
    },
    onPanEnd() {
      this.panState = null;
      this.zoomInteracting = false;
    },
    onStageClick(e) {
      if (this.stageMoved) {
        this.stageMoved = false;
        return;
      }
      if (e.target === this.$refs.zoomStage) this.closeLightbox();
    },
    onStageDblClick() {
      this.setScale(this.zoomScale > 1 ? 1 : 2.2);
    },
    touchDistance(t) {
      return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    },
    touchMidpoint(t) {
      return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
    },
    onTouchStart(e) {
      if (e.touches.length === 2) {
        this.pinchState = {
          dist: this.touchDistance(e.touches),
          scale: this.zoomScale,
          tx: this.zoomTx,
          ty: this.zoomTy,
          mid: this.touchMidpoint(e.touches)
        };
        this.zoomInteracting = true;
      } else if (e.touches.length === 1) {
        const now = Date.now();
        if (now - this.lastTapTime < 300) {
          this.onStageDblClick();
          this.lastTapTime = 0;
        } else {
          this.lastTapTime = now;
        }
        if (this.zoomScale > 1) {
          this.panState = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: this.zoomTx, ty: this.zoomTy };
          this.zoomInteracting = true;
        }
      }
    },
    onTouchMove(e) {
      if (e.touches.length === 2 && this.pinchState) {
        const d = this.touchDistance(e.touches);
        const mid = this.touchMidpoint(e.touches);
        this.zoomScale = this.clampScale(this.pinchState.scale * (d / this.pinchState.dist));
        this.zoomTx = this.pinchState.tx + (mid.x - this.pinchState.mid.x);
        this.zoomTy = this.pinchState.ty + (mid.y - this.pinchState.mid.y);
        this.clampPan();
      } else if (e.touches.length === 1 && this.panState) {
        this.zoomTx = this.panState.tx + (e.touches[0].clientX - this.panState.x);
        this.zoomTy = this.panState.ty + (e.touches[0].clientY - this.panState.y);
        this.clampPan();
      }
    },
    onTouchEnd(e) {
      if (e.touches.length < 2) this.pinchState = null;
      if (e.touches.length === 0) {
        this.panState = null;
        this.zoomInteracting = false;
      }
    },

    // --- YouTube helpers ---
    youtubeThumb(id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    },
    extractYoutubeId(url) {
      if (!url) return null;
      const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      return m ? m[1] : null;
    },

    // --- Image loading robustness ---
    onImgLoad(image) {
      if (image && !image.loaded) image.loaded = true;
    },
    checkImagesLoaded() {
      if (!this.$el || !this.$el.querySelectorAll) return;
      const imgs = this.$el.querySelectorAll('img[data-image-id]');
      imgs.forEach(el => {
        if (el.complete && el.naturalWidth > 0) {
          const match = this.images.find(i => String(i.id) === el.getAttribute('data-image-id'));
          if (match && !match.loaded) match.loaded = true;
        }
      });
    },
    onViewportChange() {
      this.$nextTick(this.checkImagesLoaded);
    },

    // --- About section images ---
    sectionImage(key) {
      const source = this.isEditingAbout && this.editableSectionImages ? this.editableSectionImages : this.aboutSectionImages;
      return source && source[key] && source[key].src ? source[key] : null;
    },
    fetchAboutImages() {
      db.collection('aboutSectionImages').get()
          .then(snap => {
            const map = {};
            snap.docs.forEach(d => { map[d.id] = d.data(); });
            this.aboutSectionImages = map;
          })
          .catch(err => console.error('Errore fetch immagini about: ', err));
    },
    triggerSectionImageUpload(key) {
      this.pendingImageSlot = key;
      this.$refs.sectionImageInput.click();
    },
    handleSectionImageUpload(event) {
      const file = event.target.files[0];
      const slot = this.pendingImageSlot;
      event.target.value = '';
      if (!file || !slot) return;
      this.compressImage(file, (result) => {
        const existing = this.editableSectionImages[slot] || { alt: '' };
        this.$set(this.editableSectionImages, slot, { ...existing, src: result });
      });
    },
    updateSectionImageAlt(key, value) {
      if (this.editableSectionImages[key]) {
        this.$set(this.editableSectionImages, key, { ...this.editableSectionImages[key], alt: value });
      }
    },
    removeSectionImage(key) {
      this.$delete(this.editableSectionImages, key);
    },
    lockBodyScroll() {
      if (this.scrollLockActive) return;
      this.scrollLockActive = true;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.addEventListener('wheel', this.preventScroll, { passive: false });
      window.addEventListener('touchmove', this.preventScroll, { passive: false });
      window.addEventListener('keydown', this.preventScrollKeys, { passive: false });
    },
    unlockBodyScroll() {
      if (!this.scrollLockActive) return;
      this.scrollLockActive = false;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('wheel', this.preventScroll, { passive: false });
      window.removeEventListener('touchmove', this.preventScroll, { passive: false });
      window.removeEventListener('keydown', this.preventScrollKeys, { passive: false });
    },
    preventScroll(event) {
      event.preventDefault();
    },
    preventScrollKeys(event) {
      if (event.key === 'Escape' && this.lightboxVisible) {
        this.closeLightbox();
        return;
      }
      const blockedKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    },
    toggleNav() {
      this.navOpen = !this.navOpen;
    },
    closeNav() {
      this.navOpen = false;
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async submitForm() {
      if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
        alert('Compila tutti i campi del form di contatto.');
        return;
      }

      this.isSubmittingContact = true;
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_FORM_RECIPIENT)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name: this.contactForm.name,
            email: this.contactForm.email,
            message: this.contactForm.message,
            _subject: `Nuovo messaggio dal portfolio - ${this.contactForm.name}`,
            _template: 'box'
          })
        });

        const result = await response.json();
        if (!response.ok || result.success === 'false') {
          throw new Error(result.message || 'Invio non riuscito');
        }

        this.contactForm = { name: '', email: '', message: '' };
        alert('Messaggio inviato con successo!');
      } catch (error) {
        console.error('Errore invio form contatti:', error);
        alert('Errore durante l’invio del messaggio. Riprova tra poco.');
      } finally {
        this.isSubmittingContact = false;
      }
    },
  },
  created() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        db.collection('admins').doc(user.uid).get().then(doc => {
          this.isAdmin = doc.exists;
        });
      } else {
        this.user = null;
        this.isAdmin = false;
      }
    });
    this.fetchFilters();
    this.fetchImages();
    this.fetchAboutContent();
    this.fetchAboutImages();
    this.fetchHeroSlides();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.onViewportChange);
    window.addEventListener('orientationchange', this.onViewportChange);
    document.addEventListener('visibilitychange', this.onHeroVisibilityChange);
  },
  updated() {
    this.checkImagesLoaded();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.onViewportChange);
    window.removeEventListener('orientationchange', this.onViewportChange);
    document.removeEventListener('visibilitychange', this.onHeroVisibilityChange);
    this.stopHeroAutoplay();
    this.unlockBodyScroll();
  }
}
</script>

<style scoped>
/* Il tuo CSS originale e completo, con le aggiunte per le nuove funzionalità */
.portfolio-container {
  --header-height: 92px;
  font-family: 'Nunito', sans-serif;
  background-color: #f8f8f8;
  color: #393939;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.top-navbar {
  height: var(--header-height);
  background-image: url('../assets/banner_rob.png');
  background-size: cover;
  background-position: center;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0 18px;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  position: relative;
}

.logo {
  max-width: 84px;
  height: auto;
  display: block;
}

.social-buttons-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.social-buttons-header .v-icon {
  color: white;
  font-size: 24px;
  transition: transform 0.3s ease;
}

.social-buttons-header .v-icon:hover {
  transform: scale(1.2);
}

.logo-button-left {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-self: start;
}

.logo-pill {
  display: inline-grid;
  place-items: center;
}

footer {
  text-align: center;
  padding: 1.5em;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-social-buttons {
  display: flex;
  gap: 1.5rem;
  font-size: 24px;
}

.footer-social-buttons .v-icon {
  color: #393939;
  transition: all 0.3s ease;
}

.footer-social-buttons .v-icon:hover {
  transform: translateY(-3px) scale(1.1);
  color: #e4767f;
}

.filter-pyramid {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 6px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-x: visible;
  margin: 8px 0;
  padding: 2px 8px 6px;
  gap: 0.5rem;
}

.filter-bar::-webkit-scrollbar {
  display: none;
}

.filter-bar-main button {
  font-weight: 700;
}

.filter-bar-sub {
  margin-top: 0;
  padding-left: 0;
  gap: 0.75rem;
}

.filter-bar-sub button {
  font-size: 0.95rem;
  font-weight: 400;
}

.filter-bar button {
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  color: #4a4a4a;
  cursor: pointer;
  padding: 6px 12px;
  position: relative;
  transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.filter-bar button.active {
  color: #fff;
  background: #e4767f;
  border-color: #e4767f;
  font-weight: 600;
}

.filter-bar button.active::after {
  display: none;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  font-weight: bold;
  color: #4a4a4a;
  transition: color 0.3s ease;
  padding: 6px 10px;
}

.back-button:hover {
  color: #e4767f;
}

.back-arrow {
  font-size: 1.5rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .filter-pyramid {
    align-items: stretch;
  }

  .filter-bar {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .filter-bar-sub {
    padding-left: 8px;
  }
}

.masonry-grid {
  column-count: 3;
  column-gap: 1.5rem;
  padding: 30px;
}

@media (max-width: 900px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (max-width: 600px) {
  .masonry-grid {
    column-count: 1;
  }
}

.masonry-item {
  margin-bottom: 1.5rem;
  break-inside: avoid;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transform: translateZ(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.5s ease, transform 0.5s ease;
  animation: img-reveal-fallback 0.4s ease 1.8s forwards;
}

.image-wrapper img.loaded {
  opacity: 1;
  transform: scale(1);
  animation: none;
}

@keyframes img-reveal-fallback {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image-wrapper img.video-thumb {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.play-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(20, 20, 20, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.play-badge .v-icon {
  color: #fff !important;
  font-size: 34px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(20, 20, 20, 0.78) 0%, rgba(20, 20, 20, 0.45) 55%, rgba(20, 20, 20, 0.22) 100%);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.image-wrapper:hover .overlay,
.image-wrapper:focus-within .overlay {
  opacity: 1;
}

@media (hover: none) {
  .overlay {
    opacity: 1;
    background: linear-gradient(to top, rgba(20, 20, 20, 0.72) 0%, rgba(20, 20, 20, 0.28) 35%, rgba(20, 20, 20, 0) 60%);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

.lightbox {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.5);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.lightbox-content {
  max-width: 95%;
  max-height: 90%;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.25);
  will-change: transform;
  transition: transform 0.25s ease;
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox-content.is-interacting {
  transition: none;
}

.lightbox-content.is-zoomed {
  cursor: grab;
}

.lightbox-content.is-zoomed:active {
  cursor: grabbing;
}

.zoom-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
  padding: 30px;
}

.zoom-controls {
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(20, 20, 20, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  padding: 6px 12px;
  z-index: 1000;
}

.zoom-controls button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.zoom-controls button:hover,
.zoom-controls button:focus-visible {
  background: rgba(255, 255, 255, 0.18);
}

.zoom-controls .v-icon {
  color: #fff !important;
  font-size: 22px;
}

.zoom-level {
  color: #fff;
  min-width: 52px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
}

.video-frame-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.video-frame-outer {
  width: min(92vw, 1000px);
}

.video-frame {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
}

.video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.close {
  position: fixed;
  top: 20px;
  right: 30px;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.menu-button {
  display: inline-grid;
  place-items: center;
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0.25rem;
  z-index: 1001;
  transition: transform 0.2s ease;
  justify-self: end;
}

.menu-button:hover {
  transform: scale(1.03);
}

.menu-button-icon {
  font-size: 44px;
  line-height: 1;
  color: #fff !important;
}

.menu-button-img {
  width: 40px;
  height: 40px;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.35));
}

@media (max-width: 600px) {
  .portfolio-container {
    --header-height: 78px;
  }

  .top-navbar {
    padding: 0 12px;
  }

  .logo {
    max-width: 70px;
  }

  .social-buttons-header {
    gap: 0.85rem;
  }

  .social-buttons-header .v-icon {
    font-size: 24px;
  }

  .menu-button {
    min-width: 34px;
    min-height: 34px;
    justify-content: center;
  }

  .menu-button-icon {
    font-size: 36px;
  }

  .menu-button-img {
    width: 34px;
    height: 34px;
  }
}

.sidenav {
  position: fixed;
  top: var(--header-height);
  right: -280px;
  height: calc(100% - var(--header-height));
  width: 250px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  padding-top: 1.5rem;
  z-index: 1000;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
}

.sidenav.is-open {
  transform: translateX(-280px);
}

.sidenav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
}

.sidenav nav {
  flex-grow: 1;
}

.sidenav nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidenav nav li {
  margin: 1.5rem 0;
}

.sidenav nav li a {
  padding: 10px 32px 10px 10px;
  text-decoration: none;
  font-size: 1.2rem;
  color: #393939;
  display: block;
  position: relative;
  text-align: right;
  transition: all 0.3s ease;
}

.sidenav nav li a:hover,
.sidenav nav li a:focus {
  color: #e4767f;
  background: rgba(0, 0, 0, 0.05);
  padding-right: 40px;
}

.social-buttons {
  display: none;
  justify-content: center;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.social-buttons .v-icon {
  color: #393939;
  font-size: 24px;
}


.main-content-wrapper {
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  z-index: 1;
}

.main-content-wrapper.shifted {
  transform: none;
  filter: blur(2px);
}

.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.scroll-to-top .v-icon {
  font-size: 24px;
  color: #e4767f;
}

.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.fade-in-up-enter-active,
.fade-in-up-leave-active {
  transition: all 0.3s ease;
}

.fade-in-up-enter,
.fade-in-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.about-container,
.contact-container,
.manage-categories-container {
  padding: 3rem 5%;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #393939;
  margin-bottom: 2rem;
}

.about-content,
.contact-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 3rem;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
}

.about-intro-grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .about-intro-grid {
    grid-template-columns: 1fr 2fr;
    text-align: left;
  }
}

.intro-image-wrapper {
  position: relative;
  justify-self: center;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 105, 180, 0.4);
  transition: all 0.4s ease-in-out;
  cursor: pointer;
}

.intro-image-wrapper:hover {
  box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 105, 180, 0.6);
  transform: scale(1.05) rotate(2deg);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.intro-text-wrapper {
  text-align: center;
}

@media (min-width: 768px) {
  .intro-text-wrapper {
    text-align: left;
  }
}

.section-title {
  font-size: 1.8rem;
  color: #e4767f;
  font-weight: 600;
  margin-bottom: 1rem;
}

.about-section p,
.contact-intro {
  line-height: 1.7;
  font-size: 1rem;
  color: #4a4a4a;
}

.about-quote {
  margin-top: 2rem;
  font-style: italic;
  font-size: 1.2rem;
  color: #777;
  font-weight: 300;
}

.about-section.about-curiosity {
  text-align: right;
}

.cta-button {
  background-color: #e4767f;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: #df565e;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.form-group label {
  font-size: 1rem;
  color: #393939;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(221, 221, 221, 0.9);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  color: #393939;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.portfolio-section h1 {
  text-align: center;
  margin-bottom: 1.25rem;
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #393939;
}

/* === Stili per le nuove funzionalità === */
.admin-card-controls {
  margin-top: 0.5rem;
  text-align: center;
}

.remove-button {
  background-color: #e4767f;
  color: white;
  border: none;
  padding: 5px 12px;
  font-size: 0.8rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #da5863;
}

.modal-overlay {
  position: fixed;
  z-index: 1001;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fdfdfd;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #393939;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button {
  background: #ddd;
  color: #393939;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background: #ccc;
}

.cta-button:disabled {
  background-color: #f2b8bc;
  cursor: not-allowed;
}

.empty-portfolio {
  text-align: center;
  padding: 4rem 2rem;
  margin: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.empty-portfolio h2 {
  color: #393939;
  margin-bottom: 1rem;
}

.empty-portfolio p {
  color: #777;
  font-size: 1.1rem;
}

.login-hint {
  text-align: center;
  margin-top: 1rem;
  color: #777;
}

.draggable-item {
  cursor: grab;
}

.draggable-item:active {
  cursor: grabbing;
}

.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  width: 60px;
  height: 60px;
  background-color: #e4767f;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fab:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  background-color: #e659a0;
}

.fab .v-icon {
  font-size: 28px;
  color: white !important;
}

.scroll-to-top.shifted-up {
  bottom: 6.5rem;
}

.edit-about-button-container {
  text-align: right;
  margin-bottom: 1rem;
}

.edit-button {
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
  margin-left: 0.5rem;
}

.edit-button.save {
  background-color: #28a745;
}

.edit-button.cancel {
  background-color: #dc3545;
}

.edit-button:hover {
  background-color: #393939;
}

.edit-button.save:hover {
  background-color: #218838;
}

.edit-button.cancel:hover {
  background-color: #c82333;
}

.editable-field {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px dashed #ccc;
  border-radius: 8px;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  background-color: #f8f8f8;
  resize: vertical;
}

.editable-field.headline {
  font-size: 1.8rem;
  font-weight: 600;
  color: #e4767f;
  line-height: 1.2;
  margin-bottom: 1rem;
  resize: none;
}

.editable-field.editable-quote {
  font-style: italic;
  font-size: 1.2rem;
  color: #777;
  font-weight: 300;
  text-align: center;
}

.editable-field:focus {
  outline: none;
  border-color: #e4767f;
  background-color: white;
}

.edit-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.intro-image-wrapper:hover .edit-image-overlay {
  opacity: 1;
}

.category-manager {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.category-list,
.subcategory-list {
  list-style: none;
  padding: 0;
}

.category-item {
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  border: 1px solid #eee;
}

.category-item-content,
.subcategory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  color: #999;
  cursor: grab;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.subcategory-list {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
}

.subcategory-item {
  margin-left: 2rem;
  padding-left: 1rem;
  border-left: 2px solid #e5e5e5;
  gap: 0.35rem;
}

.category-name {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name span {
  font-weight: bold;
}

.subcategory-item .category-name span {
  font-weight: normal;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-item-content:hover .category-actions,
.subcategory-item:hover .category-actions {
  opacity: 1;
}

.action-btn {
  background: #ddd;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
}

.action-btn.delete {
  background: #ffe4e6;
  color: #dc3545;
}

.action-btn.save {
  background: #d4edda;
  color: #155724;
}

.action-btn.cancel {
  background: #f8d7da;
  color: #721c24;
}

.category-edit {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.category-edit input {
  flex-grow: 1;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-subcategory-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
}

.add-category-container {
  text-align: center;
  margin-top: 2rem;
}

.field-error {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

.about-inline-figure {
  margin: 0;
  text-align: center;
}

.about-inline-figure img {
  width: 100%;
  max-width: 640px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.section-images-editor {
  text-align: left;
  background: rgba(255, 255, 255, 0.55);
  border: 1px dashed #ccc;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}

.section-images-editor h3 {
  margin-bottom: 0.25rem;
  color: #393939;
}

.editor-hint {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 1rem;
}

.section-image-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
}

.section-image-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.section-image-preview {
  width: 72px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}

.alt-input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: inherit;
}

.section-image-actions {
  display: flex;
  gap: 0.5rem;
}

/* === Hero Slider === */
.hero-slider {
  position: relative;
  width: 100%;
  height: clamp(340px, 46vw, 560px);
  overflow: hidden;
  background-color: #2b2b2b;
}

.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 680px;
  padding: 0 clamp(1.5rem, 7vw, 5.5rem);
  color: #fff;
  text-align: left;
  animation: heroContentIn 0.9s ease both;
}

@keyframes heroContentIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: clamp(1.7rem, 4.2vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.6rem;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
}

.hero-subtitle {
  font-size: clamp(1.05rem, 2.2vw, 1.4rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

.hero-description {
  font-size: clamp(0.95rem, 1.7vw, 1.1rem);
  line-height: 1.5;
  margin-bottom: 1.4rem;
  max-width: 560px;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.2rem;
}

.hero-cta-button {
  display: inline-block;
  background-color: #e4767f;
  color: #fff;
  border: none;
  padding: 0.85rem 1.9rem;
  border-radius: 50px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.hero-cta-button:hover {
  background-color: #df565e;
  transform: translateY(-2px);
}

.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.hero-arrow .v-icon {
  color: #fff;
  font-size: 30px;
}

.hero-arrow:hover {
  background: rgba(0, 0, 0, 0.5);
}

.hero-arrow-left {
  left: 16px;
}

.hero-arrow-right {
  right: 16px;
}

.hero-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 10px;
}

.hero-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.hero-dot.active {
  background: #e4767f;
  border-color: #fff;
  transform: scale(1.25);
}

.hero-manage-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 50px;
  padding: 6px 14px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background-color 0.3s ease;
}

.hero-manage-btn:hover {
  background: rgba(0, 0, 0, 0.65);
}

.hero-manage-btn .v-icon {
  color: #fff;
  font-size: 16px;
}

/* Hero transitions */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.9s ease;
}

.hero-fade-enter,
.hero-fade-leave-to {
  opacity: 0;
}

.hero-slide-next-enter-active,
.hero-slide-next-leave-active,
.hero-slide-prev-enter-active,
.hero-slide-prev-leave-active {
  transition: transform 0.7s cubic-bezier(0.25, 0.8, 0.35, 1);
}

.hero-slide-next-enter {
  transform: translateX(100%);
}

.hero-slide-next-leave-to {
  transform: translateX(-100%);
}

.hero-slide-prev-enter {
  transform: translateX(-100%);
}

.hero-slide-prev-leave-to {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .hero-slider {
    height: clamp(380px, 62vw, 460px);
  }

  .hero-content {
    max-width: 100%;
    padding: 0 1.4rem;
  }

  .hero-arrow {
    width: 38px;
    height: 38px;
  }

  .hero-arrow-left {
    left: 8px;
  }

  .hero-arrow-right {
    right: 8px;
  }

  .hero-cta-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding-bottom: 3.2rem;
  }

  .hero-arrow {
    top: auto;
    bottom: 12px;
    transform: none;
    width: 34px;
    height: 34px;
  }

  .hero-arrow .v-icon {
    font-size: 24px;
  }

  .hero-arrow-left {
    left: 12px;
  }

  .hero-arrow-right {
    right: 12px;
  }

  .hero-dots {
    bottom: 22px;
  }
}

/* === Hero Slider Admin === */
.manage-slider-container {
  padding: 3rem 5%;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.manage-slider-container .editor-hint {
  color: #6b6b6b;
  margin-bottom: 1.5rem;
}

.slider-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.slide-admin-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.slide-admin-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 14px;
  padding: 0.8rem 1rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
  text-align: left;
  flex-wrap: wrap;
}

.slide-admin-item.inactive {
  opacity: 0.55;
}

.slide-admin-item .drag-handle {
  cursor: grab;
}

.slide-admin-thumb {
  width: 96px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.slide-admin-info {
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slide-admin-meta {
  font-size: 0.8rem;
  color: #777;
}

.slide-active-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.slide-active-toggle input {
  accent-color: #e4767f;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Slide modal */
.slide-modal {
  max-height: 90vh;
  overflow-y: auto;
}

.slide-image-preview {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.6rem;
}

.cta-editor-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.6rem;
}

.cta-editor-row input,
.cta-editor-row select {
  padding: 0.55rem 0.7rem;
  font-size: 0.9rem;
}

.cta-remove-btn {
  background: #f1f1f1;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.cta-remove-btn:hover {
  background: #e4767f;
}

.cta-remove-btn:hover .v-icon {
  color: #fff;
}

.slide-config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem 1rem;
  margin-top: 0.5rem;
}

@media (max-width: 560px) {
  .cta-editor-row {
    grid-template-columns: 1fr auto;
  }

  .slide-config-grid {
    grid-template-columns: 1fr;
  }
}
</style>
