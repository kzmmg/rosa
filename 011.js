// Mendel's First Law 
// rosalind.info/problems/iprb/

// nd, nh, nr
// 2 2 2
// p1: 1d : 2/6 2d: 1/5 = 2/30 (100%)
// p2: 1d : 2/6 2h: 2/5 = 4/30 (100%)
// p3: 1d : 2/6 2r: 2/5 = 4/30 (100%)
// p4: 1h : 2/6 2h: 1/5 = 2/30 (75%)
// p5: 1h : 2/6 2d: 2/5 = 4/30 (100%)
// p6: 1h : 2/6 1r: 2/5 = 4/30 (50%)
// p7: 1r : 2/6 2r: 1/5 = 2/30 (0%)
// p8: 1r : 2/6 2h: 2/5 = 4/30 (50%)
// p9: 1r : 2/6 2d: 2/5 = 4/30 (100%)

//------
// 2/30 + 4/30 + 4/30 + 3/4 * 2/30 + 4/30 + 4/30 * 0.5 + 0 + 4/30 * 0.5 + 4/30 = 22/30 + 3/4 * 2/30 = (22 + 6/4) / 30 = 94/120 - 0.7833

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split(" ")
	
let [nd, nh, nr] = [+dataset[0], +dataset[1], +dataset[2]]

let t = nd + nh + nr
let p1 = (nd / t) * (nd - 1) / (t-1) * 1.00
let p2 = (nd / t) * (nh - 0) / (t-1) * 1.00
let p3 = (nd / t) * (nr - 0) / (t-1) * 1.00
let p4 = (nh / t) * (nh - 1) / (t-1) * 0.75
let p5 = (nh / t) * (nd - 0) / (t-1) * 1.00
let p6 = (nh / t) * (nr - 0) / (t-1) * 0.50
let p7 = (nr / t) * (nr - 1) / (t-1) * 0.00
let p8 = (nr / t) * (nh - 0) / (t-1) * 0.50
let p9 = (nr / t) * (nd - 0) / (t-1) * 1.00


fs.writeFileSync("answer.txt", p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9)
