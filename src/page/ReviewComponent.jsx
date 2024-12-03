import { useState } from "react";
import { Input, Button, List, Form, message } from "antd";
import axios from "axios";
import { checkLoginToken } from "../utils";
import { useSearchParams } from "react-router-dom";

const ReviewComponent = ({ reviewDb, profile }) => {
  const [form] = Form.useForm();
  const [reviews, setReviews] = useState(reviewDb || []);
  const [editingId, setEditingId] = useState(null);
  const [searchParams] = useSearchParams();
  const idc = searchParams.get("idc");
  const handleAddOrUpdate = async (values) => {
    const { description } = values;
    if (editingId) {
      // Update review
      setReviews((prev) =>
        prev.map((review) =>
          review.id === editingId ? { ...review, description } : review
        )
      );
      message.success("Review updated successfully!");
    } else {
      // Add new review
      const newReview = {
        description: description,
        tripId: idc,
        createdAt: "2024-11-23T07:12:48.744Z",
        createdBy: 0,
        updateAt: "2024-11-23T07:12:48.744Z",
        updateBy: 0,
        userId: profile.id,
      };

      await axios.post("https://boring-wiles.202-92-7-204.plesk.page/api/Review", newReview, {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      });
      setReviews((prev) => [...prev, newReview]);
      message.success("Review added successfully!");
    }
    form.resetFields();
    setEditingId(null);
  };

  const handleEdit = (id) => {
    const reviewToEdit = reviews.find((review) => review.id === id);
    form.setFieldsValue({ description: reviewToEdit.description });
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
    message.success("Review deleted successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <Form
        form={form}
        onFinish={handleAddOrUpdate}
        className="flex gap-4 items-center"
      >
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please enter your review!" }]}
          className="flex-grow"
        >
          <Input.TextArea
            placeholder="Write your review here..."
            className="border-gray-300 rounded-md"
          />
        </Form.Item>
        <Form.Item>
          <button type="submit">{editingId ? "Update" : "Submit"}</button>
        </Form.Item>
      </Form>

      <List
        dataSource={reviews}
        renderItem={(item) => (
          <List.Item className="flex justify-between items-start">
            <div>
              <p className="text-gray-800">{item.description}</p>
              <span className="text-xs text-gray-500">
                User ID: {item.userId}
              </span>
            </div>
            {item.userId === profile.id && (
              <div className="flex gap-2">
                <Button
                  size="small"
                  htmlType=""
                  onClick={() => handleEdit(item.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  htmlType=""
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ReviewComponent;
