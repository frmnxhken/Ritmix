import playlists from "@/playlist.json";
import Gameplay from "@/scenes/Gameplay.js";
import Store from "@/utils/Store";

export default class Menu {
  constructor(game) {
    this.game = game;
    this._menuHandler = null;
  }

  init() {
    const root = document.getElementById("root");
    root.innerHTML = `
      <div class="menu">
        <h1>Select Music</h1>
          <div class="list-music">
        ${playlists.data
          .map(
            (playlist, id) =>
              `<div class="music" data-id="${id}">
            ${playlist.title}
          </div>`
          )
          .join("")}
          </div>
      </div>
    `;

    const store = new Store("ritmix");
    const menu = document.querySelector(".menu");
    this._menuHandler = (e) => {
      if (e.target.classList.contains("music")) {
        const id = e.target.dataset.id;
        const metaId = playlists.data[id].id;
        const isExist = store.getBy("id", metaId).length;
        if (!isExist) store.insert({ id: metaId, highscore: 0 });
        this.game.changeScene(new Gameplay(this.game, playlists.data[id]));
      }
    };

    menu.addEventListener("click", this._menuHandler);
    this._menu = menu;
  }

  destroy() {
    if (this._menu && this._menuHandler) {
      this._menu.removeEventListener("click", this._menuHandler);
      this._menuHandler = null;
      this._menu = null;
    }
  }
}
