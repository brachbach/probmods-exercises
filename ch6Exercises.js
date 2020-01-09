// 1.a.

// observed data
var k = 1; // number of successes
var n = 20; // number of attempts
// basically 1/a == how much of the density to put near 0;
// 1/b is how much to put near 1
var priorDist = Beta({ a: 10, b: 10 });

var model = function() {
  var p = sample(priorDist);

  // Observed k number of successes, assuming a binomial
  observe(Binomial({ p: p, n: n }), k);

  // sample from binomial with updated p
  var posteriorPredictive = binomial(p, n);

  // sample fresh p (for visualization)
  var prior_p = sample(priorDist);
  // sample from binomial with fresh p (for visualization)
  var priorPredictive = binomial(prior_p, n);

  return {
    prior: prior_p,
    priorPredictive: priorPredictive,
    posterior: p,
    posteriorPredictive: posteriorPredictive
  };
};

var opts = { method: "MCMC", samples: 2500, lag: 50 };
var posterior = Infer(opts, model);

viz.marginals(posterior);

// concentrating the probability in the prior causes there to be less of an update
// for reasons I don't understand, there's much more of a shift from prior mean to posterior mean
// for a = 0.1, b = 0.1 than a = 1, b = 1

// .b

// observed data
var k = 1; // number of successes
var n = 20; // number of attempts
var priorDist = Beta({ a: 10, b: 10 });

var n_predictive = 100;

var model = function() {
  var p = sample(priorDist);

  // Observed k number of successes, assuming a binomial
  observe(Binomial({ p: p, n: n }), k);

  // sample from binomial with updated p
  var posteriorPredictive = binomial(p, n_predictive);

  // sample fresh p (for visualization)
  var prior_p = sample(priorDist);
  // sample from binomial with fresh p (for visualization)
  var priorPredictive = binomial(prior_p, n);

  return {
    prior: prior_p,
    priorPredictive: priorPredictive,
    posterior: p,
    posteriorPredictive: posteriorPredictive
  };
};

var opts = { method: "MCMC", samples: 2500, lag: 50 };
var posterior = Infer(opts, model);

viz.marginals(posterior);

// 2. a.
// question: how do we specify the strength of our prior here? that seems really important, right?

// I mean, it really depends, right? Depends on how hard it is to chnge the paradigm vs. collect more data.
// seems like prob the best option is to run a few more subjects through to get more of an update

// b.

// wait -- woudln't taking the most likely value be a really weird choice? Why wouldn't you take the expectation?
// I guess that's my "task evaluation" answer. Relatedly -- what we really care about is the probability that
// we're in a world where the task is easy enough
// (and then we do some multiplication * relative costs to decide what to do)

// re: model/theory evaluation -- sometimes, you might have a theory about the *exact* expected value
// but often your theory is more nebulous, is about the expected range of values
// in that latter case, you should care about more than just the mode

// 3. a.

// 4. a.
// seems weird that we only condition on the machine going off, not the machine failing to go off

var blicketBaseRate = 0.4; // the chance that a block is a blicket
var blicketPower = 0.9; // the chance that a blicket will cause the machine to go off
var nonBlicketPower = 0.05; // the chance that a non-clicket will cause the machine to go off
var machineSpontaneouslyGoesOff = 0.05; // the chance that the machine will go off on its own
