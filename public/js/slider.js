const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider-container");
const next = document.querySelector(".arrow.right");
const prev = document.querySelector(".arrow.left");
const taxeShow = document.querySelector(".form-check-input");
const links = document.querySelectorAll(".slide a");
let currentIndex = sliderIndex;
let slideArrowEnd = 2;

let checkedFilter = selectedFilter;
console.log(checkedFilter);

function arrowVisbilityFeatures() {
  // console.log(window.innerWidth);
  if (window.innerWidth <= 830) {
    slideArrowEnd = 6;
  } else if (window.innerWidth <= 982) {
    slideArrowEnd = 5;
  } else if (window.innerWidth <= 1114) {
    slideArrowEnd = 3;
  }
  if (currentIndex <= 0) {
    prev.classList.add("hide-arrow");
    next.classList.remove("hide-arrow");
  } else if (currentIndex >= slideArrowEnd) {
    next.classList.add("hide-arrow");
    prev.classList.remove("hide-arrow");
  } else {
    next.classList.remove("hide-arrow");
    prev.classList.remove("hide-arrow");
  }
}

window.addEventListener("load", () => {
  arrowVisbilityFeatures();
  slider.style.transition = `transform 0s steps()`;
  slider.style.transform = `translateX(-${currentIndex * 40}%)`;
});

function updateSlider() {
  slider.style.transition = `transform 0.5s ease-in-out`;
  slider.style.transform = `translateX(-${currentIndex * 40}%)`;
  arrowVisbilityFeatures();
  // console.log(currentIndex);
}

next.addEventListener("click", () => {
  currentIndex++;
  updateSlider();
});

prev.addEventListener("click", () => {
  currentIndex--;
  updateSlider();
});

taxeShow.addEventListener("change", () => {
  let taxes = document.querySelectorAll("#taxerate");
  taxes.forEach((taxe) => {
    taxe.classList.toggle("hidetaxes");
  });
});

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    link.href = `${link.href}/${currentIndex}`;
  });
  if (link.innerText === checkedFilter) {
    let slide = link.parentNode;
    slide.classList.add("seletedFiter");
  }
});
