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

// ---------- Load Research Cards Dynamically ----------
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('research-container');
  
  if (!container) {
    console.error('Research container not found');
    return;
  }

  function createResearchCard(research) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const pdfLink = research.file ? `<div class="read-more-container"><a href="/${research.file}" target="_blank" class="read-more-btn">View PDF</a></div>` : '';
    
    card.innerHTML = `
      <img src="/${research.image}" alt="${research.title}" onerror="this.src='/images/placeholder.png'">
      <h3>${research.title}</h3>
      <p>${research.description}</p>
      ${pdfLink}
    `;
    return card;
  }

  // Fetch all markdown files from the research folder
  try {
    // Try to load from Netlify CMS first (this will work after publishing)
    const response = await fetch('https://api.github.com/repos/lesley-2198/bongiwe_porfolio/contents/content/research');
    const files = await response.json();
    
    if (Array.isArray(files)) {
      // Filter only .md files
      const mdFiles = files.filter(file => file.name.endsWith('.md'));
      
      // Load each markdown file
      for (const file of mdFiles) {
        try {
          const fileResponse = await fetch(file.download_url);
          const fileContent = await fileResponse.text();
          
          if (typeof matter !== 'undefined') {
            const parsed = matter(fileContent);
            const data = parsed.data;
            
            container.appendChild(createResearchCard({
              title: data.title,
              description: data.description,
              image: data.image,
              file: data.file
            }));
          }
        } catch (err) {
          console.error(`Error loading ${file.name}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching research files:', err);
    
    // Fallback: Load hardcoded files
    const fallbackFiles = [
      'relationship-stress.md',
      'post-pandemic-coping.md', 
      'early-childhood-resilience.md'
    ];
    
    for (const filename of fallbackFiles) {
      try {
        const response = await fetch(`/content/research/${filename}`);
        const fileContent = await response.text();
        
        if (typeof matter !== 'undefined') {
          const parsed = matter(fileContent);
          const data = parsed.data;
          
          container.appendChild(createResearchCard({
            title: data.title,
            description: data.description,
            image: data.image,
            file: data.file
          }));
        }
      } catch (err) {
        console.error(`Error loading ${filename}:`, err);
      }
    }
  }
});