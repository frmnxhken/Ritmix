import Game from "@/Game.js";
import Menu from "@/scenes/Menu.js";

const game = new Game();
game.changeScene(new Menu(game));
game.start();
