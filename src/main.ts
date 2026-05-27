import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// 1. Lenis Smooth Scroll Setup
const lenis = new Lenis({
  duration: 1.5,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// 2. Custom Magnetic Cursor
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot') as HTMLElement
  const cursorRing = document.querySelector('.cursor-ring') as HTMLElement
  const cursorText = document.querySelector('.cursor-text') as HTMLElement
  const cursorSvg = document.querySelector('.cursor-svg') as HTMLElement

  if (!cursorDot || !cursorRing) return;

  const xToDot = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3" })
  const yToDot = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3" })
  const xToRing = gsap.quickTo(cursorRing, "x", { duration: 0.4, ease: "power3" })
  const yToRing = gsap.quickTo(cursorRing, "y", { duration: 0.4, ease: "power3" })

  window.addEventListener('mousemove', (e) => {
    xToDot(e.clientX)
    yToDot(e.clientY)
    xToRing(e.clientX)
    yToRing(e.clientY)
  })

  // Magnetic Buttons
  const magnets = document.querySelectorAll('.magnetic-wrap')
  magnets.forEach((wrap) => {
    const target = wrap.querySelector('.magnetic-target') as HTMLElement
    if(!target) return
    wrap.addEventListener('mousemove', (e: any) => {
      const rect = wrap.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(target, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: "power3.out" })
    })
    wrap.addEventListener('mouseleave', () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" })
    })
  })

  // Hover Cursor States
  const navHovers = document.querySelectorAll('.nav-hover')
  navHovers.forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(cursorRing, { scale: 1.2, borderColor: 'var(--color-accent)' }))
    el.addEventListener('mouseleave', () => gsap.to(cursorRing, { scale: 1, borderColor: 'rgba(255,255,255,0.4)' }))
  })

  // Gallery / Image Hovers (Show "VIEW" or "DRAG")
  const imgHovers = document.querySelectorAll('.img-hover-trigger')
  imgHovers.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorRing, { scale: 1.5, backgroundColor: 'rgba(255,255,255,1)', borderColor: 'transparent', mixBlendMode: 'normal' })
      gsap.to(cursorSvg, { opacity: 0, duration: 0.2 })
      gsap.to(cursorText, { opacity: 1, duration: 0.2 })
      cursorDot.style.opacity = '0'
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(cursorRing, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.4)', mixBlendMode: 'difference' })
      gsap.to(cursorSvg, { opacity: 1, duration: 0.2 })
      gsap.to(cursorText, { opacity: 0, duration: 0.2 })
      cursorDot.style.opacity = '1'
    })
  })
}

// --- Helper: Text Splitter ---
function splitTextIntoWords(selector: string) {
  const elements = document.querySelectorAll(selector)
  elements.forEach((el: any) => {
    // Evitamos romper texto con HTML interno o que ya esté partido
    if(el.children.length > 0 && !el.querySelector('.brutal-word')) return
    const text = el.textContent || ''
    const words = text.trim().split(/\s+/)
    el.innerHTML = ''
    words.forEach((word: string, i: number) => {
      const span = document.createElement('span')
      span.className = 'brutal-word'
      // Conservar el espacio después de cada palabra excepto la última
      span.textContent = word + (i < words.length - 1 ? ' ' : '')
      el.appendChild(span)
    })
  })
}

