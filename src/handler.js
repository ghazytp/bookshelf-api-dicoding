const { nanoid } = require("nanoid");
const books = require("./books");

// CREATE NEW BOOK
const createNewBooksHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  let responseDetails = {
    status: "",
    message: "",
  };

  if (!name) {
    responseDetails.status = "fail";
    responseDetails.message = "Gagal menambahkan buku. Mohon isi nama buku";

    return h.response(responseDetails).code(400);
  }

  const isPageValid = Number(readPage) > Number(pageCount) ? true : false;

  if (isPageValid) {
    responseDetails.status = "fail";
    responseDetails.message =
      "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";

    return h.response(responseDetails).code(400);
  }

  const newBook = {
    id: nanoid(16),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount: Number(pageCount),
    readPage: Number(readPage),
    finished: Number(readPage) == Number(pageCount) ? true : false,
    reading: Boolean(reading),
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === newBook.id).length > 0;

  if (isSuccess) {
    responseDetails.status = "success";
    responseDetails.message = "Buku berhasil ditambahkan";
    responseDetails.data = { bookId: newBook.id };

    return h.response(responseDetails).code(201);
  }
};

// GET ALL BOOKS
const getAllBooksHandler = (req, h) => {
  const { reading, finished, name } = req.query;

  let showBooks = books.map((book) => {
    return { id: book.id, name: book.name, publisher: book.publisher };
  });

  if (name) {
    showBooks =  showBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading === '1') {
    showBooks =  books.filter((book) => book.reading === true).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }) )
  }

  if (reading === '0') {
    showBooks =  books.filter((book) => book.reading === false).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }) )
  }

  if (finished === '1') {
    showBooks =  books.filter((book) => book.finished === true).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }) )
  }

  if (finished === '0') {
    showBooks =  books.filter((book) => book.finished === false).map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }) )
  }

  return h.response({ status: "success", data: { books: showBooks } });   
};

// GET BOOK BY ID
const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.find((book) => book.id === id);

  if (!book) {
    return h
      .response({ status: "fail", message: "Buku tidak ditemukan" })
      .code(404);
  }

  return h.response({ status: "success", data: { book } }).code(200);
};

// EDIT BOOK BY ID
const editBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  let responseDetails = {
    status: "",
    message: "",
  };

  if (!name) {
    responseDetails.status = "fail";
    responseDetails.message = "Gagal memperbarui buku. Mohon isi nama buku";

    return h.response(responseDetails).code(400);
  }

  const isPageValid = Number(readPage) > Number(pageCount) ? true : false;

  if (isPageValid) {
    responseDetails.status = "fail";
    responseDetails.message = "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"

    return h.response(responseDetails).code(400);
  }

  const book = books.find((book) => book.id === id);

  if (!book) {
    responseDetails.status = "fail";
    responseDetails.message = "Gagal memperbarui buku. Id tidak ditemukan";

    return h.response(responseDetails).code(404);
  }

  books[books.indexOf(book)] = {
    ...book,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount: Number(pageCount),
    readPage: Number(readPage),
    reading: Boolean(reading),
    updatedAt: new Date().toISOString(),
  };

  return h
    .response({ status: "success", message: "Buku berhasil diperbarui" })
    .code(200);
};

// DELETE BOOK BY ID
const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.find((book) => book.id === id);

  if (!book) {
    return h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  }

  books.splice(books.indexOf(book), 1);

  return h
    .response({ status: "success", message: "Buku berhasil dihapus" })
    .code(200);
};

module.exports = {
  createNewBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
