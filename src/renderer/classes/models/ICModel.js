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
            n9: cn9 = 1, n0 = 1, n8 = 1
        } = {},
        a: {
            n9: an9 = 1.2, n1 = 1.1, n5 = 1
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
        mu = 1,
        phi = 0.5,
        nuEff5 = 1,
        N5_0 = 1,
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

        const c1_0 = `((${k4}) * (1 - exp(-z * (${a1}))) - (${k5}) * (exp(-z * (${c0})) - exp(-z * (${a1}))))`;
        const c1_1 = `(${k7}) * (exp(-z * (${a9})) - exp(-z * (${a1}))) - (${k8}) * (exp(-z * (${c0})) - exp(-z * (${a1})))`;

        return {
            c5: `(${this.c5_0()}) * exp(-z)`,
            c9: `(${sstr / a9}) * (1 - exp(- (${a9}) * z))`,
            c0: `(${c9}) * ((${k0}) * (1 - exp(- (${c0}) * z)) - (${k1}) * (exp(- (${a9}) * z) - exp(- (${c0}) * z)))`,
            c1: `(${k2}) * ((${k3}) * ${c1_0}) - (${k6}) * ${c1_1}`
        };
    }
}
