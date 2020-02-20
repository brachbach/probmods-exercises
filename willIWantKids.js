// Scope: the main point of this is to help me decide how much money to hoard.
// So assume that the current economy will continue over the entire time period
// (no GCRs, no extremely transformative AI).

var model = function() {
  // pathways to wanting kids

  // I eventually decide that I really really want them,
  // and try to find a partner to make that happen with
  var IWantKids = flip(0.3);

  // I could go either way on kids but my partner wants them, so we have them
  var partnerWantsKids = flip(0.3);

  return IWantKids || partnerWantsKids;
};

viz(Infer({ method: "enumerate" }, model));
