/* eslint-disable linebreak-style */
import React, { useState } from 'react'
import Blog from './Blog'
import Toggable from './Toggable'

const BlogsForm = ({
  errorMessage,
  successMessage,
  handleLogout,
  handleNewBlog,
  handleUpdateBlog,
  handleDelete,
  user,
  blogs
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createNewBlog = event => {
    event.preventDefault()
    handleNewBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const updateBlog = (event, blogObject, blogId) => {
    event.preventDefault()
    handleUpdateBlog(blogObject, blogId)
  }

  return (
    <div className="formDiv">
      <h2>blogs</h2>
      <h3 style={{ color: 'red' }}>{errorMessage}</h3>
      <h3 style={{ color: 'green' }}>{successMessage}</h3>
      <div>
        {user.name} has logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br/>
      <Toggable buttonLabel='new blog'>
        <h2>create new</h2>
        <form onSubmit={createNewBlog} >
          <div>
                title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} id="title"/>
          </div>
          <div>
                author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} id="author"/>
          </div>
          <div>
                url: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} id="url"/>
          </div>
          <button type="submit">create</button>
        </form>
      </Toggable>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          username={user.username}
          handleDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default BlogsForm