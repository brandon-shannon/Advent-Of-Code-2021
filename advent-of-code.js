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
console.info("Day #5a: Avoiding overlapping heat vent locations, without diagonals, of which there are", findOverlappingVents(inputData.someHeatVents, true));
console.info("    #5b: Avoiding overlapping heat vent locations, of which there are", findOverlappingVents(inputData.someHeatVents, false));

// Day 6a: Laternfish growth rates
console.info("Day #6a: After 80 days we'll have this many laternfish:", trackFishGrowth(inputData.someFish, 80));
console.info("    #6b: After 256 days we'll have this many laternfish:", trackFishGrowth2(inputData.someFish, 256));

// Day 7a: Horizontally align crab positions w/ the least possible work
let result = alignCrabs(inputData.someCrabPositions);
console.info("Day #7a: Crabs should align to position", result[0], "at a cost of", result[1]);

// Day 7b: Horizontally align crab positions w/ the least possible work
result = alignCrabs2(inputData.someCrabPositions);
console.info("    #7b: Crabs should align to position", result[0], "at a cost of", result[1]);

// Day 8a & b: What the ?
console.info("Day #8a: No of outputs using 1, 4, 7, 8:", decipherSignals(inputData.sevenSignals));
console.info("    #8b: Decode all output values, the sum of which is:", decipherSignals2(inputData.sevenSignals));

// Day 9
console.info("Day #9a: Low point analysis finds a total value of:", findLowPoints(inputData.someHeights));
console.info("    #9b: The product of the sizes of the three largest basins is:", findBasins(inputData.someHeights));

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


/**
 * So, suppose you have a lanternfish with an internal timer value of 3:
 *   After one day, its internal timer would become 2.
 *   After another day, its internal timer would become 1.
 *   After another day, its internal timer would become 0.
 *   After another day, its internal timer would reset to 6, and it would create a new lanternfish with an internal timer of 8.
 *   After another day, the first lanternfish would have an internal timer of 5, and the second lanternfish would have an internal timer of 7.
 * 
 * A lanternfish that creates a new fish resets its timer to 6, not 7 (because 0 is included as a valid timer value). 
 * The new lanternfish starts with an internal timer of 8 and does not start counting down until the next day. Each day, a 0 becomes a 6 
 * and adds a new 8 to the end of the list, while each other number decreases by 1 if it was present at the start of the day.
 * 
 * Find a way to simulate lanternfish. How many lanternfish would there be after 80 days?
 * 
 * @param {*} someFish  Array of fish ages
 * @param {*} days      Days to model
 */
function trackFishGrowth(someFish, days) {
    let newFish = [];

    // For <days> days...
    for ( var day = 1; day <= days; day++ ) {
        // For each fish alive today...
        let babies = 0;
        newFish = _.map(someFish, function(age) {
            let newAge = age - 1;
            if ( newAge === -1 ) {
                newAge = 6;
                babies++;
            }
            return newAge;
        });
        _.times(babies, function(n){ newFish.push(8); });

        someFish = newFish;
    }

    return someFish.length;
}


