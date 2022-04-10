'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Nav component
const nav = document.querySelector('.nav');

///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// same thing as above but in a better way
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // Getting the rectangle for the button - returning the size and position of the button relative to the viewport
  // console.log(e.target.getBoundingClientRect());

  // Getting the current scroll position X/Y
  // console.log(window.pageXOffset, window.pageYOffset);

  // To get the height and width of the current viewport
  // console.log(
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // To signify to JS where to scroll too
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  ////// MODERN WAY OF DOING THE SCROLL ///////
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

////////////////////////////////////////////////////////////////////////
// PAGE NAVIGATION
// Old way of handling page scroll
// const pg_btn = document.querySelectorAll('.nav__link');
// pg_btn.forEach(function (ele) {
//   ele.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

// Using Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e);
  // e.target tells us exactly where the event happened
  e.preventDefault();

  //To make sure that the event happens on a link we click, we need to ensure that the target is the one we need
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// TAB EFFECTS
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause - prevent returning an error message when the button area or span element is clicked
  if (!clicked) return;

  // removing Active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  // We could also use optional chaining instead of Guard clause
  // clicked?.classList.add('operations__tab--active');

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Tab contents
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

// This is one way of handling it
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// A better way of doing it is - a new function is created which passes the argument into the handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY Navigation
// 1. Doing this entire process is inefficient for all screen sizes
// const pageCords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > pageCords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// 2 - Using Intersection Observer API (Best way)
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// threshold is the % of intersection inwhich the callback function will be called.
// const obsOpt = {
//   root: null,
//   threshold: 0.1,
// };

// It takes two arguments (callback function, object)
// const observer = new IntersectionObserver(obsCallBack, obsOpt);

// we call the method to be used on the API and the target element we want to observe (section 1 was selected)
// observer.observe(section1);

// 3. Implementing the sticky header
const header = document.querySelector('header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

// Not a good idea to have the rootMargin fixed because for responsive sites the sizes are different
const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObs.observe(header);

// Reveal Sections
const sectionsAll = document.querySelectorAll('.section');

const revealSec = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  // Page to stop observing after adding the effects needed- For better performance
  observer.unobserve(entry.target);
};

const sectionObs = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
});

sectionsAll.forEach(sect => {
  sectionObs.observe(sect);

  sect.classList.add('section--hidden');
});

// LAZY LOADING
const imgTarget = document.querySelectorAll('img[data-src]');

const imgCallBack = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replacing the src images with the data-src (placeholder images)
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObs = new IntersectionObserver(imgCallBack, {
  threshold: 0,
  rootMargin: '-200px',
});

imgTarget.forEach(imgs => {
  imgObs.observe(imgs);
});

// SLIDES
const initSlider = function () {
  const slides = document.querySelectorAll('.slide'); // This is a nodelist
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlides = slides.length;

  // Functions
  // creating the dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // changing the background on the dots
  const activateDot = function (slide) {
    // first thing we do is to remove all active dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // Then we add the dot to the corresponding slide
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Slides effect function
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  // Function for the sliding effect
  const nextSlide = function () {
    if (curSlide === maxSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlides - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Function calls
  const callFunction = function () {
    createDots();
    activateDot(0);
    // Makes the slide begin at 0 and then move to 0%, 100%, 200%, and 300%
    goToSlide(0);
  };

  callFunction();

  // Visibility of the effect
  // slider.style.overflow = 'visible';
  // slider.style.transform = 'scale(0.5) translateX(-500px)';

  // Event Handlers
  // Sliding effect
  // we want the slides to be moved to -100%, 0%, 100%, and 200% when we click the right arrow
  btnRight.addEventListener('click', nextSlide);

  // for the left arrow
  btnLeft.addEventListener('click', prevSlide);

  // Enabling keyboard events to slide images
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

initSlider();
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// To select the document of the entire webpage
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('header');

/* 
  Select all the button elements - returns an HTML collection
  If the DOM gets updated, this also automatically gets updated. Like if a button is removed, it automatically does not read that button anymore (useful)

  -- The same thing does not happen with a node list. It does not update automatically if a section is removed. 
*/

// const buttonTag = document.getElementsByTagName('button');
// console.log(buttonTag);

// Similar to getELementById - returns live HTML collection
// document.getElementsByClassName('btn');

////////////////////////////////////////////////////////////////////////
// Creating and inserting HTML elements
// .insertAdjacentHTML

// This creates a div element which is not in the DOM yet. We need to manually insert it.
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie"> Got it </button>';

// lets insert the created element into the DOM - This returns only one message element
// header.prepend(message); // adds it to the top - first child element
// header.append(message); // adds to the bottom of the header
// This adds multiple message elements (prepend and append)
// header.append(message.cloneNode(true)); // adds both the top with the prepend being active and the append message elements

// other ways of inserting elements
// header.after(message); // adds after the header
// header.before(message); // adds before the header

////////////////////////////////////////////////////////////////////////
// Deleting elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

////////////////////////////////////////////////////////////////////////
// styles
// message.style.backgroundColor = 'gray';
// message.style.width = '120%';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// Accessing and changing CSS color style in the :root css
// all the elements using this color can be changed with just this
// document.documentElement.style.setProperty('--color-primary', 'orangered');

////////////////////////////////////////////////////////////////////////
// ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// alt, id, class are all considered as standard attributes
// console.log(logo.alt);
// console.log(logo.id);
// console.log(logo.src);
// console.log(logo.className);

// When an attribute is not the standard as recognized by the DOM, it cannot be read simply, but we can by...
// console.log(logo.getAttribute('designer'));

// as we can read attributes we can set them too
// logo.alt = 'Beautiful minimalist logo';
// logo.setAttribute('company', 'Bankist');

// const link = document.querySelector('.twitter-link');
// console.log(link.getAttribute('href'));

////////////////////////////////////////////////////////////////////////
// Class
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');

////////////////////////////////////////////////////////////////////////
// Scroll Property

////////////////////////////////////////////////////////////////////////
// Events
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('Great to see you hovering over me');

//   // removing an event listener
//   h1.removeEventListener('mouseenter', alertH1);
// };

// // mouseenter is like the hover in CSS (does not bubble)
// h1.addEventListener('mouseenter', alertH1);

// Another way of attaching an eventlistener
// h1.onmouseenter = function (e) {
//   alert('Great to see you hovering over me');
// };

// const randomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   // Target is where the event first originated, because of bubbling, the event is also accessed by its parent links and it goes much further
//   console.log('LINK', e.target, e.currentTarget);

//   // This stops bubbling from happening. So the parent elements do not target the link
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   console.log('ContaIner', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true
// );

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// DOM Traversing
// const h1 = document.querySelector('h1');

// Going downwards: selecting child elements
// console.log(h1.querySelectorAll('.highlight'));

// console.log(h1.childNodes);
// console.log(h1.children); // gives the exact elements that are part of the h1 tag in an HTML Collection

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'black';

// Going downwards: selecting parent elements
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// to find a parent element regardless of how far hidden it is in the dom tree
// h1.closest('.header').style.background = 'orangered';

// Going sideways: selecting siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// getting all of the siblings - from the parents to the sibling (brilliant)
// console.log(h1.parentElement.children);

// h1.parentElement.style.textTransform = 'uppercase';
