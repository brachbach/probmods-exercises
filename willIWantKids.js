// To run, paste into http://webppl.org/

// Scope: the main point of this is to help me decide how much money to hoard.
// So assume that the current economy will continue over the entire time period
// (no GCRs, no extremely transformative AI).

// state-machine based approach

var addNextNumber = function(numbersSoFar, length) {
  if (numbersSoFar.length === length) {
    return numbersSoFar;
  }
  return addNextNumber(numbersSoFar.concat([numbersSoFar.length]), length);
};

var getNWholeNumbers = function(n) {
  return addNextNumber([], n);
};

var states = {
  openToIt: {
    description:
      "open to having kids if a partner who I was ~married to wanted to have them",
    transitions: [
      {
        toState: states.lookForPartner,
        // hmmm, is this (or at least how I'm plannign to use it) doing manually what WebPPL is supposed to do automatically?
        ps: [
          {
            p: 0.1,
            startYear: 0,
            endYear: 1
          },
          {
            p: 0.3,
            startYear: 0,
            endYear: 5
          }
        ]
      },
      {
        toState: states.doNotWant,
        ps: [
          {
            p: 0.05,
            startYear: 0,
            endYear: 1
          },
          {
            p: 0.2,
            startYear: 0,
            endYear: 5
          }
        ]
      }
    ]
  },
  lookForPartner: {
    description:
      "want to have kids, actively looking for a partner to have kids with",
    transitions: [
      {
        toState: states.openToIt,
        ps: [
          {
            p: 0.3,
            startYear: 0,
            endYear: 20
          },
          {
            p: 0.9,
            startYear: 20,
            endYear: 50
          }
        ]
      },
      {
        // maybe sort of weird to incorporate everything in one state machine
        // rather than having separate state machines for desire to have kids, relationship progress, etc.
        toState: states.inKidsRelationship,
        ps: map(getNWholeNumbers(50), function(startYear) {
          return {
            p: 0.7,
            startYear: startYear,
            endYear: startYear + 1
          };
        })
      },
      {
        toState: states.openToIt,
        // actually should prob increase as time goes on
        ps: map(getNWholeNumbers(50), function(startYear) {
          return {
            p: 0.7,
            startYear: startYear,
            endYear: startYear + 1
          };
        })
      }
    ]
  }
};

var censusFactor = function(weight) {
  return {
    name: "Census analysis",
    p: 0.66,
    source:
      "https://docs.google.com/document/d/1QoSseXDlYSGl4bUvMzl2XIdo5NI9yhBqkHF5pd_Dqt8/edit#bookmark=id.thw9so6qoid1",
    weight: weight
  };
};

var IWantKidsFactors = [
  {
    name: "my a priori guess",
    p: 0.3,
    weight: 1
  },

  // downweighted because this is the rate for having kids, not wanting to have kids
  censusFactor(0.5)
];

var partnerWantsKidsFactors = [
  {
    name: "my a priori guess",
    p: 0.3,
    weight: 1
  },

  // downweighted because this is the rate for having kids, not wanting to have kids
  censusFactor(0.5)
];

var pFromFactors = function(factors) {
  var weightedScore = reduce(
    function(factor, scoreSoFar) {
      return scoreSoFar + factor.p * factor.weight;
    },
    0,
    factors
  );

  var totalWeights = reduce(
    function(factor, weightsSoFar) {
      return weightsSoFar + factor.weight;
    },
    0,
    factors
  );

  return weightedScore / totalWeights;
};

var model = function() {
  // pathways to wanting kids

  // I eventually decide that I really really want them,
  // and try to find a partner to make that happen with
  var IWantKids = flip(pFromFactors(IWantKidsFactors));

  // I could go either way on kids but my partner wants them, so we have them
  var partnerWantsKids = flip(pFromFactors(partnerWantsKidsFactors));

  return IWantKids || partnerWantsKids;
};

viz(Infer({ method: "enumerate" }, model));
