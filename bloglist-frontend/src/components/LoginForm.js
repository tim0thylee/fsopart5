import React from 'react'

const LoginForm = ({
    errorMessage,
    handleLogin,
    username,
    setUsername,
    password,
    setPassword
}) => {
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

export default LoginForm