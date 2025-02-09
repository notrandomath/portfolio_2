// expand.js (as a module)
document.addEventListener('DOMContentLoaded', function() {
  window.scrollTo(0, 0);
  const expandBox = document.getElementById('expand-box');
  if (expandBox) { // Check if the element exists (good practice)
    // Function to expand the box based on scroll amount
    function expandBoxOnScroll() {
      const maxvh = 4*window.innerHeight
      const scrollAmount = window.scrollY / maxvh * 100; // Get the scroll position

      // Apply new width and height to the box
      expandBox.style.height = `${scrollAmount}%`;
      expandBox.style.top = `calc(50% - ${scrollAmount / 2}%)`;
    }
    // Listen for the scroll event
    window.addEventListener('scroll', expandBoxOnScroll);
  } else {
    console.error("expand-box element not found!");
  }
});