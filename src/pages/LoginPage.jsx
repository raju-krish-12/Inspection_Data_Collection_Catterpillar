// src/components/LoginForm.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Container
} from '@chakra-ui/react';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation, authentication, etc.
    // For simplicity, assume validation passes for now.

    // Redirect to another page after successful login
    navigate("/profile"); // Replace '/dashboard' with your desired route
  };

  return (
    <Container maxW="sm" centerContent mt="200px">

    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue">Login</Button>
      </Stack>
    </form>
    </Container>
  );
}

export default LoginForm;
