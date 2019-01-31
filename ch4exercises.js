var model = function () {
    var a = flip()
    var b = flip()
    var c = flip(a && b ? .8 : .5)
    return a
}
Infer({ method: "enumerate" }, model)

Infer({ method: 'enumerate' }, function () {
    var cancer = flip(0.00001)
    var cold = flip(0.2)
    var deadByCancer = cancer && flip(0.9)
    var deadByCold = cold && flip(0.00006)
    var deadByOther = flip(0.000000001)
    var dead = deadByCancer || deadByCold || deadByOther
    return cancer
});