chrome.storage.local.get('words', function (result) {
  // console.log(result.words);
  // for (let word of result.words) {
  //   badwords.push(word);
  // }
  const badwords = result.words;
  function censorWords(el) {
    if (el.children.length > 0) {
      Array.from(el.children).forEach(function (child) {
        censorWords(child);
      });
    } else {
      if (el.innerText) {
        for (let word of badwords) {
          const re = new RegExp(word, 'gi');
          el.innerHTML = el.innerHTML.replace(re, CensorWord(word));
        }
      }
    }
  }
  censorWords(document.body);
});

const CensorWord = (word) => {
  let s = '';
  for (let i = 0; i < word.length; i++) {
    s += '*';
  }
  return WrapText(s);
};

const WrapText = (text) => {
  return `<span style="background:red;">${text}</span>`;
};

// censorWords(document.body);
// chrome.storage.local.set(
//   {
//     words: [],
//   },
//   function () {}
// );
//document.body.innerHTML = document.body.innerHTML.replace('hello', 'hi');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.task === 'add') {
    if (!request.word.length) return;

    chrome.storage.local.get({ words: [] }, function (result) {
      const words = result.words;
      const exists = words.includes(request.word.toLowerCase());
      if (exists) return;
      chrome.storage.local.set(
        {
          words: [...words, request.word.toLowerCase()],
        },
        function () {
          chrome.storage.local.get('words', function (result) {
            console.log(result.words);
            alert('Added ' + request.word);
          });
        }
      );
    });
  } else if (request.task === 'remove') {
    if (!request.word.length) return;

    chrome.storage.local.get({ words: [] }, function (result) {
      const words = result.words;
      const exists = words.includes(request.word.toLowerCase());
      if (!exists) return;
      chrome.storage.local.set(
        {
          words: words.filter((word) => word !== request.word.toLowerCase()),
        },
        function () {
          chrome.storage.local.get('words', function (result) {
            console.log(result.words);
            alert('Removed ' + request.word);
          });
        }
      );
    });
  } else if (request.task === 'get') {
    chrome.storage.local.get('words', function (result) {
      console.log(result.words);
    });
  }
});
