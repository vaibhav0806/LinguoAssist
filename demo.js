async function getData() {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/html`
  );
  //   const jsonData = await response.json();

  console.log(response);
}

getData();
