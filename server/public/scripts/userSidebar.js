const removeFavorite = async () => {
  try {
    const productId =
      document.getElementById('removeBtn').previousSibling.previousSibling
        .value;

    await fetch(`/removeFavorite`, {
      method: 'PUT',
      body: JSON.stringify({
        productId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    window.location.href = 'http://localhost:3000/';
  } catch (e) {
    console.error(e);
  }
};