// 3. Kinetic Preloader & Hero
function initHeroAnimations() {
  const tl = gsap.timeline()
  
  // Brutal Smash Split
  splitTextIntoWords('.hero-title.brutal-smash')
  splitTextIntoWords('.hero-desc.brutal-smash')
  
  const words = gsap.utils.toArray('.loader-word')
  words.forEach((word: any, i) => {
    if (i === words.length - 1) {
      tl.to(word, { opacity: 1, duration: 0.1 })
        .to({}, { duration: 0.5 }) 
        .to(word, { opacity: 0, duration: 0.1 })
    } else {
      tl.to(word, { opacity: 1, duration: 0.1 })
        .to(word, { opacity: 0, duration: 0.1 }, "+=0.2")
    }
  })
  
  tl.to('.loader', { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
  
  // Reveal the video and description
  .fromTo('.hero-bg-scale', { scale: 1.5 }, { scale: 1, duration: 2, ease: "power4.out" }, "-=1")
  
  // Brutal Hero Smash
  const heroTitleWords = gsap.utils.toArray('.hero-title.brutal-smash .brutal-word')
  tl.fromTo(heroTitleWords, 
    { scale: 3, opacity: 0, filter: "blur(20px)", rotationX: 45, y: 100 }, 
    { scale: 1, opacity: 1, filter: "blur(0px)", rotationX: 0, y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, "-=1.5"
  )

  // Header Nav Drop Down (Brutal Slice)
  tl.fromTo('.gsap-fade-down', 
    { y: -100, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" }, 
    "-=1.2"
  )

  // Brutal Subtitles Smash
  const heroDescWords = gsap.utils.toArray('.hero-desc.brutal-smash .brutal-word')
  tl.fromTo(heroDescWords, 
    { scale: 2, opacity: 0, filter: "blur(10px)", y: 50 }, 
    { scale: 1, opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.05, ease: "power4.out" }, "-=1"
  )

  // Hero Button Elastic Pop
  tl.fromTo('.gsap-fade-up', 
    { opacity: 0, scale: 0, y: 50 }, 
    { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "elastic.out(1, 0.4)" }, 
    "-=0.8"
  )
}

// 4. Extreme Scroll Animations
function initScrollAnimations() {
  
  // Horizontal Scroll (Members) - MUST BE FIRST FOR CORRECT PIN SPACING
  const scrollSection = document.querySelector('.horizontal-scroll-section')
  const scrollContainer = document.querySelector('.horizontal-scroll-container')
  
  if (scrollSection && scrollContainer) {
    function getScrollAmount() {
      const containerWidth = scrollContainer.scrollWidth
      return -(containerWidth - window.innerWidth)
    }

    const tween = gsap.to(scrollContainer, {
      x: getScrollAmount,
      ease: "none"
    })

    ScrollTrigger.create({
      trigger: scrollSection,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true
    })
    
    // Inner Image Parallax in Horizontal Scroll
    gsap.utils.toArray('.h-img').forEach((img: any) => {
      gsap.to(img, {
        xPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: scrollSection,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`,
          scrub: 1,
        }
      })
    })
  }

  // Brutal Smash Scroll Sections
  splitTextIntoWords('.brutal-smash-scroll')
  const smashSections = document.querySelectorAll('.section-header, .festivals-left, .footer-cta, .title-item')
  smashSections.forEach(section => {
    const sectionWords = section.querySelectorAll('.brutal-smash-scroll .brutal-word')
    if(sectionWords.length > 0) {
      gsap.fromTo(sectionWords, {
        scale: 3, opacity: 0, filter: "blur(20px)", rotationX: 45, y: 100
      }, {
        scale: 1, opacity: 1, filter: "blur(0px)", rotationX: 0, y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { 
          trigger: section, 
          start: "top 80%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse"
        }
      })
    }
  })

  // Brutal Impact Texts
  gsap.utils.toArray('.scroll-fade-up').forEach((elem: any) => {
    gsap.fromTo(elem, { 
      opacity: 0, y: 100, scale: 1.2, filter: "blur(10px)" 
    }, {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out",
      scrollTrigger: { 
        trigger: elem, 
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      }
    })
  })

  // Extreme Gallery Explosion
  gsap.utils.toArray('.clip-reveal-container').forEach((container: any) => {
    const img = container.querySelector('.clip-img')
    
    // Violent Reveal
    gsap.fromTo(container, {
      clipPath: "inset(50% 50% 50% 50%)", borderRadius: "100px"
    }, {
      clipPath: "inset(0% 0% 0% 0%)", borderRadius: "0px",
      duration: 1.5, ease: "expo.out",
      scrollTrigger: { 
        trigger: container, 
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      }
    })
    
    // Zoom out with color splash
    gsap.fromTo(img, {
      scale: 2, filter: "grayscale(100%) blur(15px)"
    }, {
      scale: 1, filter: "grayscale(0%) blur(0px)",
      duration: 2, ease: "expo.out",
      scrollTrigger: { 
        trigger: container, 
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      }
    })
    
    // Parallax on scroll
    gsap.to(img, {
      yPercent: 15, ease: "none",
      scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: true }
    })
  })

  // --- AUDIO PLAYER LOGIC ---
  const audio = document.getElementById('audioPlayer') as HTMLAudioElement;
  const btnPlayPause = document.getElementById('btnPlayPause');
  const playIcon = document.getElementById('playIcon');
  const btnNext = document.getElementById('btnNext');
  const btnPrev = document.getElementById('btnPrev');
  const trackItems = document.querySelectorAll('.track-item');
  const currentTitle = document.getElementById('currentTitle');
  const currentGenre = document.getElementById('currentGenre');
  const vinylRecord = document.querySelector('.vinyl-record');
  const progressBar = document.getElementById('progressBar');
  const progressWrapper = document.getElementById('progressWrapper');
  const timeCurrent = document.getElementById('timeCurrent');
  const timeTotal = document.getElementById('timeTotal');

  let currentTrackIndex = 0;
  let isPlaying = false;

  // Track Rotation Animation (GSAP)
  const vinylSpin = gsap.to(vinylRecord, {
    rotation: 360,
    duration: 4,
    repeat: -1,
    ease: "none",
    paused: true
  });

  const loadTrack = (index: number) => {
    trackItems.forEach(t => t.classList.remove('active'));
    const item = trackItems[index];
    item.classList.add('active');
    
    // Fix case-sensitive path (/audio/ -> /Audio/)
    const rawSrc = item.getAttribute('data-src') || '';
    audio.src = rawSrc.replace('/audio/', '/Audio/');
    
    if(currentTitle) currentTitle.textContent = item.getAttribute('data-title');
    if(currentGenre) currentGenre.textContent = item.getAttribute('data-genre');
  };

  const playMusic = () => {
    isPlaying = true;
    audio.play();
    if(playIcon) playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`; // Pause icon
    vinylSpin.play();
  };

  const pauseMusic = () => {
    isPlaying = false;
    audio.pause();
    if(playIcon) playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`; // Play icon
    vinylSpin.pause();
  };

  if(btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      if(isPlaying) pauseMusic();
      else playMusic();
    });
  }

  if(btnNext) {
    btnNext.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex + 1) % trackItems.length;
      loadTrack(currentTrackIndex);
      if(isPlaying) playMusic();
    });
  }

  if(btnPrev) {
    btnPrev.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + trackItems.length) % trackItems.length;
      loadTrack(currentTrackIndex);
      if(isPlaying) playMusic();
    });
  }

  trackItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      playMusic();
    });
  });

  if(audio) {
    audio.addEventListener('timeupdate', () => {
      if(progressBar) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
      }
      
      if(timeCurrent) {
        const currentMins = Math.floor(audio.currentTime / 60);
        const currentSecs = Math.floor(audio.currentTime % 60);
        timeCurrent.textContent = `${currentMins}:${currentSecs < 10 ? '0' : ''}${currentSecs}`;
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if(timeTotal && !isNaN(audio.duration)) {
        const totalMins = Math.floor(audio.duration / 60);
        const totalSecs = Math.floor(audio.duration % 60);
        timeTotal.textContent = `${totalMins}:${totalSecs < 10 ? '0' : ''}${totalSecs}`;
      }
    });

    audio.addEventListener('ended', () => {
      if(btnNext) btnNext.click();
    });
  }
  
  if(progressWrapper && audio) {
    progressWrapper.addEventListener('click', (e: MouseEvent) => {
      const width = progressWrapper.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      audio.currentTime = (clickX / width) * duration;
    });
  }

  if(trackItems.length > 0) loadTrack(0);

  // Odyssee SVG Line Draw
  gsap.to('.odyssee-line-draw', {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: '.odyssee-timeline',
      start: "top 50%",
      end: "bottom 80%",
      scrub: true
    }
  })

  // Odyssee Lateral Smash
  gsap.utils.toArray('.odyssee-item').forEach((item: any) => {
    const isLeft = item.classList.contains('left')
    const xOffset = isLeft ? -200 : 200
    gsap.fromTo(item.querySelector('.odyssee-content'), 
      { opacity: 0, x: xOffset, rotationY: isLeft ? -45 : 45, filter: "blur(20px)" },
      { 
        opacity: 1, x: 0, rotationY: 0, filter: "blur(0px)",
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play reverse play reverse"
        }
      }
    )
  })

  // Fest items individual trigger (Explosive Brutal Smash)
  gsap.utils.toArray('.fest-item').forEach((item: any) => {
    gsap.fromTo(item, 
      { opacity: 0, scale: 1.8, y: 100, filter: "blur(20px)", rotationX: 45 }, 
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        filter: "blur(0px)", 
        rotationX: 0,
        duration: 1.5, 
        ease: "elastic.out(1, 0.4)",
        scrollTrigger: { 
          trigger: item, 
          start: "top 85%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse"
        }
      }
    )
  })

  // Epic Footer Finale (Expanding Mask)
  const epicFooter = document.querySelector('.epic-footer-section')
  if(epicFooter) {
    const tlFooter = gsap.timeline({
      scrollTrigger: {
        trigger: epicFooter,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    })

    // Expand mask to full screen
    tlFooter.to('.epic-mask-container', {
      clipPath: "inset(0vh 0vw round 0px)",
      ease: "power2.inOut"
    }, 0)

    // Zoom out the background image slightly
    tlFooter.to('.epic-bg-img', {
      scale: 1,
      ease: "power2.inOut"
    }, 0)

    // Fade out and push up the massive title
    tlFooter.to('.epic-sticky .footer-cta', {
      y: -100,
      opacity: 0,
      ease: "power2.inOut"
    }, 0)

    // Scale up the text moderately (instead of 3x)
    tlFooter.to('.epic-btn-text', {
      scale: 1.5,
      ease: "power2.inOut"
    }, 0)

    // Fade in the footer legal text at the very end
    tlFooter.to('.epic-footer-bottom', {
      opacity: 1,
      pointerEvents: "auto",
      ease: "power1.in"
    }, 0.5)
  }

  // Background Parallax Effect
  gsap.utils.toArray('.section-bg-parallax').forEach((bg: any) => {
    gsap.to(bg, {
      yPercent: 20, ease: "none",
      scrollTrigger: { trigger: bg.parentElement.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor()
  initHeroAnimations()
  initScrollAnimations()
  initSoundToggle()
  initMusicPlayer()
})

// 5. Sound Toggle Logic
function initSoundToggle() {
  const btn = document.getElementById('soundToggle')
  const video = document.getElementById('heroVideo') as HTMLVideoElement
  const text = btn?.querySelector('.sound-text')
  
  if (btn && video && text) {
    btn.addEventListener('click', () => {
      video.muted = !video.muted
      if (!video.muted) {
        btn.classList.add('is-playing')
        text.textContent = 'SOUND ON'
      } else {
        btn.classList.remove('is-playing')
        text.textContent = 'SOUND OFF'
      }
    })
  }
}

// 6. Extreme Music Player
function initMusicPlayer() {
  const layout = document.querySelector('.music-player-layout')
  if(!layout) return

  const playerCard = document.getElementById('playerCard') as HTMLElement
  const tracklistCard = document.getElementById('tracklistCard') as HTMLElement
  const vinylRecord = document.getElementById('vinylRecord') as HTMLElement
  const audio = document.getElementById('audioPlayer') as HTMLAudioElement
  const btnPlayPause = document.getElementById('btnPlayPause') as HTMLElement
  const btnPrev = document.getElementById('btnPrev') as HTMLElement
  const btnNext = document.getElementById('btnNext') as HTMLElement
  const progressBar = document.getElementById('progressBar') as HTMLElement
  const progressWrapper = document.getElementById('progressWrapper') as HTMLElement
  const timeCurrent = document.getElementById('timeCurrent') as HTMLElement
  const timeTotal = document.getElementById('timeTotal') as HTMLElement
  const currentTitle = document.getElementById('currentTitle') as HTMLElement
  const currentGenre = document.getElementById('currentGenre') as HTMLElement
  const trackItems = document.querySelectorAll('.track-item')
  const playIconPath = document.querySelector('#playIcon path') as HTMLElement
  
  // Epic Entrance
  gsap.fromTo([playerCard, tracklistCard], 
    { scale: 0.5, rotationY: 45, rotationX: 20, opacity: 0 },
    { scale: 1, rotationY: 0, rotationX: 0, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.3)", stagger: 0.2, scrollTrigger: { trigger: layout, start: "top 80%" } }
  )

  // Tracklist Stagger
  gsap.fromTo(trackItems,
    { x: 100, opacity: 0, filter: "blur(10px)" },
    { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: tracklistCard, start: "top 80%" } }
  )

  // Holographic Tilt
  playerCard.addEventListener('mousemove', (e) => {
    const rect = playerCard.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(playerCard, { rotationY: x * 0.05, rotationX: -y * 0.05, duration: 0.5, ease: "power2.out", transformPerspective: 1000 })
  })
  playerCard.addEventListener('mouseleave', () => {
    gsap.to(playerCard, { rotationY: 0, rotationX: 0, duration: 0.5, ease: "power2.out" })
  })

  // Vinyl Spin Animation
  const vinylSpin = gsap.to(vinylRecord, { rotation: 360, repeat: -1, duration: 4, ease: "none", paused: true })

  // Button Glow yoyo
  btnPlayPause.addEventListener('mouseenter', () => gsap.to(btnPlayPause, { boxShadow: "0 0 40px var(--color-accent)", repeat: -1, yoyo: true, duration: 0.5 }))
  btnPlayPause.addEventListener('mouseleave', () => { gsap.killTweensOf(btnPlayPause); gsap.to(btnPlayPause, { boxShadow: "0 0 20px rgba(217, 70, 239, 0.4)" }) })

  // Audio Logic
  let currentTrackIndex = 0

  function loadTrack(index: number) {
    trackItems.forEach(i => i.classList.remove('active'))
    const item = trackItems[index] as HTMLElement
    item.classList.add('active')
    
    currentTitle.textContent = item.dataset.title || ''
    currentGenre.textContent = item.dataset.genre || ''
    audio.src = item.dataset.src || ''
  }

  audio.addEventListener('play', () => {
    vinylSpin.play()
    playIconPath.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z')
  })
  
  audio.addEventListener('pause', () => {
    vinylSpin.pause()
    playIconPath.setAttribute('d', 'M8 5v14l11-7z')
  })

  btnPlayPause.addEventListener('click', () => {
    if(audio.paused) audio.play()
    else audio.pause()
  })

  btnPrev.addEventListener('click', () => { 
    currentTrackIndex = (currentTrackIndex - 1 + trackItems.length) % trackItems.length
    loadTrack(currentTrackIndex)
    audio.play()
  })
  
  btnNext.addEventListener('click', () => { 
    currentTrackIndex = (currentTrackIndex + 1) % trackItems.length
    loadTrack(currentTrackIndex)
    audio.play()
  })

  trackItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentTrackIndex = idx
      loadTrack(idx)
      audio.play()
    })
  })

  audio.addEventListener('timeupdate', () => {
    const p = (audio.currentTime / audio.duration) * 100
    progressBar.style.width = `${p}%`
    timeCurrent.textContent = formatTime(audio.currentTime)
  })

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration)
  })
  
  audio.addEventListener('ended', () => {
    btnNext.click()
  })

  progressWrapper.addEventListener('click', (e) => {
    const rect = progressWrapper.getBoundingClientRect()
    const x = e.clientX - rect.left
    audio.currentTime = (x / rect.width) * audio.duration
  })

  function formatTime(secs: number) {
    if(isNaN(secs)) return "0:00"
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }
}
