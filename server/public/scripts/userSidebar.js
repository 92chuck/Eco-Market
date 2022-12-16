document.querySelectorAll('#removeBtn').forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    try {
      const productId = e.target.previousSibling.previousSibling.value;

      console.log(productId);

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
  });
});
