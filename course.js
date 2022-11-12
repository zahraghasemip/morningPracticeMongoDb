const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/courseInfo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Teacher = mongoose.model(
  "teacher",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  }),
);

const Course = mongoose.model(
  "course",
  new mongoose.Schema({
    name: String,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
  }),
);

async function createTeacher(name, bio, website) {
  const author = new Teacher({
    name,
    bio,
    website,
  });

  const result = await author.save();
}

async function createCourse(name, teacher) {
  const course = new Course({
    name,
    teacher,
  });

  const result = await course.save();
}

async function listCourses() {
  const courses = await Course.find()
    .populate("teacher ", "name bio-_id")
    .select("name teacher");
}

// createTeacher("zahra", "", "www");

// createCourse("", "");

listCourses();
