// expand.js (as a module)
document.addEventListener('DOMContentLoaded', function() {
  window.scrollTo(0, 0);
  const expandBox = document.getElementById('expand-box-2');
  if (expandBox) { // Check if the element exists (good practice)
    // Function to expand the box based on scroll amount
    function expandBoxOnScroll() {
      const minvh = 5*window.innerHeight
      const maxvh = 9*window.innerHeight
      const scrollAmount = window.scrollY >= minvh ? Math.min((window.scrollY-minvh) / (maxvh-minvh) * 100, 100) : 0; // Get the scroll position

      if (scrollAmount == 0) {
        expandBox.style.display = 'none';
      } else {
        expandBox.style.display = 'flex';
      }

      // Apply new width and height to the box
      expandBox.style.width = `${scrollAmount-1}%`;
    }
    // Listen for the scroll event
    window.addEventListener('scroll', expandBoxOnScroll);
  } else {
    console.error("expand-box element not found!");
  }
});