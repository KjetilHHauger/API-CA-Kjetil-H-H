# Filament Management System

## Overview

The Filament Management System is a full-stack application designed to help users manage brands, filament types (collections), and individual filaments. Users can:

- Create, edit, and delete brands.
- Add filament types (collections) under brands.
- Manage individual filaments, including properties like weight, price, and color.

## Features

### User Authentication

- **Login/Logout** functionality to ensure secure access.

### Brand Management

- Create, edit, and delete brands.
- Upload brand images.

### Filament Type Management (Collections)

- Add, update, and delete filament types under brands.

### Filament Management

- Add, update, and delete individual filaments within collections.
- Track details like color, weight, price, and calculate price per gram.

### Responsive Design

- Fully responsive UI for desktop and mobile devices.

---

## Technologies Used

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript** (Vanilla JS)

### Backend

- **Node.js**
- **Express.js**
- **MySQL** (Database)

### Deployment

- Hosted on [Render](https://render.com).
- Frontend deployed on [Netlify](https://khh-api.netlify.app/).

---

## Installation

### Prerequisites

1. **Node.js** installed on your system.
2. **MySQL** server running locally or remotely.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/API-CA-Kjetil-H-H.git
   ```

2. Navigate to the project directory:

   ```bash
   cd API-CA-Kjetil-H-H
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the database:

   - Create a MySQL database.
   - Import the provided `schema.sql` file to set up the database structure.
   - Create a `.env` file in the root directory and add your database credentials:

     ```env
     DB_HOST=your-db-host
     DB_USER=your-db-username
     DB_PASSWORD=your-db-password
     DB_NAME=your-db-name
     DB_PORT=your-db-port
     ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open the frontend:

   - Navigate to [https://khh-api.netlify.app/](https://khh-api.netlify.app/) in your browser.

---

## API Endpoints

### User Routes

- **POST** `/users` - Create a new user.
- **POST** `/login` - Authenticate a user.

### Brand Routes

- **GET** `/users/:user_id/brands` - Fetch all brands for a user.
- **POST** `/users/:user_id/brands` - Add a new brand.
- **PUT** `/brands/:brand_id` - Update an existing brand.
- **DELETE** `/brands/:brand_id` - Delete a brand.

### Collection Routes

- **GET** `/brands/:brand_id/collections` - Fetch collections under a brand.
- **POST** `/brands/:brand_id/collections` - Add a new collection.
- **PUT** `/collections/:collection_id` - Update a collection.
- **DELETE** `/collections/:collection_id` - Delete a collection.

### Filament Routes

- **GET** `/collections/:collection_id/filaments` - Fetch filaments in a collection.
- **POST** `/filaments` - Add a new filament.
- **PUT** `/filaments/:filament_id` - Update a filament.
- **DELETE** `/filaments/:filament_id` - Delete a filament.

---

## Usage

1. **Log In**: Use your credentials to log in.
2. **Manage Brands**: Add, edit, or delete brands.
3. **Manage Filament Types**: Add collections under specific brands.
4. **Manage Filaments**: Add, update, and delete individual filaments within collections.

---

## Possible future Enhancements

- Add search and filter functionality.
- Improve user authentication with JWT.
- Add support for uploading images directly instead of URLs.
- Enhance UI/UX with animations and tooltips.

---

## Deployment Links

- **API Renderer**: [https://api-ca-kjetil-h-h.onrender.com](https://api-ca-kjetil-h-h.onrender.com)
- **Frontend Website**: [https://khh-api.netlify.app/](https://khh-api.netlify.app/)

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any inquiries or feedback, feel free to contact:

- **GitHub**: [KjetilHHauger](https://github.com/KjetilHHauger)

