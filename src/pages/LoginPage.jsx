import { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Stack, Text, useToast, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      
      localStorage.setItem("isAdminAuthenticated", "true");
      
      toast({ title: "Login Berhasil", status: "success", duration: 2000, position: "top" });
      navigate("/admin"); 
    } else {
      toast({ title: "Username atau Password salah", status: "error", duration: 2000, position: "top" });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100">
      <Container maxW="sm" bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <Box textAlign="center" mb={6}>
          <Heading size="lg" color="#0A2D5E">Admin Login</Heading>
          <Text color="gray.500" fontSize="sm">Masuk untuk mengelola data ekskul</Text>
        </Box>

        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input 
              type="text" 
              placeholder="Masukkan username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input 
              type="password" 
              placeholder="Masukkan password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()} 
            />
          </FormControl>

          <Button 
            bg="#0A2D5E" 
            color="white" 
            _hover={{ bg: "#061b3a" }} 
            onClick={handleLogin}
            w="100%"
          >
            Masuk Dashboard
          </Button>
          
          <Button variant="link" size="sm" color="gray.500" onClick={() => navigate("/")}>
            Kembali ke Website
          </Button>
        </Stack>
      </Container>
    </Flex>
  );
}