let _ = require('underscore');
let inputData = require('./input-data');
let Constants = require('./constants');

// Current Sub position & "Aim"
let subPosition = 0;
let subDepth = 0;
let subAim = 0;

console.info("");
console.info(" --------------------------------------- ");
console.info("   A D V E N T  O F  C O D E  2 0 2 1 ");
console.info("   (See https://adventofcode.com/2021)");
console.info(" --------------------------------------- ");
console.info("   Run at", new Date());
console.info("");

// Day 1a: Determine the nuber of times the depth increases
console.info("Day #1a: Ocean Depth increases", countIncrDepths(inputData.someDepths), "times");

// Day 1b: Determine the nuber of times a 3 measurement window depth increases
console.info("    #1b: 3 measurement window increases", countIncrDepthsByWindow(inputData.someDepths, 3), "times");

// Day 2a: Sub commands -> forward 1, down 2, or up 3:
console.info("Day #2a: Final positions multiplied:", finalPositionMultiplied(inputData.someSubCommands));

// Day 2b: Sub commands clarified, with Aim.  Reset our location and try again!
subPosition = 0;
subDepth = 0;
console.info("    #2b: Final position multiplied, using Aim:", finalPositionMultipliedTwo(inputData.someSubCommands));

// Day 3a: Determine Epsilon and Gamma values based on binary diagnostics
console.info("Day #3a: Product of Epsilon and Gamma is:", epsilonGammaProduct(inputData.someDiagnostics));

// Day 3b: the life support rating, which can be determined by multiplying the oxygen generator rating by the CO2 scrubber rating
console.info("    #3a: Life Support Rating is:", lifeSupportRating(inputData.someDiagnostics));

// Day 4a: Bingo vs. the Squid to win
console.info("Day #4a: The board I want to play with has a value of:", findBestBingoBoard(inputData.someBingoNums, inputData.someBingoBoards));

// Day 4b: Bingo vs. the Squid to lose on purpose
console.info("    #4b: To lose, I should play the board with a value of:", findWorstBingoBaord(inputData.someBingoNums, inputData.someBingoBoards));

// Day 5a: Avoid overlapping heat vents
console.info("Day #5a: Avoding overlapping heat vent locations, without diagonals, of which there are", findOverlappingVents(inputData.someHeatVents, true));

// Day 5a: Avoid overlapping heat vents
console.info("    #5b: Avoding overlapping heat vent locations, of which there are", findOverlappingVents(inputData.someHeatVents, false));

/**
 * Day #1a: Determine the nuber of times the depth increases
 * 
 * @param someDepths Array of numeric values for the ocean depth
 */
function countIncrDepths(someDepths) {
    let lastDepth = null;
    let deeperCnt = 0;
    _.each(someDepths, function (aDepth, index, list) {
        if ( (lastDepth !== null) && (aDepth > lastDepth) ) {
            deeperCnt++;
        }
        lastDepth = aDepth;
    });
    return deeperCnt;    
}


