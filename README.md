# 🛠️ Equipment Rental Marketplace

A full-stack MERN application that facilitates peer-to-peer equipment renting. Users can list their own tools/electronics for rent and book items from other users.



## 🌟 Features
* **User Authentication:** Secure Login and Registration using JWT (JSON Web Tokens).

* **Browse Equipment:** View available items with images, descriptions, and daily pricing.

* **Smart Search:** Filter equipment by name or category.

* **Booking System:** Select start/end dates to calculate total cost and book items.

* **Vendor Logic:** Users can list items. Built-in validation prevents owners from booking their own inventory.

* **State Management:** Centralized state using Redux Toolkit for smooth data flow.

* **Responsive UI:** Modern, mobile-friendly design built with Tailwind CSS.

* **Notifications:** Real-time feedback using toast notifications.


## 🚀 Tech Stack
* **Frontend**
 ● React.js (Vite)

 ● Context API (Authentication state)

 ● Redux Toolkit (State Management)

 ● Tailwind CSS (Styling)

 ● React Router DOM (Navigation)

 ● Axios (API Requests)

 ● React Hot Toast (Notifications)

* **Backend**
 ● Node.js & Express.js (Server)

 ● MongoDB & Mongoose (Database)

 ● JWT (Authentication)

 ● Bcryptjs (Password Hashing)


## 📂 Project Structure
* Here is a quick look at how the code is organized:

    ├── client/                 # React Frontend
│   ├── src/
│   │   ├── context/        # AuthContext logic
│   │   ├── components/     # UI components (SearchBar, Navbar)
│   │   ├── pages/          # Views (Home, ProductDetails, Login)
│   │   ├── redux/          # Redux slices (Equipment, Bookings)
│   │   ├── utils/          # Axios setup & helpers
│   │   └── App.jsx
│   └── ...
│
├── server/                 # Node/Express Backend
│   ├── config/             # DB connection
│   ├── controllers/        # The logic behind the routes
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth verification
│   └── server.js           # App entry point
└── README.md