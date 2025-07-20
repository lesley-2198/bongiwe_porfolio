// ---------- Carousel Scroll ----------
function scrollCarousel(direction) {
  const carousel = document.getElementById('research-carousel');
  const scrollAmount = 300;
  carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// ---------- Navigation Link Close ----------
document.querySelectorAll('.navigation a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.navigation').classList.remove('active');
  });
});

// ---------- Carousel Button Visibility ----------
document.addEventListener('DOMContentLoaded', () => {
  function updateCarouselButtons() {
    const carousel = document.getElementById('research-carousel');
    const leftBtn = document.querySelector('.carousel-btn.left');
    const rightBtn = document.querySelector('.carousel-btn.right');

    if (!carousel || !leftBtn || !rightBtn) return;

    leftBtn.style.display = carousel.scrollLeft > 0 ? 'block' : 'none';
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    rightBtn.style.display = carousel.scrollLeft < maxScrollLeft ? 'block' : 'none';
  }

  const carousel = document.getElementById('research-carousel');
  if (carousel) {
    carousel.addEventListener('scroll', updateCarouselButtons);
    updateCarouselButtons();
    window.addEventListener('resize', updateCarouselButtons);
  }
});

// ---------- Contact Form Submission ----------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const button = document.getElementById("submit-button");
    const spinner = document.getElementById("spinner");
    const btnText = button.querySelector(".btn-text");
    const status = document.getElementById("form-status");

    spinner.style.display = "inline-block";
    btnText.textContent = "Sending...";
    button.disabled = true;

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        status.textContent = "Message sent successfully!";
        status.style.color = "green";
        form.reset();
      } else {
        status.textContent = "⚠ Failed to send. Please try again.";
        status.style.color = "red";
      }
    }).catch(() => {
      status.textContent = "Error. Try again later.";
      status.style.color = "red";
    }).finally(() => {
      spinner.style.display = "none";
      btnText.textContent = "Send";
      button.disabled = false;
      setTimeout(() => { status.textContent = ""; }, 4000);
    });
  });
});

// ---------- Landing Page Animation ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.landing-content')?.classList.add('animated');
  document.querySelectorAll('section h2').forEach(el => {
    el.classList.add('animated');
  });
});

// ---------- AOS Init ----------
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });
  } else {
    console.error('AOS is not defined. Make sure the script is loaded BEFORE this file.');
  }
});

// ---------- Load Research Cards with Fallback Data ----------
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('research-container');
  
  if (!container) {
    console.error('Research container not found');
    return;
  }

  // Fallback data in case markdown files can't be loaded
  const fallbackResearch = [
    {
      title: "Relationship Stress vs Academic Performance",
      description: "This study investigates the correlation between stress levels and academic performance among undergraduate students. It explores how chronic stress, time pressure, and emotional fatigue impact cognitive functioning and exam outcomes...",
      image: "images/research1.png",
      pdf: "data/research_pdf/relationship-stress.pdf"
    },
    {
      title: "Post-Pandemic Coping Mechanisms for the Youth",
      description: "This research explores the coping strategies adopted by youth in the aftermath of the COVID-19 pandemic. It examines how young people navigate emotional distress, social isolation, and academic disruptions through mechanisms such as mindfulness, peer support, digital communities, and creative expression.",
      image: "images/research3.png",
      pdf: "data/research_pdf/post-pandemic-coping.pdf"
    },
    {
      title: "Early Childhood Intervention & Psychological Resilience",
      description: "This study examines how early childhood interventions contribute to the development of psychological resilience later in life. It focuses on programs that support emotional regulation, secure attachment, and cognitive stimulation during formative years.",
      image: "images/research2.png",
      pdf: "data/research_pdf/early-childhood-resilience.pdf"
    }
  ];

  // Function to create research cards
  function createResearchCard(research) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${research.image}" alt="${research.title}" onerror="this.src='images/placeholder.png'">
      <h3>${research.title}</h3>
      <p>${research.description}</p>
      <div class="read-more-container">
        <a href="${research.pdf}" class="read-more-btn" target="_blank">Read More →</a>
      </div>
    `;
    return card;
  }

  // Try to load from markdown files first, fallback to hardcoded data
  if (typeof matter !== 'undefined') {
    const researchFolder = 'data/research/';
    const files = [
      'relationship-stress.md',
      'post-pandemic-coping.md', 
      'early-childhood-resilience.md'
    ];

    let loadedCount = 0;
    let hasError = false;

    files.forEach((filename, index) => {
      fetch(`${researchFolder}${filename}`)
        .then(response => {
          if (!response.ok) throw new Error('File not found');
          return response.text();
        })
        .then(fileContent => {
          const parsed = matter(fileContent);
          const data = parsed.data;

          const research = {
            title: data.title || fallbackResearch[index].title,
            description: data.description || data.summary || fallbackResearch[index].description,
            image: data.image ? `images/${data.image}` : fallbackResearch[index].image,
            pdf: data.file ? `data/research_pdf/${data.file}` : fallbackResearch[index].pdf
          };

          container.appendChild(createResearchCard(research));
          loadedCount++;
        })
        .catch(err => {
          console.warn(`Error loading ${filename}:`, err);
          if (!hasError) {
            hasError = true;
            // If markdown loading fails, use fallback data
            setTimeout(() => {
              if (container.children.length === 0) {
                console.log('Using fallback research data');
                fallbackResearch.forEach(research => {
                  container.appendChild(createResearchCard(research));
                });
              }
            }, 1000);
          }
        });
    });
  } else {
    // If matter.js is not available, use fallback data
    console.log('Gray-matter not available, using fallback data');
    fallbackResearch.forEach(research => {
      container.appendChild(createResearchCard(research));
    });
  }
});