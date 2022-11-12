const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/comments")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const CommentSchema = new mongoose.Schema({
  text: String,
  sender: String,
});

const Comment = mongoose.model("comments", CommentSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    comments: [CommentSchema],
  }),
);

async function createCourse(name, comments) {
  const course = await new Course({
    name,
    comments,
  }).save();
  console.log(course);
}
async function updateCourse(courseId, commentId, text) {
  const result = await Course.update(
    {
      _id: courseId,
      comments: {
        $elemMatch: {
          _id: commentId,
        },
      },
    },
    {
      $set: {
        "comments.$.text": text,
      },
    },
  );
  console.log(result);
}
async function addComment(courseId, text, sender) {
  let course = await Course.findById(courseId);
  course.comments.push(
    new Comment({
      text,
      sender,
    }),
  );
  course = await course.save();
  console.log(course);
}
async function removeComment(courseId, commentId) {
  let course = await Course.findById(courseId);
  let comment = course.comments.id(commentId);
  comment.remove();
  course = await course.save();
}

createCourse("api nodejs", [
  new Comment({
    text: "",
    sender: "",
  }),
  new Comment({
    text: "",
    sender: "",
  }),
  new Comment({
    text: "",
    sender: "",
  }),
]);

// updateCourse("", "", "");
// addComment("", "", "");
// removeComment("", "");
