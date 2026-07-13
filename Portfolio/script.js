// Grab every link that should switch pages (nav links + the
// "Contact Me" button, since it also has the .nav-link class)
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const sectionNav = document.getElementById('sectionNav');

navLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('data-page');

    // 1. Hide every page, then show only the target one
    pages.forEach(function (page) {
      page.classList.remove('active');
    });
    document.getElementById(targetId).classList.add('active');

    // 2. Update which nav link looks "active"
    document.querySelectorAll('.navbar .nav-link').forEach(function (navLink) {
      navLink.classList.remove('active');
    });
    document.querySelectorAll('.navbar .nav-link[data-page="' + targetId + '"]')
      .forEach(function (navLink) {
        navLink.classList.add('active');
      });

    // 3. Show the top section links only once we've left Home.
    // Going back to Home hides them again.
    if (targetId === 'home') {
      sectionNav.classList.remove('nav-visible');
    } else {
      sectionNav.classList.add('nav-visible');
    }

    // 4. Jump straight to the top, like a fresh page load
    window.scrollTo(0, 0);
  });
});

// ===== SHUFFLING SKILL WORDS (per row) =====
// Skills are now grouped into 3 rows: Languages & Databases, Frameworks,
// and Tools. Every few seconds, each row fades out, its own words get
// reshuffled among themselves (never mixing with another row), and it
// fades back in. A row with only one skill is simply skipped since
// there's nothing to swap it with.
const skillRows = document.querySelectorAll('.skills-row');

// Shuffle an array into an order where every item moves to a new spot
// (a "derangement"), so the swap is always visible. Falls back to a
// plain shuffle if a derangement isn't possible (e.g. duplicate values).
function derangement(arr) {
  if (arr.length < 2) return arr.slice();

  let shuffled;
  let attempts = 0;
  do {
    shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    attempts++;
  } while (shuffled.some(function (val, i) { return val === arr[i]; }) && attempts < 20);

  return shuffled;
}

function shuffleRow(row) {
  const textEls = row.querySelectorAll('.skill-text');
  if (textEls.length < 2) return; // nothing to swap in a single-item row

  const currentTexts = Array.from(textEls).map(function (el) { return el.textContent; });
  const newTexts = derangement(currentTexts);

  textEls.forEach(function (el) { el.classList.add('fade-out'); });

  setTimeout(function () {
    textEls.forEach(function (el, i) { el.textContent = newTexts[i]; });
    textEls.forEach(function (el) { el.classList.remove('fade-out'); });
  }, 300); // matches the 0.3s CSS transition
}

function shuffleAllRows() {
  skillRows.forEach(shuffleRow);
}

// Shuffle every row every 2.5 seconds
setInterval(shuffleAllRows, 2500);
