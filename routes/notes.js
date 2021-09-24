const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/Notes");

// note input validation schema
let noteValidate = [
  body("title", "Title must be 5 characters least").isLength({ min: 5 }),
  body("description", "Description must be 10 characters least").isLength({
    min: 10,
  }),
];

// ROUTE 1: Add a new note using: POST "/api/notes/addnote" require login
router.post("/addnote", noteValidate, fetchUser, async (req, res) => {
  // user creds validation, error handling and returning if bad request
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // getting the user ID as string from the fetchuser module
  const userID = req.user.id;
  // extracting title, description and tag from request body
  let { title, description, tag } = req.body;
  // As tag is optional, so if it's empty then add "general" to it
  if (tag.length == 0) {
    tag = "general";
  }
  try {
    // Querying if a same title for a user is present or not
    let note = await Notes.find({ $and: [{ userID }, { title }] });
    // returns with bad request if a same title for a user is present
    if (note[0])
      return res.status(400).json({
        error: "This title already exists in a note",
      });

    // Creating a new note for each user
    note = await new Notes({ title, description, tag, user: userID });

    // saving the note
    const savedNote = await note.save();
    // sending the saved note info
    res.send({ success: "The note has been saved successfully", savedNote });

    // database error
  } catch (err) {
    res.status(500).send("Internal Server Error Occured");
  }
});

// ROUTE 2: Get all notes of user using: GET "/api/notes/fetchallnotes" require login
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  // getting the user ID as string from the fetchuser module
  const userID = req.user.id;

  try {
    // find the notes of a user by its user ID
    const notes = await Notes.find({ user: userID });

    //sending all notes of a particular user
    res.send(notes);

    // database error
  } catch (err) {
    res.status(500).send("Internal Server Error Occured");
  }
});

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote" require login
router.put("/updatenote/:id", fetchUser, noteValidate, async (req, res) => {
  // pulling the title, desc and tag from input body
  const { title, description, tag } = req.body;
  // initializing a new Note object
  const newNote = {};
  // if these fields are changed from input then they are assigned to newNote object
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  try {
    // find the note to be updated and update it, if note not found then return
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    // checking whether the note to be updated belongs to it's original user if not then return
    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Unauthorized Access");

    // finding the note to be updated and updating it with the newNote object
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote });

    // sending the updated note to user
    res.json({ success: "The note has been updated successfully", note });

    // database error
  } catch (err) {
    res.status(500).send("Internal Server Error Occured");
  }
});

// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote" require login
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    // find the note to be deleted and delete it, if note not found then return
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    // checking whether the note to be updated belongs to it's original user if not then return
    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Unauthorized Access");

    // finding the note to be updated and updating it with the newNote object
    note = await Notes.findByIdAndDelete(req.params.id);

    // sending the deleted note to user
    res.json({ success: "The note has been deleted successfully", note });

    // database error
  } catch (err) {
    res.status(500).send("Internal Server Error Occured");
  }
});

module.exports = router;
