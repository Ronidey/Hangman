// ============= Words ==============
const words = [
  { text: 'star', hint: 'Twinkle twinkle' },
  { text: 'pizza', hint: 'A popular fast food' },
  { text: 'happiness', hint: 'A human emotion' },
  { text: 'titanic', hint: "It's a ship.. no it's a movie" },
  { text: 'wrong', hint: 'you can\'t be right when you are "?"' },
  { text: 'time', hint: "Once it's gone it never comes back" },
  { text: 'programming', hint: 'Giving instructions to the computer' },
  { text: 'javascript', hint: 'A programming language' }
];

// ============= UIController ==============
const UICtrl = (() => {
  const DOMElms = {
    blanks: document.getElementById('blanks'),
    hint: document.getElementById('hint'),
    totalLives: document.getElementById('total-lives'),
    modal: document.getElementById('modal'),
    bodyParts: document.getElementsByClassName('body-part')
  };

  const displayModal = () => {
    DOMElms.modal.classList.add('is-visible');
  };

  const hideModal = () => {
    DOMElms.modal.classList.remove('is-visible');
  };

  const hideHangman = () => {
    for (let i = 0; i < DOMElms.bodyParts.length; i++) {
      DOMElms.bodyParts[i].classList.remove('is-visible');
    }
  };

  const render = (game) => {
    DOMElms.blanks.innerHTML = game.playerGuess.join('');
    DOMElms.hint.textContent = game.hint;
    DOMElms.totalLives.textContent = game.lives;

    for (let i = 0; i < game.wrongAns; i++) {
      DOMElms.bodyParts[i].classList.add('is-visible');
    }
  };

  const addSuccess = () => {
    DOMElms.blanks.classList.add('success');
  };

  const removeSuccess = () => {
    DOMElms.blanks.classList.remove('success');
  };

  const wrong = () => {
    DOMElms.blanks.classList.remove('wrong');
    setTimeout(() => {
      DOMElms.blanks.classList.add('wrong');
    }, 0);
  };

  return {
    DOMElms,
    render,
    addSuccess,
    removeSuccess,
    wrong,
    displayModal,
    hideModal,
    hideHangman
  };
})();

// ============= Game Class ==============
class Game {
  constructor(UICtrl, words) {
    this.words = words;
    this.UICtrl = UICtrl;
    this.wordCount = 0;
    this.lives = 6;
    this.gameOver = false;
    this.wrongAns = 0;

    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.UICtrl.hideModal();
    this.UICtrl.hideHangman();
    this.wordCount = 0;
    this.lives = 6;
    this.gameOver = false;
    this.wrongAns = 0;

    this.start();
  }

  start() {
    this.UICtrl.removeSuccess();
    this.currentWordObj = this.words[this.wordCount];
    this.wordArr = this.currentWordObj.text.toLowerCase().split('');
    this.hint = this.currentWordObj.hint;

    const clue1 = Math.floor(Math.random() * this.wordArr.length);
    const clue2 = Math.floor(Math.random() * this.wordArr.length);

    this.playerGuess = this.wordArr.map((ltr, indx) => {
      if (indx === clue1 || indx === clue2) return `<span>${ltr}</span>`;
      return `<span>?</span>`;
    });

    this.UICtrl.render(this);
  }

  checkMatch(typedKey) {
    // if game is not over then check for match
    if (!this.gameOver) {
      typedKey = typedKey.toLowerCase();
      let isMatch = false;

      for (let i = 0; i < this.wordArr.length; i++) {
        if (this.wordArr[i] === typedKey) {
          this.playerGuess[i] = `<span>${typedKey}</span>`;
          isMatch = true;
        }
      }

      // if matched
      if (isMatch) {
        if (this.playerGuess.join('').indexOf('?') === -1) {
          this.wordCount++;
          if (this.wordCount === this.words.length) this.wordCount = 0;
          this.UICtrl.addSuccess();
          setTimeout(this.start, 500);
        }
        // if not matched
      } else {
        this.UICtrl.wrong();
        this.lives--;
        this.wrongAns++;

        if (this.lives === 0) {
          this.gameOver = true;
          this.UICtrl.displayModal();
        }
      }
    }

    this.UICtrl.render(this);
  }
}

const game = new Game(UICtrl, words);
game.start();

document.getElementById('btn-restart').addEventListener('click', game.reset);

window.addEventListener('keypress', function (e) {
  game.checkMatch(e.key);
});
