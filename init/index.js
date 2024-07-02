const data = require("./data");
const mongoose = require("mongoose");
const Listing = require("../models/listing");

let mongoURL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
  await mongoose.connect(mongoURL);
}

main()
	.then((res) => {
		console.log("Connection successful");
	})
	.catch((err) => {
		console.log(err);
	});

const initDB = async () => {
  await Listing.deleteMany({});
	data.data = data.data.map((obj) => ({...obj, owner: '66531da047d9cb47a23d8064'}))
  await Listing.insertMany(data.data);
  console.log("Data was initialised!!");
}

initDB();
