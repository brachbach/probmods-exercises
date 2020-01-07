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
    return chosenCoin
}
var log_prob = Infer({ method: 'enumerate' }, model).score(fairCoin)
Math.exp(log_prob)


// d.

var model = function () {
    var fairCoin = function () { flip() }
    var biasedCoin = function () { flip(0.9) }
    var chosenCoin = flip() ? biasedCoin : fairCoin
    condition(chosenCoin() + chosenCoin() === 1)
    return chosenCoin()
}
viz(Infer({ method: 'enumerate' }, model))

// 2.a.
// yes b/c independent

// 2.b.
// something like this:

var parent = flip()
var child = parent
var child2 = parent || flip()

// thought this seems a bit lame

// 3.a.
c = condition(a || b)
p(a) | c = p(c | a)p(a)/p(c) = 1 * 0.5 / 0.75 = 2/3

b.
a = nice('alice')
c = condition(smiles('alice') && smiles('bob') && smiles('alice'));
p(a) | c = p(c | a)p(a) / p(c) = ((0.8 * (0.7 * 0.8 + 0.3 * 0.5) * 0.8) * 0.7) / (0.8 * (0.7 * 0.8 + 0.3 * 0.5) * 0.8) = 0.7
// this is the wrong answer

//b.

var extendedSmilesModel = function () {
    var nice = mem(function (person) { return flip(.7) });
    var wantSomething = mem(function (person) { return nice(person) ? flip(0.3) : flip(0.7) });
    var smiles = function (person) {
        var becauseNice = nice(person) && flip(.8);
        var becauseWantsSomething = wantSomething(person) && flip(.7);
        var forNoReason = flip(0.5);
        return becauseNice || becauseWantsSomething || forNoReason;
    }

    return smiles('alice')
}

Infer({ method: "enumerate" }, extendedSmilesModel)

c

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


Infer({ method: "enumerate" }, extendedSmilesModel)


5 a

var sprinklerModel = function () {
    var sprinklerWorked = flip();
    var rained = flip(0.3);
    condition(sprinklerWorked || rained);
    return [sprinklerWorked, rained];
}

Infer({ method: "enumerate" }, sprinklerModel)

b

var sprinklerModel = function () {
    var mySprinklerWorked = flip();
    var KSprinklerWorked = flip();
    var rained = flip(0.3);
    condition((mySprinklerWorked || rained) && (KSprinklerWorked || rained));
    return mySprinklerWorked;
}

Infer({ method: "enumerate" }, sprinklerModel)

5 a
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