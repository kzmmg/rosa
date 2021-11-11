
// Finding a Protein Motif
// rosalind.info/problems/mprt/

const fs = require("fs")
const https = require("https")

function gp(id) {
	return new Promise((r,rj)=> {
		//id = id.split("_")[0]
		let url = "https://www.uniprot.org/uniprot/" + id + ".fasta"
		//console.log(url)
		
		https.get(url, (res) => {
			
			const { statusCode } = res;
			
			if (statusCode !== 200) {
				console.log("status", statusCode, url)
				let loc = res.headers["location"].split("/")[2].split(".")[0]
				console.log("moved to", loc)
				
				
				return rj(loc)
			}
			
		res.setEncoding('utf8');
			let chunk = ""
			res.on("data", (d) => {
				//console.log(d)
				chunk+=d
			})
			res.on("end", ()=> {
				r(chunk)
			})
			res.on("error", (e) => {
				console.log(e)
				rj(e)
			})
		}).on("error", (e) => {
			console.log(e)
			rj(e)
		});
	})
}

function wp(p) {
	p = p.split("\n")
	p = p.slice(1).join("")
	return p
}

let go = async () => {
	let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

	let prots = []
	
	for (let i = 0; i < dataset.length; i++) {
		let prot
		
		try {
			prot = await gp(dataset[i])
		} catch (loc) {
			prot = await gp(loc)
		}
		
		prot = wp(prot)
		
		//console.log(prot)
		prots.push(prot)
	}
	
	//console.log(prots)
	//prots = prots.map( p => p.split("\r\n")[1])
	
	//console.log(prots.length)
	// https://stackoverflow.com/a/20837608
	const r = /(?=(N[^P]{1}(S|T)[^P]{1}))./g
	
	let selp = []
	let seli = []
	for (let i = 0; i < prots.length; i++) {
		let bag = []
		let m
		while(m = r.exec(prots[i])) {
			//console.log(":", i, m.index + 1)
			bag.push(m.index + 1)
		}
			
		if (!bag.length) continue
		
		seli.push(bag)
		selp.push(dataset[i])
		bag = []
	}
	
	let res = ""
	for (let i = 0; i < selp.length; i++) {
		res += selp[i] + "\n" + seli[i].join(" ") + "\n"
	}
	fs.writeFileSync("answer.txt", res)
}

go()
