import Note from "@/components/Note";

export default class NoteManager {
  constructor(meta = null) {
    this.notes = [];
    this.meta = meta;
  }

  setMeta(meta) {
    this.meta = meta;
  }

  spawn(noteData) {
    this.notes.push(new Note(noteData, this.meta));
  }

  update(deltaTime, currentTimeMs, score) {
    this.notes.forEach((note) => note.update(deltaTime, currentTimeMs));
    this.notes = this.notes.filter(
      (note) => !note.remove(currentTimeMs, score)
    );
  }

  draw(ctx) {
    this.notes.forEach((note) => note.draw(ctx));
  }
}