/**
 * Day #1b: Determine the nuber of times a <windowSize> measurement window depth increases
 *
 * @param someDepths Array of numeric values for the ocean depth
 * @param windowSize Groups of depths to sum together
 */
 function countIncrDepthsByWindow(someDepths, windowSize) {
     let windowDepths = [];             // New array to hold sums of all depths in a window
     let startIndex = (windowSize - 1); // Zero based arrays, start at index 2 for a Window of 3

    // Chunk our depths into sums <windowSize> values, and the pass it to day #1a for the answer
    for ( let i = startIndex; i < someDepths.length; i++ ) {
        // Sum up each value in the window range
        let windowSum = 0;
        for ( let j = (i - startIndex); j <= i; j++ ) {
            windowSum += someDepths[j];
        }

        // Add it to our new Array so that we can find the # of times the depth increases
        windowDepths.push( windowSum );
    }
    return countIncrDepths(windowDepths);
 }


 /**
  * Day #2a: Pilot this thing
  *  Commands => forward 1, down 2, or up 3
  *  Forward X increases the horizontal position by X units.
  *  Down X increases the depth by X units.
  *  Up X decreases the depth by X units.
  * 
  * Calculate the horizontal position and depth you would have after 
  *  following the planned course (the puzzle input). What do you get 
  *  if you multiply your final horizontal position by your final depth?
  * 
 * @param someSubCommands Array of string commands, e.g., 'forward 6',  or 'down 2', or 'up 3'
  */
 function finalPositionMultiplied(someSubCommands) {
    
    // For each sub movement command, calulate the change to the sub's position (vertical & horizontal)
    _.each(someSubCommands, function (cmd, index, list) {
        let cmdParts = cmd.split(" ");
        let action = cmdParts[0];
        let power = parseInt(cmdParts[1]);

        if ( action === Constants.COMMAND_FORWARD ) {
            subPosition += power;
        } 
        else {
            if ( action === Constants.COMMAND_UP ) {
                power = -power;
            }
            subDepth += power;
        }
    });

    // Return the product of horizontal & vertical position
    return subPosition * subDepth;
 }

/**
 * Day #2b:
 * In addition to horizontal position and depth, you'll also need to track a third value,
 *  aim, which also starts at 0. The commands also mean something entirely different than 
 *  you first thought:
 *   down X increases your aim by X units.
 *   up X decreases your aim by X units.
 *   forward X does two things:
 *     It increases your horizontal position by X units.
 *     It increases your depth by your aim multiplied by X.
 *  
 * @param someSubCommands Array of string commands, e.g., 'forward 6',  or 'down 2', or 'up 3'
 */
 function finalPositionMultipliedTwo(someSubCommands) {
  
    // For each sub movement command, calulate the change to the sub's position (vertical & horizontal)
    _.each(someSubCommands, function (cmd, index, list) {
        let cmdParts = cmd.split(" ");
        let action = cmdParts[0];
        let power = parseInt(cmdParts[1]);

        if ( action === Constants.COMMAND_FORWARD ) {
            subPosition += power;
            subDepth += power * subAim;
        } 
        else {
            if ( action === Constants.COMMAND_UP ) {
                power = -power;
            }
            subAim += power;
        }
    });

    // Return the product of horizontal & vertical position
    return subPosition * subDepth;
 }


/**
 * Day #3a
 * Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate, then multiply them together. 
 * What is the power consumption of the submarine? (Be sure to represent your answer in decimal, not binary.)
 * 
 * Each bit in the gamma rate can be determined by finding the most common bit in the corresponding position of all numbers in the diagnostic report.
 * The epsilon rate is calculated in a similar way; rather than use the most common bit, the least common bit from each position is used.
 * 
 * @param someDiagnostics Array of string binary values
 */
function epsilonGammaProduct(someDiagnostics) {
    let diagCnt = someDiagnostics.length;
    let aryCommon = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let gamma = "";
    let epsilon = "";

    // Find most common bit in each position (e.g., 0 or 1).  That's Gamma.
    _.each(someDiagnostics, function (aDiag, index, list) {
        let aryBits = aDiag.split("");
        _.each(aryBits, function(aBit, index, list) {
            aryCommon[index] += parseInt(aBit);
        });
    }); 

    // We have counts of each position in aryCommon now.  If the count > (.5 * diagCnt), there were more 1s than 0s.
    _.each(aryCommon, function(aCnt, index, list) {
        let newBit = "0";
        if ( aCnt >= (diagCnt / 2) ) newBit = "1";
        gamma = gamma + newBit;
    });

    // Flip bits in Gamma for Epsilon
    _.each(gamma, function(aBit, index, list) {
        epsilon = epsilon + (aBit === "1" ? "0" : "1");
    });

    // Convert both to a decimal number
    let gammaDecimal = binaryToDecimal(gamma);
    let epsilonDecimal = binaryToDecimal(epsilon);

    // Multiple and return both decimal numbers
    return gammaDecimal * epsilonDecimal;
}


