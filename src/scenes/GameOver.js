import Menu from "./Menu";

export default class GameOver {
  constructor(game, score) {
    this.game = game;
    this.score = score;
    this.newScore = this.score.score;
    this.highScore = this.score.maxScore();
    this._buttonBack = null;
  }

  init() {
    const root = document.getElementById("root");
    root.innerHTML = `
        <div class="game-over">
            <h1>Anjay Bro</h1>
            <p>Your Score: ${this.newScore}</p>
            <p>Your High Score: ${this.highScore}</p>
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
