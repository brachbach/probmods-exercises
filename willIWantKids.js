// To run, paste into http://webppl.org/

// Scope: the main point of this is to help me decide how much money to hoard.
// So assume that the current economy will continue over the entire time period
// (no GCRs, no extremely transformative AI).

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
  var weightedScore = factors.reduce(function(scoreSoFar, factor) {
    return scoreSoFar + factor.p * factor.weight;
  }, 0);

  var totalWeights = factors.reduce(function(weightsSoFar, factor) {
    return weightsSoFar + factor.weight;
  }, 0);

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
