let gameGrid = document.getElementById("game-grid");
let boxes = document.querySelectorAll(".boxes");
let resetBtn = document.getElementById("reset-btn");

const x_element = "<div class='x'></div>";
const o_element = "<div class='o'></div>";

let matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

const winning_moves = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let play = true;

const sleep = seconds => {
    return new Promise(resolve => 
        setTimeout(resolve, seconds * 1000)
    );
}

const reset = ()=> {
    gameGrid.classList.remove("show-result");
    resetBtn.style.display = "none";

    matrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    boxes.forEach(box => {
        box.style.backgroundColor = "white";
        box.innerHTML = "";
    });

    play = true;
}

const show_results = async ()=> {
    if (matrix.flat().filter(value => value == 0).length == 0) {
        play = false;

        await sleep(0.6);
        gameGrid.classList.add("show-result");

        await sleep(0.2);
        resetBtn.style.display = "block";

        return "draw";
    }

    for (const value of winning_moves) {
        let values = value.map(
            value => matrix[Math.floor(value / 3)][value % 3]
        );

        if (values.filter(value => value == "x").length == 3 || values.filter(value => value == "o").length == 3) {
            play = false;

            value.forEach(value => {
                boxes[value].style.backgroundColor = "#ffd52b";
            });

            await sleep(0.6);
            gameGrid.classList.add("show-result");

            await sleep(0.2);
            resetBtn.style.display = "block";

            return values[0] == "x"?"win":"lose";
        }
    }
}

function bestMoveFor(sign) {
    let moves = [];

    let d1 = matrix.map((value, index) => value[index]);

    if (d1.filter(value => value ==  0).length > 0 && d1.filter(value => value == sign).length == 2) {
        moves.push([Number(d1.indexOf(0)), Number(d1.indexOf(0))]);
    }

    let d2 = matrix.map((value, index) => value[2-index]);

    if (d2.filter(value => value ==  0).length > 0 && d2.filter(value => value == sign).length == 2) {
        moves.push([Number(d2.indexOf(0)), 2-Number(d2.indexOf(0))]);
    }

    for (let index = 0; index < matrix.length; index++) {
        if (matrix[index].filter(value => value ==  0).length > 0 && matrix[index].filter(value => value == sign).length == 2) {
            moves.push([index, Number(matrix[index].indexOf(0))]);
        }

        let col = matrix.map(value => value[index]);

        if (col.filter(value => value ==  0).length > 0 && col.filter(value => value == sign).length == 2) {
            moves.push([Number(col.indexOf(0)), index]);
        }
    }

    return moves;
}

boxes.forEach((box, index)=> {
    const row = Math.floor(index / 3);
    const col = Math.floor(index % 3);

    box.addEventListener("click", async ()=> {
        if (play && matrix[row][col] == 0) {
            box.innerHTML = x_element;
            matrix[row][col] = "x";

            show_results();

            if (play) {
                let moves = bestMoveFor("o");

                if (moves.length == 0) {
                    moves = bestMoveFor("x");

                    if (moves.length == 0) {
                        for (let row = 0; row < matrix.length; row++) {
                            for (let col = 0; col < matrix[row].length; col++) {
                                if (matrix[row][col] == 0) {
                                    moves.push([row, col]);
                                }
                            }
                        }
                    }
                }

                await sleep(0.3);

                let [x, y] = moves[Math.floor(Math.random() * moves.length)];

                matrix[x][y] = "o";
                boxes[x*3 + y%3].innerHTML = o_element;
                show_results();
            }
        }
    });
});