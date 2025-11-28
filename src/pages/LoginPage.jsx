import { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Stack, Text, useToast, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Import Supabase

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    if (!username || !password) {
      toast({ title: "Isi username dan password", status: "warning" });
      return;
    }

    setLoading(true);

    try {
      // Cek ke Database Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password) // Cek password (plain text utk simpel)
        .single();

      if (error || !data) {
        toast({ title: "Login Gagal", description: "Username atau password salah", status: "error" });
      } else {
        // Login Sukses
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("userRole", data.role); // Simpan role (admin/pembina/ketua)
        localStorage.setItem("userName", data.nama_lengkap);
        
        toast({ title: `Selamat Datang, ${data.nama_lengkap}`, status: "success" });
        navigate("/admin");
      }
    } catch (err) {
      toast({ title: "Terjadi Kesalahan", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100">
      <Container maxW="sm" bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <Box textAlign="center" mb={6}>
          <Heading size="lg" color="#0A2D5E">Portal Login</Heading>
          <Text color="gray.500" fontSize="sm">Masuk sebagai Admin, Guru, atau Ketua</Text>
        </Box>

        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()} 
            />
          </FormControl>

          <Button 
            bg="#0A2D5E" color="white" _hover={{ bg: "#061b3a" }} 
            onClick={handleLogin} w="100%" isLoading={loading}
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