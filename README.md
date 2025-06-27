# IskoTasks - Academic Task Management System

A modern, full-stack web application designed to help Iskolar ng Bayan to organize and manage their academic tasks efficiently.

## 🚀 Features

### Task Management
- **Create, Edit, Delete Tasks** - Full CRUD operations for academic tasks
- **Priority Levels** - Organize tasks by High, Medium, and Low priority
- **Due Date Tracking** - Never miss a deadline with visual indicators
- **Task Categories** - Organize tasks by subjects or categories
- **Completion Tracking** - Mark tasks as complete and track progress

### Smart Filtering
- **Today's Tasks** - View tasks due today
- **Upcoming Tasks** - See tasks scheduled for future dates
- **Overdue Tasks** - Quickly identify missed deadlines
- **Completed Tasks** - Review your accomplishments
- **Priority Filtering** - Filter by task priority levels

### User Experience
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Instant feedback with notifications
- **Profile Management** - Update user information and track statistics
- **Study Tips** - Motivational Filipino study tips popup

### Security & Authentication
- **Secure User Registration** - Strong password requirements
- **Encrypted Data Storage** - Task data is encrypted using AES-256-CBC
- **Session Management** - Secure user authentication
- **Password Hashing** - Bcrypt for secure password storage

### Widgets & Extras
- **Weather Widget** - Current weather information
- **Clock Widget** - Real-time clock display
- **Spotify Widget** - Music integration for study sessions
- **Task Statistics** - Completion rates and priority distribution



## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **HeroUI** for UI components
- **Zustand** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **Mongoose** for ODM
- **Bcrypt** for password hashing
- **AES-256-CBC** encryption for sensitive data

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ITEC85-StudyTrack.git
   cd ITEC85-StudyTrack
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Configuration**
   // for people that will fork or clone
   Create `server/config.env` file:
   ```env
   ATLAS_URI=your_mongodb_connection_string
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```

5. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```
6. **Having issues starting the dev server?**
   If the command above doesn't work, try installing the Hero UI CLI globally:
   ```bash
   npm install -g heroui-cli
   ```

   Then try running the server again:
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:3000

## 🔐 Security Features

### Data Encryption
- Task titles, descriptions, priorities, and subjects are encrypted
- Uses AES-256-CBC encryption with unique initialization vectors
- Automatic encryption/decryption through Mongoose middleware

### Password Security
- Strong password requirements for new users:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### Authentication
- Secure user registration and login
- Password hashing with bcrypt
- Session-based authentication

## 📱 Usage

### Getting Started
1. **Sign Up** - Create an account with a strong password
2. **Login** - Access your personal task dashboard
3. **Add Tasks** - Create your first academic task
4. **Organize** - Set priorities and due dates
5. **Track Progress** - Monitor completion rates and statistics

### Task Management
- Click "Add New Task" to create tasks
- Use filters to view specific task categories
- Edit tasks by clicking on them
- Mark tasks complete with the checkbox
- Delete tasks when no longer needed

### Profile Management
- View task statistics and completion rates
- Update your profile information
- Track your academic progress over time

## 🎨 Customization

### Themes
- Toggle between light and dark modes
- Consistent color scheme across all components
- Responsive design adapts to user preferences

### Widgets
- Weather widget shows current conditions
- Clock widget displays real-time
- Spotify widget for study music integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Authors

- **Humprey Dwight Lewis A. Ocay** - Initial work - [https://github.com/Lollima2/ITEC85-StudyTrack](https://github.com/Lollima2)

## 👥 Collaborators

- **John Jossel Dumaop** (https://github.com/Jaysu-kun)
- **Justin Christian Diokno** (https://github.com/JCDiokno)

## 🙏 Acknowledgments

- HeroUI for beautiful React components
- Tailwind CSS for utility-first styling
- MongoDB Atlas for cloud database hosting
- Framer Motion for smooth animations

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/ITEC85-StudyTrack/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**IskoTasks** - Empowering students to achieve academic success through organized task management! 🎓