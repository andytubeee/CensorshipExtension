document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#btn_add').addEventListener('click', addWord, false);
  document
    .querySelector('#btn_remove')
    .addEventListener('click', removeWord, false);
  document.querySelector('#btn_get').addEventListener('click', getWords, false);

  function addWord() {
    const word = document.getElementById('word_input_a').value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { word, task: 'add' },
        function (response) {
          // Response goes here
        }
      );
    });
  }

  function removeWord() {
    const word = document.getElementById('word_input_r').value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { word, task: 'remove' },
        function (response) {
          // Response goes here
        }
      );
    });
  }

  function getWords() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { task: 'get' }, function (response) {
        // Response goes here
      });
    });
  }
});
