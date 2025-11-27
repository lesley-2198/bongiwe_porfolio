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

// ---------- Load Research Cards ----------
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('research-container');
  
  if (!container) {
    console.error('Research container not found');
    return;
  }

  function createResearchCard(research) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const pdfLink = research.file ? `<a href="/${research.file}" target="_blank" class="read-more-btn">View PDF</a>` : '';
    
    card.innerHTML = `
      <img src="/${research.image}" alt="${research.title}" onerror="this.src='/images/placeholder.png'">
      <h3>${research.title}</h3>
      <p>${research.description}</p>
      ${pdfLink}
    `;
    return card;
  }

  const researchFiles = [
    'relationship-stress.md',
    'post-pandemic-coping.md', 
    'early-childhood-resilience.md'
  ];

  if (typeof matter !== 'undefined') {
    researchFiles.forEach(filename => {
      fetch(`/content/research/${filename}`)  // Changed path
        .then(response => response.text())
        .then(fileContent => {
          const parsed = matter(fileContent);
          const data = parsed.data;
          
          container.appendChild(createResearchCard({
            title: data.title,
            description: data.description,
            image: data.image,
            file: data.file
          }));
        })
        .catch(err => console.error(`Error loading ${filename}:`, err));
    });
  }
});