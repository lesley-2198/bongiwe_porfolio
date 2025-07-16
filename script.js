function scrollCarousel(direction) {
    const carousel = document.getElementById('research-carousel');
    const scrollAmount = 300;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.navigation').classList.remove('active');
    });
  });

  function updateCarouselButtons() {
  const carousel = document.getElementById('research-carousel');
  const leftBtn = document.querySelector('.carousel-btn.left');
  const rightBtn = document.querySelector('.carousel-btn.right');

  leftBtn.style.display = carousel.scrollLeft > 0 ? 'block' : 'none';

  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
  rightBtn.style.display = carousel.scrollLeft < maxScrollLeft ? 'block' : 'none';
}

document.getElementById('research-carousel').addEventListener('scroll', updateCarouselButtons);
window.addEventListener('load', updateCarouselButtons);

document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = this;
  const button = document.getElementById("submit-button");
  const spinner = document.getElementById("spinner");
  const btnText = button.querySelector(".btn-text");
  const status = document.getElementById("form-status");

  // Show loading
  spinner.style.display = "inline-block";
  btnText.textContent = "Sending...";
  button.disabled = true;

  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.textContent = "Message sent successfully!";
      status.style.color = "green";
      form.reset();
    } else {
      status.textContent = "⚠ Failed to send. Please try again.";
      status.style.color = "red";
    }
  }).catch(error => {
    status.textContent = "Error. Try again later.";
    status.style.color = "red";
  }).finally(() => {
    spinner.style.display = "none";
    btnText.textContent = "Send";
    button.disabled = false;

    setTimeout(() => {
      status.textContent = "";
    }, 4000);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.landing-content')?.classList.add('animated');
  document.querySelectorAll('section h2').forEach(el => {
    el.classList.add('animated');
  });
});

  AOS.init({
    duration: 1000,     // animation duration (ms)
    once: true,         // whether animation should happen only once
    easing: 'ease-out'  // easing option
  });
