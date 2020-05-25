import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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

  const handleNewBlog = async event => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title,
        author,
        url
      })
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setErrorMessage('Something has gone wrong. Please try posting again.')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <>
        <h2>log in to application</h2>
        <h3 style={{color: 'red'}}>{errorMessage}</h3>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input 
              type="text" 
              name="Username"
              value={username}
              onChange={({target}) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input 
              type="password"
              name="Password"
              value={password}
              onChange={({target}) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    )
  }

  const blogsForm = () => {
    return (
      <>
        <h2>blogs</h2>
        <h3 style={{color: 'red'}}>{errorMessage}</h3>
        <h3 style={{color: 'green'}}>{successMessage}</h3>
        <div>
          {user.name} has logged in
          <button onClick={handleLogout}>logout</button>
        </div>
        <br/>
        <h2>create new</h2>
        <form onSubmit={handleNewBlog}>
          <div>
            title: <input type="text" value={title} onChange={({target}) => setTitle(target.value)}/>
          </div>
          <div>
            author: <input type="text" value={author} onChange={({target}) => setAuthor(target.value)}/>
          </div>
          <div>
            url: <input type="text" value={url} onChange={({target}) => setUrl(target.value)}/>
          </div>
          <button type="submit">create</button>
        </form>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }

  return (
    <div>
      {user ? blogsForm() : loginForm()}
    </div>
  )
}

export default App