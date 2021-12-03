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