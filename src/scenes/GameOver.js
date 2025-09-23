import Menu from "./Menu";

export default class GameOver {
  constructor(game, score) {
    this.game = game;
    this.score = score;
    this._buttonBack = null;
  }

  init() {
    const root = document.getElementById("root");
    root.innerHTML = `
        <div class="game-over">
            <h1>Anjay Bro</h1>
            <p>Your Score: ${this.score}</p>
            <button>Back To Menu</button>
        </div>
    `;
    const buttonBack = document.querySelector("button");
    buttonBack.addEventListener("click", () =>
      this.game.changeScene(new Menu(this.game))
    );
    this._buttonBack = buttonBack;
  }

  destroy() {
    window.removeEventListener("click", this._buttonBack);
  }
}
