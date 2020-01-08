// 1. a.

var model = function() {
  return flip() ? 'H' : 'T'
}
var log_prob = Infer({method:'enumerate'}, model).score('H')
Math.exp(log_prob)

// b.

var model = function () {
    var coin = flip() ? function () { flip(0.9) } : function () { flip() }
    condition(coin() && coin())
    return coin()
}
viz(Infer({ method: 'enumerate' }, model))

// c.
var fairCoin = function () { flip() }
var biasedCoin = function () { flip(0.9) }

var model = function () {
    var chosenCoin = flip() ? biasedCoin : fairCoin
    condition(chosenCoin() && chosenCoin() && chosenCoin())
    return chosenCoin === biasedCoin;
}

var log_prob = Infer({ method: 'enumerate' }, model).score(true)
Math.exp(log_prob)


// d.
var fairCoin = function () { flip() }
var biasedCoin = function () { flip(0.9) }

var model = function () {
    var chosenCoin = flip() ? biasedCoin : fairCoin
    condition(chosenCoin() !== chosenCoin())
    return chosenCoin()
}

var log_prob = Infer({ method: 'enumerate' }, model).score(true)
Math.exp(log_prob)

// 2.a.
// yes b/c independent

var model = function () {
  var lungCancer = flip(1);
  var cold = flip(0.2);

  var cough = (
    (cold && flip(0.5)) ||
    (lungCancer && flip(0.3))
  )

  return cough
}

var log_prob = Infer({ method: 'enumerate' }, model).score(true)
Math.exp(log_prob)


// vs.

var model = function () {
  var lungCancer = flip(0.01);
  var cold = flip(0.2);

  var cough = (
    (cold && flip(0.5)) ||
    (lungCancer && flip(0.3))
  )

  condition(lungCancer)

  return cough
}

var log_prob = Infer({ method: 'enumerate' }, model).score(true)
Math.exp(log_prob)



// 2.b.
// something like this:

var origModel = function () {
  var parent = flip();
  var child = parent;
  return parent;
}

var origLogProb = Infer({ method: 'enumerate' }, origModel).score(true)
console.log(Math.exp(origLogProb))

var conditionModel = function () {
  var parent = flip();
  var child = parent;
  condition(child)
  return parent;
}

var conditionLogProb = Infer({ method: 'enumerate' }, conditionModel).score(true)
console.log(Math.exp(conditionLogProb))

var interventionModel = function () {
  var parent = flip();
  var child = true;
  condition(child)
  return parent;
}

var intervetionLogProb = Infer({ method: 'enumerate' }, interventionModel).score(true)
console.log(Math.exp(intervetionLogProb))



// though this seems a bit lame

// 3.a.
c = condition(a || b)
p(a) | c = p(c | a)p(a)/p(c) = 1 * 0.5 / 0.75 = 2/3

// b.
a = nice('alice')
c = condition(smiles('alice') && smiles('alice')); // bob is irrelevant here
p(c | a) = 0.8 * 0.8
p(c | ~a) = 0.5 * 0.5
p(a) = 0.7
p(~a) = 0.3

p(a | c) = (p(c | a) * p(a)) / p(c)
= (p(c | a) * p(a)) / ((p(a) * p(c | a)) + (p(~a) * p(c | ~a)))
= ((0.8 * 0.8) * 0.7) / ((0.7 * (0.8 * 0.8)) + (0.3 * (0.5 * 0.5)))

// 4.

// a.
// Any given person is either nice or mean (this is a permanent personality trait).
// 7/10 people are nice.
// Nice people smile 8/10 times when you see them; mean people smile 5/10 times.
// Now, assume that Alice smiled on 2 occassions when we saw her.
// What's the probability that Alice is nice?

// b.
var extendedSmilesModel = function () {
    var nice = mem(function (person) { return flip(.7) });
    var wantSomething = function (person) { return nice(person) ? flip(0.3) : flip(0.7) };
    var smiles = function (person) {
      var becauseNice = nice(person) && flip(.8);
      var becauseWantsSomething = wantSomething(person) && flip(.7);
      var forNoReason = flip(0.5);
      return becauseNice || becauseWantsSomething || forNoReason;
    }

    return smiles('alice')
}

