const categoryOption = document.querySelector(".category-options");

let filters = [
  "Trending",
  "Domes",
  "Rooms",
  "Farms",
  "Amazing pools",
  "A-frames",
  "Beachfront",
  "Creative spaces",
  "Earth homes",
  "Artic",
  "Castels",
  "Bed&breakfast",
  "Camping",
  "Boats",
  "Houseboat",
  "Golfing",
  "Skiing",
  "Towers",
  "Camper vans",
  "Mountains",
];

filters.forEach((filter) => {
  let newOption = document.createElement("option");
  newOption.innerText = filter;
  newOption.value = filter;
  categoryOption.prepend(newOption);
});

// ********************* Bootstrap Validation code **************************

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