/**
 * So, suppose you have a lanternfish with an internal timer value of 3:
 *   After one day, its internal timer would become 2.
 *   After another day, its internal timer would become 1.
 *   After another day, its internal timer would become 0.
 *   After another day, its internal timer would reset to 6, and it would create a new lanternfish with an internal timer of 8.
 *   After another day, the first lanternfish would have an internal timer of 5, and the second lanternfish would have an internal timer of 7.
 * 
 * A lanternfish that creates a new fish resets its timer to 6, not 7 (because 0 is included as a valid timer value). 
 * The new lanternfish starts with an internal timer of 8 and does not start counting down until the next day. Each day, a 0 becomes a 6 
 * and adds a new 8 to the end of the list, while each other number decreases by 1 if it was present at the start of the day.
 * 
 * Find a way to simulate lanternfish. How many lanternfish would there be after 80 days?
 * 
 * With a large number of days (like, over 140), our array gets into the millions of elements and the original method
 *  does not finish.  Trying a better way to handle big data.
 * 
 * @param {*} someFish  Array of fish ages
 * @param {*} days      Days to model
 */
 function trackFishGrowth2(someFish, days) {

    // Sort our initial fish ages, and make a dictionary of ages and counts
    let sortedFish = _.sortBy(someFish, function(age) { return age; });
    let newFish = _.countBy(sortedFish, function(age) { return age; });

    // Now newFish["1"]=88, ["2"]=45, etc.
    // For <days> days...
    for ( var day = 1; day <= days; day++ ) {
        // For each fish age group...
        let zeros = newFish["1"] || 0;
        let ones = newFish["2"] || 0;
        let twos = newFish["3"] || 0;
        let threes = newFish["4"] || 0;
        let fours = newFish["5"] || 0;
        let fives = newFish["6"] || 0;
        let sixes = (newFish["7"] + newFish["0"]) || 0;
        let sevens = newFish["8"] || 0;
        let eights = newFish["0"] || 0;

        newFish["0"] = zeros;
        newFish["1"] = ones;
        newFish["2"] = twos;
        newFish["3"] = threes;
        newFish["4"] = fours;
        newFish["5"] = fives;
        newFish["6"] = sixes;
        newFish["7"] = sevens;
        newFish["8"] = eights;
    }

    return _.reduce(newFish, function(sum, num) { return sum + num }, 0);
}


/**
 * Determine the horizontal position that the 1,000 crabs can align to using the least fuel possible. 
 * How much fuel must they spend to align to that position?
 * 
 * Note on initial positions: Min = 0, Max = 1994
 * 
 * @param {*} someCrabPos Numeric array of crab horizonal positions
 */
function alignCrabs(someCrabPos) {
    let goalPos = median(someCrabPos);
    let totalFuel = _.reduce(someCrabPos, function(cost, currentPos) { return cost + Math.abs(currentPos - goalPos) }, 0);
    return [goalPos, totalFuel];
}


/**
 * Helper function to find the median in a set of numbers
 * 
 * @param {*} values 
 * @returns 
 */
