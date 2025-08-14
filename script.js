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
      title: "Crime & Society",
      description: "Oversaw a collaborative project by guiding individual contributions and synthesizing them into a cohesive final product. Took the lead in designing and organizing presentation slides to ensure clarity and impact. Engaged confidently with questions from peers and lecturers, enhancing the overall delivery. This experience strengthened a wide range of skills including leadership, problem solving, analytical thinking, teamwork, and effective communication—while also reinforcing a strong work ethic, attention to detail, and a mindset of continuous learning.",
      image: "images/project1.png",
    },
  ];

  // Function to create research cards
  function createResearchCard(research) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${research.image}" alt="${research.title}" onerror="this.src='images/placeholder.png'">
      <h3>${research.title}</h3>
      <p>${research.description}</p>
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