/**
 * A binary to decimal function.
 * 
 * @param {*} binary String of zeros and ones.
 */
function binaryToDecimal(binary) {

    // Flip the order of the bits, to left to right.  For each bit, if it's on, add it's positional value to the current sum.
    return binary.split("").reverse().reduce(function(previous, aBit, index) {
      return (aBit === "1") ? previous + Math.pow(2, index) : previous;
    }, 0);

}


/**
 * The life support rating, which can be determined by multiplying the oxygen generator rating by the CO2 scrubber rating
 * 
 * To find oxygen generator rating, determine the most common value (0 or 1) in the current bit position, and keep only 
 *  numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 1 in the position being considered.
 * 
 * To find CO2 scrubber rating, determine the least common value (0 or 1) in the current bit position, and keep only 
 *  numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 0 in the position being considered.
 * 
 * @param {*} someDiagnostics 
 */
function lifeSupportRating(someDiagnostics) {

    let o2, co2 = "";

    // Oxygen Generator Rating
    // Find most common value in first bit, reduce to only string that have that value as their first bit
    //  Repeat for each bit, and keep reducing
    //  When the length of the array == 1, done. Turn that binary string to a decimal.
    o2 = reduceOnCommonBit(someDiagnostics, true, 0);

    // CO2 Scrubber Rating
    // Find most common value in first bit, reduce to only string that have that value as their first bit
    //  Repeat for each bit, and keep reducing
    //  When the length of the array == 1, done. Turn that binary string to a decimal.
    co2 = reduceOnCommonBit(someDiagnostics, false, 0);

    // Finally, to find the life support rating, multiply the oxygen generator rating by the CO2 scrubber rating.
    return binaryToDecimal(o2) * binaryToDecimal(co2);
}


/**
 * Filter items out of an array based on what bit value is most or least common at each incrementing bit position
 * 
 * @param {*} ary 
 * @param {*} bitPos 
 */
function reduceOnCommonBit(ary, isMostCommon, bitPos) {
    
    let aryOn = [];
    let aryOff = [];

    // If there is one value in ary, we're done
    if ( ary.length === 1 ) return ary.join("");

    // Sort the source array into two arrays, based on the bit in bitPos
    _.each(ary, function(val, index, list) {
        (val.substr(bitPos, 1) === "1") ? aryOn.push(val) : aryOff.push(val);
    });
    
    // Depending on if we want to filter on most or least common values, find the 
    //  right array to pass on for processing on the next bit position.
    let aryToPass;
    if (isMostCommon) 
        aryToPass = (aryOn.length >= aryOff.length) ? aryOn : aryOff;
    else
        aryToPass = (aryOn.length < aryOff.length) ? aryOn : aryOff;

    return reduceOnCommonBit(aryToPass, isMostCommon, (bitPos+1));
}


/**
 * The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board; 
 *   in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24, 
 *   to get the final score, 188 * 24 = 4512.
 * 
 * To guarantee victory against the giant squid, figure out which board will win first. What will your final score be 
 *   if you choose that board?
 * 
 * @param {*} someNums      Bingo numbers called in order
 * @param {*} someBoards    Bingo boards array (array of arrays)
 */
