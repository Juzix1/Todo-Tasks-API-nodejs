"use client"

import React, {useState} from "react";
import {
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
  useCreateMessageMutation,
} from "../../features/apiSlice";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";

interface Message {
  id: number;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} ${day}.${month}.${year}`;
};

const MessageList = () => {
  const { data, error, isLoading, refetch } = useGetMessagesQuery({});
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();
  const [createMessage] = useCreateMessageMutation();
  const [editingMessage, setEditingMessage] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(id)
        .unwrap()
        .then(() => {
          alert("Message deleted successfully!");
          refetch();
        })
        .catch((err) => {
          console.error("Error deleting message:", err);
          alert(`Failed to delete message: ${err.message || err}`);
        });
    }
  };

  const handleUpdate = (id: number) => {
    if (newMessage.trim() !== "") {
      updateMessage({ id, message: newMessage })
        .unwrap()
        .then(() => {
          alert("Message updated successfully!");
          setEditingMessage(null);
          refetch();
        })
        .catch((err) => {
          console.error("Error updating message:", err);
          alert(`Failed to update message: ${err.message || err}`);
        });
    } else {
      alert("Message cannot be empty!");
    }
  };

  const handleCreateNewMessage = () => {
    const userMessage = window.prompt("Enter the message:");

    if (userMessage && userMessage.trim() !== "") {
      createMessage({ message: userMessage })
        .unwrap()
        .then(() => {
          alert("New message created successfully!");
          refetch();
        })
        .catch((err) => {
          console.error("Error creating message:", err);
          alert(`Failed to create message: ${err.message || err}`);
        });
    } else {
      alert("Message cannot be empty!");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading messages</div>;
  }

  if (!data || !Array.isArray(data.messages)) {
    return <div>No messages found</div>;
  }

  return (
    <div>
      {/* New Message Button */}
      <button
        className="create-new-message-button"
        onClick={handleCreateNewMessage}
      >
        Create New Message
      </button>

      <div className="message-container">
        {data.messages.map((message: Message) => (
          <Card key={message.id} className="message-card">
            <CardHeader className="message-header">
              <h3>Message {message.id}</h3>
              <div className="button-group">
                <button
                  className="update-button"
                  onClick={() => setEditingMessage(message.id)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(message.id)}
                >
                  Delete
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {editingMessage === message.id ? (
                <>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    className="save-update-button"
                    onClick={() => handleUpdate(message.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <p>{message.message}</p>
              )}
            </CardContent>
            <CardFooter>
              <small>Created At: {formatDate(message.createdAt)}</small>
              {message.updatedAt && message.updatedAt !== message.createdAt && (
                <div style={{ color: "#64b5f6", marginTop: "0.5rem" }}>
                  Updated At: {formatDate(message.updatedAt)}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MessageList;