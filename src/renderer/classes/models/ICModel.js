/* eslint-disable camelcase, no-unused-vars */
const objMapDiv = (obj, div) => {
    return Object.keys(obj)
        .map(key => [key, obj[key]])
        .map(([key, val]) => [key, val / div])
        .reduce((acc, [key, val]) => {
            acc[key] = val;
            return acc;
        }, {})
    ;
};

class Sigmas {
    constructor({
        c: {
            n9: cn9 = 269.3, n0 = 287, n8 = 2.71
        } = {},
        a: {
            n9: an9 = 1028, n1 = 1375.4, n5 = 683
        } = {}
    } = {}) {
        this.c = { n9: cn9, n0, n8 };
        this.a = { n9: an9, n1, n5 };
    }

    inv() {
        return {
            c: objMapDiv(this.c, this.a.n5),
            a: objMapDiv(this.a, this.a.n5)
        };
    }
}

export default class ICModel {
    constructor({
        sigma,
        mu = 1.0525,
        phi = 0.92,
        nuEff5 = 2.08,
        N5_0 = 0.7,
        N8 = 1
    } = {}) {
        this.sigma = new Sigmas(sigma);
        Object.assign(this, {
            mu,
            phi,
            nuEff5,
            N5_0,
            N8
        });
    }

    sigmaStar() {
        return this.sigma.inv().c.n8 +
            this.mu * (1 - this.phi) *
            this.nuEff5 * this.c5_0();
    }

    c5_0() {
        return this.N5_0 / this.N8;
    }

    formulas() {
        const sinv = this.sigma.inv();
        const sstr = this.sigmaStar();

        const a1 = sinv.a.n1;
        const c0 = sinv.c.n0;
        const a9 = sinv.a.n9;
        const c9 = sinv.c.n9;

        // c0
        const k0 = sstr / (sinv.a.n9 * sinv.c.n0);
        const k1 = sstr / (sinv.a.n9 * (sinv.c.n0 - sinv.a.n9));

        // c1
        const k2 = sinv.c.n0 * sinv.c.n9;
        const k3 = k0;
        const k4 = 1 / sinv.a.n1;
        const k5 = 1 / (sinv.a.n1 - sinv.c.n0);
        const k6 = k1;
        const k7 = 1 / (sinv.a.n1 - sinv.a.n9);
        const k8 = k5;

        const c1_0 = `((${k4}) * (1 - exp(- (${a1}) * z)) - (${k5}) * (exp(- (${c0}) * z) - exp(- (${a1}) * z)))`;
        const c1_1 = `(${k7}) * (exp(- z * (${a9})) - exp(- z * (${a1}))) - (${k8}) * (exp(- z * (${c0})) - exp(- z * (${a1})))`;

        return {
            c5: `(${this.c5_0()}) * exp(-z)`,
            c9: `(${sstr / a9}) * (1 - exp(- (${a9}) * z))`,
            c0: `(${c9}) * ((${k0}) * (1 - exp(- (${c0}) * z)) - (${k1}) * (exp(- (${a9}) * z) - exp(- (${c0}) * z)))`,
            c1: `(${k2}) * ((${k3}) * (${c1_0}) - (${k6}) * (${c1_1}))`
        };
    }
}
