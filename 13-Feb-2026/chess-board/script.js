const board = document.getElementById("board");

for (let row = 0; row < 8; row += 1) {
  for (let col = 0; col < 8; col += 1) {
    const square = document.createElement("div");
    const isDark = (row + col) % 2 === 1;

    square.className = [
      "aspect-square",
      isDark ? "bg-zinc-800" : "bg-zinc-100",
    ].join(" ");

    board.appendChild(square);
  }
}