function median(values) {
    if( values.length ===0 ) throw new Error("No inputs");
  
    values.sort(function(a,b){
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
    
    if (values.length % 2)
      return values[half];
    
    return (values[half - 1] + values[half]) / 2.0;
}


function average(values) {
    if( values.length ===0 ) throw new Error("No inputs");
    return (_.reduce(values, function(total, value) { return total + value }, 0) / values.length);
}

  /**
   * As it turns out, crab submarine engines don't burn fuel at a constant rate. 
   * Instead, each change of 1 step in horizontal position costs 1 more unit of fuel than the last: the first step costs 1, the second step costs 2, the third step costs 3, and so on.
   * How much fuel must they spend to align to that position?
   * 
   * Move from 16 to 5: 66 fuel (11 moves. 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 = 66 == ((Moves + 1) / 2) * Moves )
   * Move from 1 to 5: 10 fuel ( 4 Moves + 1 = 5.  5/2 = 2.5.  2.5*4 = 10)
   * 
   * @param {*} someCrabPos Numeric array of crab horizonal positions
   */
function alignCrabs2(someCrabPos) {
    let goalPos = parseInt(average(someCrabPos));
    let totalFuel = _.reduce(someCrabPos, function(cost, currentPos) { 
        let moves = Math.abs(goalPos - currentPos);
        return cost + (((moves + 1) / 2) * moves);
    }, 0);
    return [goalPos, totalFuel];
}


/**
 * Because the digits 1, 4, 7, and 8 each use a unique number of segments, you should be able to tell 
 *  which combinations of signals correspond to those digits. Counting only digits in the output values 
 * (the part after | on each line), in the above example, there are 26 instances of digits that use a 
 * unique number of segments (highlighted above).
 * 
 * In the output values, how many times do digits 1, 4, 7, or 8 appear?
 * 
 * 1 - 2 segments
 * 4 - 4 segments
 * 7 - 3 segments
 * 8 - 7 segments 
 * 
 * @param {*} someSignals 
 */
function decipherSignals(someSignals) {
    let count = 0;
    _.each(someSignals, function( aSignal, idx, list) {
        let parts = aSignal.split("|");
        let outputs = parts[1].trim().split(" ");
        let sum = _.reduce(outputs, function(cnt, output) {
            let len = output.length;
            return (len === 2 || len === 3 || len === 4 || len === 7) ? cnt + 1 : cnt;
        }, 0);
        count = count + sum;
    });
    return count;
}


/**
 * For each entry, determine all of the wire/segment connections and decode the four-digit output values. 
 * What do you get if you add up all of the output values?
 * 
 * RULES:
 * 2 Segments => 1
 * 3 Segments => 7
 * 4 Segments => 4
 * 5 Segments (2 | 3 | 5)
 *   if 2 semgnets overlap with a 1, it's a 3
 *   if 2 segemnts overlap with a 4, it's a 2
 *   Otherwise, it's a 5
 *   X 3 if 3 common segments with 7
 *   X 5 if 3 common segments with 4
 *   otherwise, 2
 * 6 Segments (0 | 6 | 9)
 *   if 1 segment overlaps with a 1, it's a 6
 *   if 3 segments overlap with a 4, it's a 0
 *   otherwise, 9
 *   X 9 if 4 common segments with 4
 *   X 6 if 3 common segments with 7
 *   otherwise 0
 * 7 Segments => 8
 * 
 *  0:      1:      2:      3:      4:
 *   aaaa    ....    aaaa    aaaa    ....
 *  b    c  .    c  .    c  .    c  b    c
 *  b    c  .    c  .    c  .    c  b    c
 *   ....    ....    dddd    dddd    dddd
 *  e    f  .    f  e    .  .    f  .    f
 *  e    f  .    f  e    .  .    f  .    f
 *   gggg    ....    gggg    gggg    ....
 *
 *   5:      6:      7:      8:      9:
 *   aaaa    aaaa    aaaa    aaaa    aaaa
 *  b    .  b    .  .    c  b    c  b    c
 *  b    .  b    .  .    c  b    c  b    c
 *   dddd    dddd    ....    dddd    dddd
 *  .    f  e    f  .    f  e    f  .    f
 *  .    f  e    f  .    f  e    f  .    f
 *   gggg    gggg    ....    gggg    gggg 
 *
 *  
 * @param {*} someSignals 
 */
 function decipherSignals2(someSignals) {
    
    let total = 0;

    // For each coded message
    _.each(someSignals, function( aSignal, idx, list) {
        // Split the inputs from the outputs
        let parts = aSignal.split("|");
        let someInputs = parts[0].trim().split(" ");
        let someOutputs = parts[1].trim().split(" ");

        // Sort input segments by length
        // Find our knowns (1, 4, 7, 8) to use to decode our unknowns
        someInputs = _.sortBy(someInputs, function(input) { return input.length; });

        // For each segment
        let decoder = {};
        let oneSegs = "", fourSegs = "";
        _.each(someInputs, function(input, idx, list) {
            input = input.split("").sort().join("");
            switch (input.length) {
                case 2: 
                    decoder[input] = 1;
                    oneSegs = input;
                    break;
                case 3: 
                    decoder[input] = 7;
                    break;
                case 4:
                    decoder[input] = 4;
                    fourSegs = input;
                    break;
                case 7:
                    decoder[input] = 8;
                    break;
                case 5:
                    if ( countSameSegs(oneSegs, input) === 2 )
                        decoder[input] = 3;
                    else if ( countSameSegs(fourSegs, input) == 2 )
                        decoder[input] = 2;
                    else
                        decoder[input] = 5;
                    break;
                case 6:
                    if ( countSameSegs(oneSegs, input) === 1 )
                        decoder[input] = 6;
                    else if ( countSameSegs(fourSegs, input) == 3 )
                        decoder[input] = 0;
                    else
                        decoder[input] = 9;
                    break;
            }
        });

        // Translate outputs into four digit numbers, and sum them up
        let aNumber = _.reduce(someOutputs, function(fullNumber, output) {
            let newNumber = decoder[output.split("").sort().join("")];
            return fullNumber + newNumber;
        }, "");
        total = total + parseInt(aNumber);
    });
    return total;
}


/**
 * Finds overlapping segments in two strings (i.e., common characters)
 * 
 * @param {*} knownSegs 
 * @param {*} unknownSegs 
 */
function countSameSegs(knownSegs, unknownSegs) {
    let count = 0 
    for ( let i = 0; i < knownSegs.length; i++ ) {
        if ( unknownSegs.includes(knownSegs.substr(i, 1)) ) count++;
    }
    return count;
}


/**
 * Smoke flows to the lowest point of the area it's in. For example, consider the following heightmap:
 * 
 * 2199943210
 * 3987894921
 * 9856789892
 * 8767896789
 * 9899965678
 * 
 * Each number corresponds to the height of a particular location, where 9 is the highest and 0 is the lowest a location can be.
 * 
 * Your first goal is to find the low points - the locations that are lower than any of its adjacent locations. Most locations have 
 *  four adjacent locations (up, down, left, and right); locations on the edge or corner of the map have three or two adjacent 
 *  locations, respectively. (Diagonal locations do not count as adjacent.)
 * 
 * In the above example, there are four low points, all highlighted: two are in the first row (a 1 and a 0), one is in the third 
 *  row (a 5), and one is in the bottom row (also a 5). All other locations on the heightmap have some lower adjacent location, 
 *  and so are not low points.
 * 
 * The risk level of a low point is 1 plus its height. In the above example, the risk levels of the low points are 2, 1, 6, and 6. 
 *  The sum of the risk levels of all low points in the heightmap is therefore 15.
 * 
 * Find all of the low points on your heightmap. What is the sum of the risk levels of all low points on your heightmap?
 * 
 * @param {*} someHeights 
 */
function findLowPoints( someHeights ) {

    // Find all numbers where every adjacent number is higher.  Add 1 to each, and sum them up for the solution.
    let solution = 0;
    let height = someHeights.length;
    let width = someHeights[0].length;
    let lowPoints = [];

    // Make it into a 2D array
    someHeights = _.each(someHeights, function(height, idx, list) {
        height = height.split("");
    });

    // For every row
    for ( let currRow = 0; currRow <= height; currRow++ ) {
        // For every column
        for ( let currCol = 0; currCol <= width; currCol++ ) {
            // Determine if it is lower than adjacent points.
            let point = isLowPoint(currRow, currCol, someHeights);
            if ( point !== Constants.NOT_A_LOW_POINT ) {
                lowPoints.push( point );
            }
        }
    }

    // Sum up all low point heights + 1 each, and eturn
    return _.reduce(lowPoints, function(sum, point) {
        return sum + (point + 1);
    }, 0);
}


/**
 * Determine if a point is lower than its adjacent points in a 2D array
 * 
 * @param {*} row 
 * @param {*} col 
 * @param {*} map 
 * @returns 
 */
function isLowPoint(row, col, map) {

    let point = null;
    let adjacents = [];

    // NOTE: Upper left of the m ap is 0, 0
    point = getHeight(row, col, map);
    adjacents[0] = getHeight(row-1, col, map);
    adjacents[1] = getHeight(row+1, col, map);
    adjacents[2] = getHeight(row, col-1, map);
    adjacents[3] = getHeight(row, col+1, map);

    if ((point < adjacents[0]) && (point < adjacents[1]) && (point < adjacents[2]) && (point < adjacents[3])) {
        return point;
    } else {
        return Constants.NOT_A_LOW_POINT;
    }
}


/**
 * Yank a point out of our 2D "map" of low points, with handling for misses on the arrays.
 * 
 * @param {*} row 
 * @param {*} col 
 * @param {*} map 
 * @returns 
 */
function getHeight(row, col, map) {
    let height = 9;
    try {
        height = map[row][col];
        if ( height === undefined ) height = 9;
    }
    catch {
        // Nothing, don't care
        height = 9;
    }
    return parseInt(height);
}


/**
 * A basin is all locations that eventually flow downward to a single low point. Therefore, every low point has a basin, 
 *  although some basins are very small. Locations of height 9 do not count as being in any basin, and all other locations 
 *  will always be part of exactly one basin.
 *  
 * The size of a basin is the number of locations within the basin, including the low point. The example above has four basins.
 * What do you get if you multiply together the sizes of the three largest basins?
 * 
 * @param {*} someHeights 
 */
function findBasins( someHeights ) {
    let solution = 0;
    let height = someHeights.length;
    let width = someHeights[0].length;
    let someBasinSizes = [];

    // Make it into a 2D array
    someHeights = _.each(someHeights, function(height, idx, list) {
        height = height.split("");
    });

    // For every row
    for ( let currRow = 0; currRow <= height; currRow++ ) {
        // For every column
        for ( let currCol = 0; currCol <= width; currCol++ ) {
            // Determine if it is lower than adjacent points.
            let point = isLowPoint(currRow, currCol, someHeights);
            if ( point !== Constants.NOT_A_LOW_POINT ) {
                // OK, find the basin surrounding the low point.  
                // We need it's "size"...the number of locations.
                // +1 because the low point counts too.
                let basinSize = findAdjacentHigher([[currRow, currCol]], [[currRow, currCol]], someHeights);
                someBasinSizes.push(basinSize);
            }
        }
    }   
    someBasinSizes = _.sortBy(someBasinSizes, function(num){ return num; });
    return someBasinSizes.pop() * someBasinSizes.pop() * someBasinSizes.pop();
}


/**
 * Recursive function to find all adjacent higher locations that are NOT 9s
 * 
 * @param {*} allBasinPoints All points in our basin
 * @param {*} pointsToCheck  Points that we need to examine further
 * @param {*} map            Map of cave depths
 */
function findAdjacentHigher(allBasinPoints, pointsToCheck, map) {

    // 2199943210
    // 3987894921
    // 9856789892
    // 8767896789
    // 9899965678
    let aPoint = pointsToCheck.pop();
    let row = aPoint[0];
    let col = aPoint[1];
    let adjacents = [];
    let point = getHeight(row, col, map);
    adjacents[0] = getHeight(row-1, col, map);
    adjacents[1] = getHeight(row+1, col, map);
    adjacents[2] = getHeight(row, col-1, map);
    adjacents[3] = getHeight(row, col+1, map);

    if ( (adjacents[0] > point) && (adjacents[0] !== 9) ) {
        newBasinPoint(allBasinPoints, pointsToCheck, [row-1, col]);
    }   
    if ( (adjacents[1] > point) && (adjacents[1] !== 9) ) {
        newBasinPoint(allBasinPoints, pointsToCheck, [row+1, col]);
    }   
    if ( (adjacents[2] > point) && (adjacents[2] !== 9) ) {
        newBasinPoint(allBasinPoints, pointsToCheck, [row, col-1]);
    }   
    if ( (adjacents[3] > point) && (adjacents[3] !== 9) ) {
        newBasinPoint(allBasinPoints, pointsToCheck, [row, col+1]);
    }   

    if ( pointsToCheck.length > 0 ) {
        findAdjacentHigher(allBasinPoints, pointsToCheck, map);
    }

    return allBasinPoints.length;
}


/**
 * Add a new point to our (a) all basin points array, and (b) array of points to check out if it isn't already in there.
 * 
 * @param {*} allBasinPoints All points in our basin
 * @param {*} pointsToCheck  Points that we need to examine further
 * @param {*} newPoint       The new point to add
 * @returns                  undefined
 */
function newBasinPoint(allBasinPoints, pointsToCheck, newPoint) {

    // Don't go and check it if we already have checked it
    for( let i = 0; i < allBasinPoints.length; i++ ) {
        let aPoint = allBasinPoints[i];
        if ((newPoint[0] === aPoint[0]) && (newPoint[1] === aPoint[1])) return;
    }

    pointsToCheck.push(newPoint);
    allBasinPoints.push(newPoint);
}