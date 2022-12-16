const addFavorite = async () => {
  try {
    const productId = document.querySelector('#productId').value;

    await fetch(`/addFavorite`, {
      method: 'PUT',
      body: JSON.stringify({
        productId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

const removeFavorite = async () => {
  try {
    const productId = document.querySelector('#productId').value;
    await fetch(`/removeFavorite`, {
      method: 'PUT',
      body: JSON.stringify({
        productId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};
