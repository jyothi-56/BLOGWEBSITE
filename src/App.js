import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [view, setView] = useState('login');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [theme, setTheme] = useState('light');
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const handleSignup = () => {
    setUsers([...users, { email, password }]);
    setEmail('');
    setPassword('');
    setView('login');
  };

  const handleLogin = () => {
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      setCurrentUser(user);
      setView('home');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  const handleCreateBlog = () => {
    setBlogs([...blogs, { title, content, author: currentUser.email, likes: 0, comments: [] }]);
    setTitle('');
    setContent('');
  };

  const handleLike = (index) => {
    const newBlogs = [...blogs];
    newBlogs[index].likes += 1;
    setBlogs(newBlogs);
  };

  const handleComment = (index) => {
    const newBlogs = [...blogs];
    newBlogs[index].comments.push({ author: currentUser.email, text: comment });
    setComment('');
    setBlogs(newBlogs);
  };

  const handleDeleteBlog = (index) => {
    setBlogs(blogs.filter((_, i) => i !== index));
  };

  const handleChangeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const handleUpdateEmail = (newEmail) => {
    const updatedUsers = users.map(user => 
      user.email === currentUser.email ? { ...user, email: newEmail } : user
    );
    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, email: newEmail });
    setEmail('');
  };

  const handleUpdatePassword = (newPassword) => {
    const updatedUsers = users.map(user => 
      user.email === currentUser.email ? { ...user, password: newPassword } : user
    );
    setUsers(updatedUsers);
    setPassword('');
  };

  return (
    <div className={`app ${theme}`}>
      <div className="sidebar">
        <h2>My Blog</h2>
        <ul>
          <li onClick={() => setView('posts')}>Posts</li>
          <li onClick={() => setView('themes')}>Themes</li>
          <li onClick={() => setView('users')}>Users</li>
          <li onClick={() => setView('settings')}>Settings</li>
        </ul>
      </div>
      <div className="content">
        {view === 'login' && (
          <div className="form-container">
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p onClick={() => setView('signup')}>Don't have an account? Sign up</p>
          </div>
        )}
        {view === 'signup' && (
          <div className="form-container">
            <h2>Sign Up</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
            <p onClick={() => setView('login')}>Already have an account? Login</p>
          </div>
        )}
        {view === 'home' && currentUser && (
          <div className="home-container">
            <h2>Welcome to Blog</h2>
            <button onClick={handleLogout}>Logout</button>
            <div className="create-blog">
              <h3>Create Blog Post</h3>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <button onClick={handleCreateBlog}>Post</button>
            </div>
            <div className="blog-list">
              <h3>Blog Posts</h3>
              {blogs.map((blog, index) => (
                <div key={index} className="blog-post">
                  <h4>{blog.title}</h4>
                  <p>{blog.content.slice(0, 100)}...</p>
                  <p><strong>Author:</strong> {blog.author}</p>
                  <p><strong>Likes:</strong> {blog.likes}</p>
                  <button onClick={() => setSelectedPostIndex(index)}>Read More</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {view === 'posts' && (
          <div className="posts-container">
            <h2>Posts</h2>
            <div className="posts-list">
              {blogs.map((blog, index) => (
                <div key={index} className="post-summary">
                  <h3>{blog.title}</h3>
                  <p>{blog.content.slice(0, 100)}...</p>
                  <p><strong>Author:</strong> {blog.author}</p>
                  <p><strong>Likes:</strong> {blog.likes}</p>
                  <p><strong>Comments:</strong> {blog.comments.length}</p>
                  <button onClick={() => setSelectedPostIndex(index)}>Read More</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedPostIndex !== null && (
          <div className="post-detail">
            <h2>{blogs[selectedPostIndex].title}</h2>
            <p>{blogs[selectedPostIndex].content}</p>
            <p><strong>Author:</strong> {blogs[selectedPostIndex].author}</p>
            <p><strong>Likes:</strong> {blogs[selectedPostIndex].likes}</p>
            <button onClick={() => handleLike(selectedPostIndex)}>Like</button>
            <div className="comments-section">
              <h5>Comments</h5>
              {blogs[selectedPostIndex].comments.map((comment, i) => (
                <p key={i}><strong>{comment.author}:</strong> {comment.text}</p>
              ))}
              {currentUser && (
                <>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button onClick={() => handleComment(selectedPostIndex)}>Comment</button>
                </>
              )}
            </div>
            {blogs[selectedPostIndex].author === currentUser?.email && (
              <button onClick={() => handleDeleteBlog(selectedPostIndex)}>Delete</button>
            )}
            <button onClick={() => setSelectedPostIndex(null)}>Back to Posts</button>
          </div>
        )}
        {view === 'themes' && (
          <div className="themes-container">
            <h2>Select Theme</h2>
            <button onClick={() => handleChangeTheme('light')}>Light Theme</button>
            <button onClick={() => handleChangeTheme('dark')}>Dark Theme</button>
          </div>
        )}
        {view === 'users' && (
          <div className="users-container">
            <h2>Users</h2>
            <ul>
              {users.map((user, index) => (
                <li key={index} className="user-item">
                  <div className="user-info">
                    <p><strong>Email:</strong> {user.email}</p>
                    {/* No edit functionality */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {view === 'settings' && (
          <div className="settings-container">
            <h2>Settings</h2>
            <div className="form-container">
              <h3>Update Email</h3>
              <input
                type="email"
                placeholder="New Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={() => handleUpdateEmail(email)}>Update Email</button>
            </div>
            <div className="form-container">
              <h3>Update Password</h3>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={() => handleUpdatePassword(password)}>Update Password</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
