/* 
DEMO CODE:

document.body.innerHTML = document.body.innerHTML.replace('hello', 'hi'); // replace some but not all words

*/
const censorWords = (el, wordList) => {
  if (el.children.length === 0 && el.innerText) {
    for (let word of wordList) {
      const re = new RegExp(word, 'gi');
      el.innerHTML = el.innerHTML.replace(re, CensorWord(word));
    }
  } else {
    Array.from(el.children).forEach(function (child) {
      censorWords(child, wordList);
    });
  }
};

const clearBrowserStorage = () => {
  chrome.storage.local.clear();
};

const CensorWord = (word) => {
  // Version 1:
  // let s = '';
  // for (let i = 0; i < word.length; i++) {
  //   s += '*';
  // }

  const s = word
    .split('')
    .map((letter, index) => {
      return '*';
    })
    .join('');

  return WrapText(s);
};

const WrapText = (text) => {
  return `<span style="background:red;">${text}</span>`;
};

// clearBrowserStorage();

// const getWords = () => {

// };

chrome.storage.local.get('words', function (result) {
  censorWords(document.body, Array.isArray(result.words) ? result.words : []);
});
// censorWords(document.body, getWords());

const AddWord = (word) => {
  chrome.storage.local.get({ words: [] }, function (result) {
    const words = result.words || [];
    const exists = words.includes(word.toLowerCase());
    if (exists) return alert('Word already exists');
    words.push(word);
    chrome.storage.local.set({ words });
    alert('Added word: ' + word);
  });
};

const RemoveWord = (word) => {
  chrome.storage.local.get({ words: [] }, function (result) {
    const words = result.words;
    const exists = words.includes(word.toLowerCase());
    if (!exists) return alert('Word does not exist');
    chrome.storage.local.set({
      words: words.filter((word) => word !== word.toLowerCase()),
    });
    alert('Removed word: ' + word);
  });
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.task === 'add') {
    if (!request.word.length) return alert("Can't add an empty word");
    AddWord(request.word);
  } else if (request.task === 'remove') {
    if (!request.word.length) return alert("Can't remove empty word");
    RemoveWord(request.word);
  } else if (request.task === 'get') {
    chrome.storage.local.get('words', function (result) {
      console.log(result?.words || []);
    });
  } else if (request.task === 'removeAll') {
    chrome.storage.local.clear();
    alert('Removed all words');
  }
});
