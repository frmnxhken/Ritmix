export async function loadBeatmap(url) {
  const res = await fetch(url);
  const data = await res.json();
  const meta = data.meta;
  const beatDuration = 60000 / meta.bpm;

  const beatmaps = data.notes
    .map((note) => {
      if ("beat" in note) {
        return {
          ...note,
          time: note.beat * beatDuration,
        };
      }
      return note;
    })
    .sort((a, b) => a.time - b.time);
  return { beatmaps, meta };
}
