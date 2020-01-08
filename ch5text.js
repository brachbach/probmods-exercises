Things I don't quite get:
- what exactly is a Beta distribution?
- what is dirichlet
- what's the deal w/ the hidden Markov model?
- 

Jan 2020:
- what's the deal with observe, exactly? (I think I mostly get it)
- in the cylinder example, what exactly is the difference between changing the prior on illumination, and observing low illumination?
-- they seem to give pretty similar results:

var observedLuminance = 3;

var reflectancePosterior = Infer({method: 'MCMC', samples: 10000}, function() {
  var reflectance = gaussian({mu: 1, sigma: 1})
//   var illumination = gaussian({mu: 3, sigma: 1})
  var illumination = gaussian({mu: 0.5, sigma: 0.1})
  var luminance = reflectance * illumination
  observe(Gaussian({mu: luminance, sigma: 1}), observedLuminance)
//   observe(Gaussian({mu: illumination, sigma: 0.1}), 0.5)
  return reflectance
});

print(expectation(reflectancePosterior))
viz(reflectancePosterior)