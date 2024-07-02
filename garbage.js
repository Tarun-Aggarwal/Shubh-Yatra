//App.js
app.get("/testListing", async (req, resp) => {
	const listing1 = new Listing({
		title: "Villa new Jalandhar",
		description: "A new villa near you!!",
		price: 10000,
		location: "Jalandhar Punjab",
		country: "India",
	});
	
	await listing1.save();
	resp.send("Listing Saved In DB");
})