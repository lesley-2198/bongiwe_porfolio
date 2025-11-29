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
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('research-container');
  
  if (!container) {
    console.error('Research container not found');
    return;
  }

  function createResearchCard(research) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const pdfLink = research.file ? 
      `<div class="read-more-container"><a href="/${research.file}" target="_blank" class="read-more-btn">View PDF</a></div>` : '';
    
    card.innerHTML = `
      <img src="/${research.image || 'images/placeholder.png'}" alt="${research.title}" onerror="this.src='/images/placeholder.png'">
      <h3>${research.title}</h3>
      <p>${research.description}</p>
      ${pdfLink}
    `;
    return card;
  }

  // Parse YAML frontmatter properly
  function parseFrontmatter(content) {
    const match = content.match(/---\n([\s\S]*?)\n---/);
    if (!match) return null;
    
    const frontmatter = match[1];
    const data = {};
    let currentKey = null;
    let currentValue = '';
    let inMultiLine = false;
    
    const lines = frontmatter.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this is a new key-value pair
      const keyMatch = line.match(/^(\w+):\s*(.*)$/);
      
      if (keyMatch && !inMultiLine) {
        // Save previous key-value if exists
        if (currentKey) {
          data[currentKey] = currentValue.trim().replace(/^["']|["']$/g, '');
        }
        
        currentKey = keyMatch[1];
        currentValue = keyMatch[2];
        
        // Check if value starts with a quote (multi-line string)
        if (currentValue.startsWith('"') && !currentValue.endsWith('"')) {
          inMultiLine = true;
          currentValue = currentValue.substring(1); // Remove opening quote
        } else if (currentValue.startsWith('"') && currentValue.endsWith('"')) {
          // Single line quoted string
          currentValue = currentValue.slice(1, -1);
        }
      } else if (inMultiLine) {
        // Continue building multi-line value
        if (line.trim().endsWith('"')) {
          // End of multi-line string
          currentValue += ' ' + line.trim().slice(0, -1);
          inMultiLine = false;
        } else {
          currentValue += ' ' + line.trim();
        }
      }
    }
    
    // Save the last key-value pair
    if (currentKey) {
      data[currentKey] = currentValue.trim().replace(/^["']|["']$/g, '');
    }
    
    return data;
  }

  // List of all research files
  const researchFiles = [
    'relationship-stress.md',
    'post-pandemic-coping.md', 
    'early-childhood-resilience.md',
    'early-childhood-development.md'
  ];

  // Load each file
  for (const filename of researchFiles) {
    try {
      const response = await fetch(`/content/research/${filename}`);
      
      if (!response.ok) {
        console.warn(`Could not load ${filename}: ${response.status}`);
        continue;
      }
      
      const fileContent = await response.text();
      const data = parseFrontmatter(fileContent);
      
      if (data && data.title) {
        container.appendChild(createResearchCard(data));
      }
    } catch (err) {
      console.error(`Error loading ${filename}:`, err);
    }
  }
  
  // If no cards loaded, show a message
  if (container.children.length === 0) {
    container.innerHTML = '<p>No research papers found. Please check the console for errors.</p>';
  }
});