function findBestBingoBoard(someNums, someBoards) {
    let winningBoardIdx = null;
    let winningBoardSum = 0;
    let lastNumberCalled = null;
    let affectedBoards = [];

    // For each Bingo Number Drawn (as a for loop, to easily kick out)
    for ( var numberIdx = 0; numberIdx < someNums.length; numberIdx++ ) {
        let aNumber = someNums[numberIdx];

        // For each Bingo Board, update the number played to a *
        affectedBoards = updateBoardsForNumber(someBoards, aNumber, affectedBoards);

        // For each affected board, see if we have a winner.  Small optimization, we can't have a winner until we have five numbers drawn.
        if ( numberIdx >= 4 ) {
              
            // Get a unique set of board numbers to process since one number could be on a board more than once
            let boards = affectedBoards.filter((v, i, a) => a.indexOf(v) === i);

            // Check each board affected by the last number drawn to see if it won
            for ( var i = 0; i < boards.length; i++ ) {
                let aBoardIdx = boards[i];
                if ( checkBoardForWin(someBoards[aBoardIdx]) ) {
                    winningBoardIdx = aBoardIdx;
                    break;
                }
            }

            // We processed them, so clear affected boards to continue looking for a winner
            affectedBoards = [];
        }

        // See if we have found a winning board!
        if ( winningBoardIdx != null ) {
            // Get teh board, and sum up the numbers not yet removed
            let board = someBoards[winningBoardIdx];
            for ( var i = 0; i < board.length; i++ ) {
                let numbers = _.filter(board[i], function(item) { return item != "*"; });
                winningBoardSum += eval(numbers.join("+"));
            }
            
            // Save off the last number called, and leave our numbers loop
            lastNumberCalled = aNumber;
            break;
        }

    }

    // For the winning board, get the sum of all non-marked numbers on that board and multiple by the board number.
    return winningBoardSum * lastNumberCalled;
}


/**
 * Look for 5 * in a row, horizontal or vertical.  If found, return true.
 * 
 * @param {*} aBoard Bingo board matrix
 */
function checkBoardForWin(aBoard) {

    let isWinner = false;
    let cols = [[], [], [], [], []];

    for ( let i = 0; i < aBoard.length; i++ ) {
        let aRow = aBoard[i];
        if ( checkCellsForWin(aRow.join("")) ) {
            isWinner = true;
            break;
        }

        // Transform cells into virtual rows
        cols[0].push( aRow[0] );
        cols[1].push( aRow[1] );
        cols[2].push( aRow[2] );
        cols[3].push( aRow[3] );
        cols[4].push( aRow[4] );
    }

    for ( let i = 0; i < cols.length; i++ ) {
        if ( checkCellsForWin(cols[i].join("")) ) {
            isWinner = true;
            break;
        }
    }

    return isWinner;
}


/**
 * Look for 5 * in a row
 * 
 * @param {*} someCells 
 * @returns 
 */
function checkCellsForWin(someCells) {
    return ( someCells === "*****" );
}


/**
 * You aren't sure how many bingo boards a giant squid could play at once, so rather than waste time counting its arms, 
 *  the safe thing to do is to figure out which board will win last and choose that one. That way, no matter which boards 
 *  it picks, it will win for sure.
 * 
 * Figure out which board will win last. Once it wins, what would its final score be?
 * 
 * @param {*} someNums 
 * @param {*} someBoards 
 */
function findWorstBingoBaord(someNums, someBoards) {
    let affectedBoards = [];
    let winningBoards = [];
    let worstBoardSum = 0;
    let lastNumberCalled = null;

    // For each Bingo Number Drawn (as a for loop, to easily kick out)
    for ( var numberIdx = 0; numberIdx < someNums.length; numberIdx++ ) {
        let aNumber = someNums[numberIdx];

        // For each Bingo Board
        affectedBoards = updateBoardsForNumber(someBoards, aNumber, affectedBoards);

        // For each affected board, see if we have a winner.  Small optimization, we can't have a winner until we have five numbers drawn.
        if ( numberIdx >= 4 ) {
              
            // Get a unique set of board numbers to process since one number could be on a board more than once
            let boards = affectedBoards.filter((v, i, a) => a.indexOf(v) === i);

            // Check each board affected by the last number drawn to see if it won
            for ( var i = 0; i < boards.length; i++ ) {
                let aBoardIdx = boards[i];
                if ( checkBoardForWin(someBoards[aBoardIdx]) ) {
                    // Doin't add the some board twice to winning boards
                    if ( _.indexOf(winningBoards, aBoardIdx) === -1 ) {
                        //boardToLog(aBoardIdx, someBoards[aBoardIdx], aNumber);
                        winningBoards.push(aBoardIdx);
                        if ( winningBoards.length === 100 ) break;    
                    }
                }
            }

            // We processed them, so clear affected boards to continue looking for a winner
            affectedBoards = [];
        }

        // See if we have found the very worst board!
        if ( winningBoards.length === 100 ) {
            let worstBoardIdx = winningBoards.pop();

            // Get the board, and sum up the numbers not yet removed
            let board = someBoards[worstBoardIdx];
            //boardToLog(worstBoardIdx, someBoards[worstBoardIdx], aNumber);
            for ( var i = 0; i < board.length; i++ ) {
                let numbers = _.filter(board[i], function(item) { return item != "*"; });
                worstBoardSum += eval(numbers.join("+"));
            }
            
            // Save off the last number called, and leave our numbers loop
            lastNumberCalled = aNumber;
            break;
        }
    }  

    // Return our solution
    return lastNumberCalled * worstBoardSum;
}

