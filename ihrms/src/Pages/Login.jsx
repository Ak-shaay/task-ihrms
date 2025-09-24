import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
// login
    const handleLogin = (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            alert("Please enter both username and password");
            return;
        }

        switch (username) {
            case 'Priya':
                navigate('/Home');
                break;
            case 'Asha':
                navigate('/asha');
                break;
            case 'Rahul':
                navigate('/rahul');
                break;
            default:
                alert('Invalid Credentials');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8,
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                required
                id="username"
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
                required
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Login
            </Button>
        </Box>
    );
}

export default Login;
