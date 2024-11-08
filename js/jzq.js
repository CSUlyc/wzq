
/* 0 1 2 
   3 4 5
   6 7 8 */
var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
/*胜利的线组，包括对角线*/
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
/*获取元素*/
const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    //设置阵列点  创建9个数组元素，元素的键0到8
    origBoard = Array.from(Array(9).keys());
    console.log(origBoard);
    for (var i = 0; i < cells.length; i++) {
        //把文本先设置为空
        cells[i].innerHTML = "";
        //删除属性知道已经有人赢了
        cells[i].style.removeProperty('background-color');
        //点击方块
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    //控制台点击日志
    console.log(square.target.id);
    //记住原来走过的方块
    if (typeof origBoard[square.target.id] == 'number') {
        //人类玩家点击
        turn(square.target.id, huPlayer);
        //由人类转向AI玩家
        if (!checkTie()) {
            //电脑玩家将拐弯，走最合适的地方
            turn(bestStep(), aiPlayer);
            console.log(origBoard);
            // console.log(origBoard);
        }
    }

}
//参数是方块ID，玩家
function turn(squareId, player) {
    //这些板阵列数组将属于玩家
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    //让游戏进行检查
    var gameWin = checkWin(origBoard, player);
    if (gameWin) {
        gameOver(gameWin);
    }
}
/*检查是否胜利方法*/
function checkWin(board, player) {
    //使用reduce累加器收集玩家棋子位置
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, [])
    let gameWin = null;
    //如果是属于之前winCombos胜利组合
    for (let [index, win] of winCombos.entries()) {
        if (win.every(Element => plays.indexOf(Element) > -1)) {
            //现在我们知道是哪一个组合胜利了
            gameWin = { index: index, player: player };
            break;
        }
    }
    return gameWin;
}
/*游戏结束*/
function gameOver(gameWin) {
    for (let index of winCombos[gameWin.index]) {
        //人类获胜则为蓝色
        document.getElementById(index).style.backgroundColor =
            gameWin.player == huPlayer ? "blue" : "red";
    }
    /*事件侦听器删除单击，已经结束了，你不能再点击*/
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWin.player == huPlayer ? "你已经获得了胜利" : "对不起，你输了");
}

function emptySquares() {
    //过滤每一个元素,如果元素为number，返回所有方块
    return origBoard.filter(s => typeof s == 'number');
}

/*AI最优步骤*/
function bestStep() {
    //简单AI
    //	return emptySquares()[0];
    //智能AI
    return minmax(origBoard, aiPlayer).index;
    // return getBestMoveForAI();
}
//眼睛功能，检查是否是平局
function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        //平局
        declareWinner("Tie Game");
        return true;
    } else {
        return false;
    }

}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = 'block';
    document.querySelector(".endgame .text").innerHTML = who;
}

function minmax(newBoard, player) {
    //找到索引，空方块功能设置为a
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, player)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    //之后进行评估
    var moves = [];
    //收集每个动作时的空白点
    for (var i = 0; i < availSpots.length; i++) {
        //然后设置空的索引号
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            //存储对象，包括得分属性
            var result = minmax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            //存储对象，包括得分属性
            var result = minmax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }
    console.log(moves);
    var bestMove;
    //如果是AI玩家，以非常低的数字和循环通过
    if (player === aiPlayer) {
        var bestScore = -1000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 1000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    console.log(moves[bestMove])
    return moves[bestMove];
}

//--------------------------------------------------------------------//

// function afminmax(newBoard, player, alpha, beta) {
//     // 如果没有提供 alpha 和 beta，则初始化为极端值
//     if (typeof alpha === 'undefined') alpha = -Infinity;
//     if (typeof beta === 'undefined') beta = Infinity;

//     // 找到索引，空方块功能设置为空
//     var availSpots = emptySquares(newBoard);

//     // 检查当前玩家是否胜利
//     if (checkWin(newBoard, player)) {
//         return { score: -100 };
//     }
//     // 检查对手是否胜利
//     else if (checkWin(newBoard, aiPlayer)) {
//         return { score: 100 };
//     }
//     // 检查是否平局
//     else if (availSpots.length === 0) {
//         return { score: 0 };
//     }

//     // 初始化最佳得分
//     var bestScore;

//     // 遍历所有可能的移动
//     for (var i = 0; i < availSpots.length; i++) {
//         var move = {};
//         move.index = newBoard[availSpots[i]];

//         // 临时做出这个移动
//         newBoard[availSpots[i]] = player;

//         var result;
//         if (player == aiPlayer) {
//             // 如果是 AI 玩家，则寻找最小得分（因为 AI 试图最大化对手的损失）
//             result = afminmax(newBoard, huPlayer, alpha, beta);
//             move.score = -result.score;
//             alpha = Math.max(alpha, result.score);

//             // Alpha 剪枝：如果当前分支的得分已经大于或等于 beta，则无需继续搜索此分支
//             if (alpha >= beta) {
//                 break;
//             }
//         } else {
//             // 如果是人类玩家，则寻找最大得分
//             result = afminmax(newBoard, aiPlayer, alpha, beta);
//             move.score = result.score;
//             beta = Math.min(beta, result.score);

//             // Beta 剪枝：如果当前分支的得分已经小于或等于 alpha，则无需继续搜索此分支
//             if (alpha >= beta) {
//                 break;
//             }
//         }

//         // 恢复棋盘状态
//         newBoard[availSpots[i]] = move.index;

//         // 更新最佳得分
//         if ((player == aiPlayer && (bestScore === undefined || move.score < bestScore)) ||
//             (player == huPlayer && (bestScore === undefined || move.score > bestScore))) {
//             bestScore = move.score;
//             bestMove = i; // 这里需要有一个外部变量 bestMove 来记录最佳移动的索引
//         }
//     }
//     return { score: bestScore, index: availSpots[bestMove] }; // 注意：这里假设 bestMove 已经在外部定义并更新
// }

// function getBestMoveForAI() {
//     let bestMoveIndex;
//     let bestMoveScore = -Infinity;
//     theBoard = [];
//     for (i = 0; i < origBoard.length; i++) {
//         theBoard[i] = origBoard[i];
//     }
//     for (let spot of emptySquares(origBoard)) {
//         t = origBoard[spot];
//         console.log(t);
//         origBoard[spot] = aiPlayer;
//         let result = afminmax(origBoard, aiPlayer);
//         for (i = 0; i < origBoard.length; i++) {
//             origBoard[i] = theBoard[i];
//         }
//         if (result.score > bestMoveScore) {
//             bestMoveScore = result.score;
//             bestMoveIndex = spot;
//         }
//     }
//     console.log(bestMoveIndex);
//     return bestMoveIndex;
// }