/**
 * Update each board with * for a played number, and return which boards were touched
 * 
 * @param {*} someBoards 
 * @param {*} aNumber 
 * @param {*} affectedBoards 
 * @returns 
 */
function updateBoardsForNumber(someBoards, aNumber, affectedBoards) {

    // For each Bingo Board
    _.each(someBoards, function(aBoard, boardIdx, list) {
        // For each row of five, see if we have the number.  If so, mark it.
        _.each(aBoard, function(aRow, rowIdx, list) {
            _.each(aRow, function(aCell, cellIdx, list) {
                // Hit, clear the cell, and save off the affected board
                if ( aCell === aNumber ) {
                    aRow[cellIdx] = "*";
                    affectedBoards.push(boardIdx);
                }
            });
        });            
    });    
    return affectedBoards;
}


/**
 * 
 * 
 * @param {*} aBoardIdx 
 * @param {*} aBoard 
 * @param {*} lastNumber 
 */
function boardToLog(aBoardIdx, aBoard, lastNumber) {
    console.log("Board:", aBoardIdx, ", with last number drawn of", lastNumber);
    console.log(" ", aBoard[0]);
    console.log(" ", aBoard[1]);
    console.log(" ", aBoard[2]);
    console.log(" ", aBoard[3]);
    console.log(" ", aBoard[4]);
}


/**
 * To avoid the most dangerous areas, you need to determine the number of points where at least two lines overlap. 
 *   In the above example, this is anywhere in the diagram with a 2 or larger - a total of 5 points.
 * Consider only horizontal and vertical lines. At how many points do at least two lines overlap?
 * 
 * 
 * @param {*} someHeatVents 
 */
function findOverlappingVents(someHeatVents, removeDiagonals) {
    let someVents = someHeatVents;

    // Reduce our list to only vertical and horizontal vent vectors
    //  "For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2."
    if ( removeDiagonals ) {
        someVents = _.filter(someHeatVents, function(aVector) {
            let p1 = aVector[0];
            let p2 = aVector[1];
            return ( (p1[0] === p2[0]) || (p1[1] === p2[1]) );
        });    
    }

    // Build the world
    let world = new Array(999);
    for (let i = 0;  i < world.length; i++) {
        world[i] = new Array(999).fill(0);
    }

    // For each vector, increment cells touched
    _.each(someVents, function(aVent, index, list) {
        let p1 = aVent[0];
        let p2 = aVent[1];

        let fromX = p1[0];
        let toX = p2[0];
        let fromY = p1[1];
        let toY = p2[1];
        
        // Touch each cell on the path
        let xIdx = fromX;
        let yIdx = fromY;
        world[xIdx][yIdx]++;
        while ((xIdx !== toX) || (yIdx !== toY)) {
            if ( fromX !== toX ) (fromX <= toX) ? xIdx++ : xIdx--;
            if ( fromY !== toY ) (fromY <= toY) ? yIdx++ : yIdx--;
            world[xIdx][yIdx]++;
        }
    });

    // Find the number of values 2 or greater in world
    let totalCells = 0;
    for ( var i = 0; i <= 999; i++ ) {
        let someCells = _.filter(world[i], function(cell) { return cell > 1; });
        totalCells += someCells.length;
    }

    return totalCells;
}