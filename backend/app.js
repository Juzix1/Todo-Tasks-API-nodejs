import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sequelize from "./utils/database.js";
import Message from "./models/Message.js";
import cors from "cors";

// Initialize environment variables
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "ToDo Task" });
});

// Get list of all messages from DB
app.get("/messages", async (req, res) => {
  try{
    const messages = await Message.findAll();
    res.status(200).json({
      success: true,
      messages,
    })
  }catch(error){
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured while fetching messages",
    });
  }
});

// Get message by ID
app.get("/message/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        response: "Message not found",
      });
    }
    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      response: "Error occured while fetching message",
      error: error.message,
    });
  }
});

// Create new message
app.post("/message", async (req, res) => {
  const {message} = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      response: "Message cannot be empty!",
    });
  }
  try {
    const newMessage = await Message.create({ message });
    res.status(201).json({
      success: true,
      response: "Message sent successfully",
      message: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      response: "Error occured while senidng message",
      error: error.message,
    });
  }
});

// Global Error Handling Middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ success: false, message: message, data: data });
});

// Update existing messages
app.put("/message/:id", async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      response: "Message cannot be empty!",
    });
  }
  try {
    const messageToUpdate = await Message.findByPk(id);
    if (!messageToUpdate) {
      return res.status(404).json({
        success: false,
        response: "Message not found",
      });
    }
    messageToUpdate.message = message;
    await messageToUpdate.save();
    res.status(200).json({
      success: true,
      response: "Message updated successfully",
      message: messageToUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      response: "Error occured while updating message",
      error: error.message,
    });
  }
});

// Delete existing message
app.delete("/message/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const messageToDelete = await Message.findByPk(id);
    if (!messageToDelete) {
      return res.status(404).json({
        success: false,
        response: "Message not found",
      });
    }
    await messageToDelete.destroy();
    res.status(200).json({
      success: true,
      response: "Message deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      response: "Error occured while deleting message",
      error: error.message,
    });
  }
});
// DB Connection
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Connection has been established successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });
