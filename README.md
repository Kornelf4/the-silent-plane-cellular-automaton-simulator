# The Silent Plane: Cellular automaton simulator and toolbox
> This game was submitted on the PROCJAM2025

> [!NOTE]
> If you don't know what is Conway's Game of Life: [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

Simple, minimalist JavaScript implementation of cellular automatons like Conway's Game of Life and other custom automatons. You can edit and view the cells' rulesets, you can even create your own! Interestingly, you can simulate multiple different cellular automatons at once, and you can also enable mutations (basically, there is a chance that the child cell will have slightly changed version of the parent's ruleset) for a chaotic but fun experience. It's winter themed - now it fits PROCJAM theme.
## Controls
You can find informations about controls in the game.
## How to try it
Two options:
1. Go to [itch.io](https://kornelf.itch.io/conways-game-of-life-evolution) page and try it on the browser
> [!NOTE]
> On itch.io the copy and paste feature might not work due to permission reasons.
2. Download or clone this repository and open index.html in a browser.
## Bonus info
- It's unique in this automation simulator genre, because it can simulate multiple different-behaving automatons at once.
- The snowflakes in the background are procedurally generated in real time.
- The cells with the same ruleset have the same color.
- You can drag and move the windows.
- The simulated world is infinite in theory.
- Three types of mutation exists:
1. The checked area changes.
2. The reaction to the different amount of living neighbors (cells in the checked area) changes.
3. Swap two live cell reaction indices.
- This program was made in just a few days, without external libraries or AI.
- Note: I'm not an expert in this, and I'm still learning. I don't really know the complex math behind this, and I know that my code has a lot of limitations. But I know that it looks good and it's fun. If you like it, give it a star, and if you have feedback or an issue, feel free the create an issue here or ping me on discord (I'm in the ConwayLife server).<br>
~~ Honestly, writing this was the hardest part. ~~
> [!NOTE]
> Contributions, pull requests are also welcome.