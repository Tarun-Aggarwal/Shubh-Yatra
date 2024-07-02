const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
	mongoUrl: dbUrl,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 3600,
})

store.on("error", () => {
	console.log("Error in MONGO Session Store", err);
})

const sessionOptions = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	}
};

async function main(){
	await mongoose.connect(dbUrl);
};

main()
.then((res) => {
	console.log("Connection successful");
})
.catch((err) => {
	console.log(err);
});


// app.get("/", (req, resp) => {
// 	resp.send("working!!");
// })

app.listen(port, () => {
	console.log("Server is listening to port ", port);
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, resp, next) => {
	resp.locals.success = req.flash("success");
	resp.locals.error = req.flash("error");
	resp.locals.currUser = req.user;
	next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, resp, next) => {
	next(new ExpressError(404, "Page NOT Found!!"));
})

//Error Handling Middleware
app.use((err, req, resp, next) => {
	let {status=500, message="Something Went Wrong"} = err;
	resp.status(status).render("Error.ejs", {status, message});
})