Infer({ method: "enumerate" }, extendedSmilesModel)

// c

var extendedSmilesModel = function () {
    var nice = mem(function (person) { return flip(.7) });
    var wantSomething = mem(function (person, day) { return nice(person) ? flip(0.3) : flip(0.7) });
    var smiles = function (person, day) {
        var becauseNice = nice(person) && flip(.8);
        var becauseWantsSomething = wantSomething(person, day) && flip(.7);
        var forNoReason = flip(0.8);
        return becauseNice || becauseWantsSomething || forNoReason;
    }

    condition(!smiles('Bob', 1) && !smiles('Bob', 2) && !smiles('Bob', 3) && !smiles('Bob', 4) && !smiles('Bob', 5) && smiles('Bob', 6))
    return wantSomething('Bob', 6);
}

var log_prob = Infer({ method: 'enumerate' }, extendedSmilesModel).score(true)
Math.exp(log_prob)

// I had thought that the more likely someone is to smile because they're nice,
// the less likely Bob would be to want something,
// since smiling because nice would explain away his smiling.
// But actually, the opposite is true:
// if nice people are likely to smile,
// then Bob not smiling on the previous days is evidence that he's not nice
// and so it's more likely that he's smiling on the last day because he wants something.

// Relatedly, setting p(smiles | nice) = 1
// has the same effect as conditioning on Bob being nice

// For some reason, incresing p(smiles | wants something) a bit
// increases p(wants something on the 6th day), but increasing it a lot has the opposite effect
// I'm not sure why

// 5 a

var sprinklerModel = function () {
    var sprinklerWorked = flip(0.5);
    var rained = flip(0.3);
    condition(sprinklerWorked || rained);
    return {sprinklerWorked: sprinklerWorked, rained: rained};
}

Infer({ method: "enumerate" }, sprinklerModel)


// b

var sprinklerModel = function () {
    var mySprinklerWorked = flip();
    var KSprinklerWorked = flip();
    var rained = flip(0.3);
    condition((mySprinklerWorked || rained) && (KSprinklerWorked || rained));
    return mySprinklerWorked;
}

Infer({ method: "enumerate" }, sprinklerModel)

// 6 a
https://docs.google.com/spreadsheets/d/1uZ5beN4Cf6Tzzt-whHksf8Z9jbKrk5W4t-0TclT8dpA/edit#gid=0

d
// define some variables and utility functions
var checkVowel = function (letter) { return _.includes(['a', 'e', 'i', 'o', 'u'], letter); }
var letterVals = ['g', 'a', 'm', 'e'];
var letterProbs = map(function (letter) { return checkVowel(letter) ? 0.45 : 0.05; }, letterVals);
var letters = Categorical({ vs: letterVals, ps: letterProbs })

// Compute p(h | win)
var distribution = Infer({ method: 'enumerate' }, function () {
    var letter = sample(letters);
    var position = letterVals.indexOf(letter) + 1;
    var winProb = 1 / Math.pow(position, 2);
    condition(flip(winProb));
    return letter
});
viz.auto(distribution);


// define some variables and utility functions
var checkVowel = function (letter) { return _.includes(['a', 'e', 'i', 'o', 'u'], letter); }
var letterVals = ['g', 'a', 'm', 'e'];
var letterProbs = map(function (letter) { return checkVowel(letter) ? 0.45 : 0.05; }, letterVals);
var letters = Categorical({ vs: letterVals, ps: letterProbs })

// Compute p(h | win)
var distribution = Infer({ method: 'enumerate' }, function () {
    var letter = sample(letters);
    var position = letterVals.indexOf(letter) + 1;
    var winProb = 1 / Math.pow(position, 2);
    condition(flip(winProb));
    return checkVowel(letter);
});
viz.auto(distribution);