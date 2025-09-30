import Gameplay from "@/scenes/Gameplay";

export default class CharacterSelect {
  constructor(game, data) {
    this.game = game;
    this.data = data;
    this.charImages = [
      "https://fridaynightfunkin.wiki.gg/images/Boyfriend.gif?4fb36f",
      "https://fridaynightfunkin.wiki.gg/images/Pico_Newgrounds.gif?a5f3d8",
    ];
    this.currentCharacter = 1;
  }

  init() {
    const root = document.getElementById("root");
    root.innerHTML = `
        <div class="character-select">
            <h1>Select Your Character</h1>
            <div class="select">
                <button id="prev">Prev</button>
                <div class="character">
                    <img id="char"/>
                </div>
                <button id="next">Next</button>
            </div>
            <button id="play">Play</button>
        </div>
    `;

    const character = document.getElementById("char");
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");
    const playButton = document.getElementById("play");

    character.setAttribute("src", this.charImages[this.currentCharacter - 1]);

    playButton.addEventListener("click", () => {
      this.game.changeScene(new Gameplay(this.game, this.data));
    });

    nextButton.addEventListener("click", () => {
      this.currentCharacter >= this.charImages.length
        ? (this.currentCharacter = 1)
        : this.currentCharacter++;
      document
        .getElementById("char")
        .setAttribute("src", this.charImages[this.currentCharacter - 1]);
    });

    prevButton.addEventListener("click", () => {
      this.currentCharacter <= 1
        ? (this.currentCharacter = this.charImages.length)
        : this.currentCharacter--;
      document
        .getElementById("char")
        .setAttribute("src", this.charImages[this.currentCharacter - 1]);
    });
  }

  reset() {
    window.removeEventListener("click", nextButton);
    window.removeEventListener("click", prevButton);
    window.removeEventListener("click", playButton);
  }
}
