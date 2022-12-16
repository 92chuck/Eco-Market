const brandCheckBoxes = document.querySelectorAll('.form-check-input-brand');
const typesCheckBoxes = document.querySelectorAll('.form-check-input-type');

document.querySelector('#filterBtn').addEventListener('click', async (e) => {
  try {
    const brands = [];
    const types = [];
    let brandsQueryStr = '';
    let typesQueryStr = '';

    brandCheckBoxes.forEach((brand) => {
      if (brand.checked) {
        brands.push(brand.id);
      }
    });
    typesCheckBoxes.forEach((type) => {
      if (type.checked) {
        types.push(type.id);
      }
    });

    brandsQueryStr = brands.join(';');
    typesQueryStr = types.join(';');

    await fetch(
      `/products?page=1&brands=${brandsQueryStr}&types=${typesQueryStr}`
    );
    window.location.href = `http://localhost:3000/products/?page=1/&brands=${brandsQueryStr}&types=${typesQueryStr}`;
  } catch (e) {
    console.error(e);
  }
});
