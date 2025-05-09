import React, { useEffect, useState } from "react";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    author: "",
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BASE_URL = "https://tural-server.vercel.app/api";

  const fetchBooks = async () => {
    const res = await fetch(`${BASE_URL}/books`);
    const data = await res.json();
    if (data.success) {
      setBooks(data.data);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingBookId ? "PUT" : "POST";
    const url = editingBookId
      ? `${BASE_URL}/books/${editingBookId}`
      : `${BASE_URL}/add`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      fetchBooks();
      setForm({ name: "", quantity: "", price: "", author: "" });
      setEditingBookId(null);
      setIsModalOpen(false);
    } else {
      alert(data.message);
    }
  };

  const handleEdit = (book) => {
    setForm({
      name: book.name,
      quantity: book.quantity,
      price: book.price,
      author: book.author,
    });
    setEditingBookId(book._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const res = await fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchBooks();
      } else {
        alert(data.message);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ name: "", quantity: "", price: "", author: "" });
    setEditingBookId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Book Manager
      </h2>

      {/* Add/Edit Book Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-6 rounded-lg shadow mb-8"
      >
        <input
          className="border border-green-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          name="name"
          placeholder="Book Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border border-green-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          className="border border-green-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="border border-green-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          {editingBookId ? "Update" : "Add"} Book
        </button>
      </form>

      {/* Books Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-green-100 text-left text-green-800">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price</th>
              <th className="p-3">Author</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border-t">
                <td className="p-3">{book.name}</td>
                <td className="p-3">{book.quantity}</td>
                <td className="p-3">{book.price}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-green-700">
              Edit Book
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="border border-green-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                name="name"
                placeholder="Book Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="border border-green-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                name="quantity"
                placeholder="Quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
              />
              <input
                className="border border-green-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                className="border border-green-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded font-semibold"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManager;
