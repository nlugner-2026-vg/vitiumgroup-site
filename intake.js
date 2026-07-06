const otherToggle = document.getElementById("sector_other_toggle");
const otherField = document.getElementById("sector_other_field");

otherToggle.addEventListener("change", () => {
    otherField.classList.toggle("vg-hidden", !otherToggle.checked);
});
