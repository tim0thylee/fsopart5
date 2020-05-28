import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const userData = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(userData)
      )
      blogService.setToken(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
    } catch (exception){
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const handleNewBlog = async newBlog => {
    try {
      const newBlogReponse = await blogService.create(newBlog)
      console.log(newBlogReponse)
      setBlogs(blogs.concat(newBlogReponse))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Something has gone wrong. Please try posting again.')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleUpdateBlog = async (updatedBlog, blogId) => {
    try {
      const updatedBlogResponse = await blogService.update(updatedBlog, blogId)
      setBlogs(blogs.map(blog => blog.id !== blogId ? blog : updatedBlogResponse))
    } catch (exception) {
      setErrorMessage('Could not update. Please try posting again.')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleDelete = async (blogId, blog) => {
    try {
      const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
      if (confirmDelete) {
        await blogService.deleteBlog(blogId)
        setBlogs(blogs.filter(blog => blog.id !== blogId))
        setSuccessMessage('Blog was successfully deleted.')
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      }
    } catch (exception) {
      setErrorMessage('Could not delete. Please refresh and try again.')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <div>
      {user ?
        <BlogForm
          errorMessage={errorMessage}
          successMessage={successMessage}
          handleLogout={handleLogout}
          handleNewBlog={handleNewBlog}
          blogs={blogs}
          user={user}
          handleUpdateBlog={handleUpdateBlog}
          handleDelete={handleDelete}
        /> : <LoginForm
          errorMessage={errorMessage}
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      }
    </div>
  )
}

export default App