import EkskulCards from "./components/EkskulCards";
import FormPendaftaran from "./components/FormPendaftaran";
import { Box, Flex, Heading, Button, Container, Link, HStack, Text, VStack, SimpleGrid } from "@chakra-ui/react";

function App() {
  return (
    <Box fontFamily="'Roboto', sans-serif">
      
      <Box as="nav" bg="white" boxShadow="sm" position="sticky" top="0" zIndex="1000">
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading as="a" href="#" size="lg" color="#0A2D5E" fontFamily="'Poppins', sans-serif">
              SMK BINUSA
            </Heading>

            <HStack spacing={8} display={{ base: "none", md: "flex" }}>
              <Link href="#" color="#0A2D5E" fontWeight="500" _hover={{ color: "#FDC800", textDecoration: "none" }}>Beranda</Link>
              <Link href="#daftar-ekskul" color="#0A2D5E" fontWeight="500" _hover={{ color: "#FDC800", textDecoration: "none" }}>Daftar Ekskul</Link>
              <Link href="#pendaftaran" color="#0A2D5E" fontWeight="500" _hover={{ color: "#FDC800", textDecoration: "none" }}>Pendaftaran</Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box>
        <EkskulCards />
        <FormPendaftaran />
      </Box>

      <Box bg="#0A2D5E" color="white" pt={16} pb={8}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={10}>
    
            <Box>
              <Heading size="md" mb={4} fontFamily="'Poppins', sans-serif">SMK Binusa</Heading>
              <Text color="#c0d1e8" lineHeight="1.8">
                Mencetak generasi unggul, berkarakter, dan siap kerja dengan fasilitas standar industri.
              </Text>
            </Box>
            
            <Box>
              <Heading size="sm" color="#FDC800" mb={4} fontFamily="'Poppins', sans-serif">Navigasi</Heading>
              <VStack align="start" spacing={2} color="#c0d1e8">
                <Link href="#daftar-ekskul" _hover={{ color: "white" }}>Daftar Ekskul</Link>
                <Link href="#pendaftaran" _hover={{ color: "white" }}>Form Pendaftaran</Link>
              </VStack>
            </Box>

            <Box>
              <Heading size="sm" color="#FDC800" mb={4} fontFamily="'Poppins', sans-serif">Kontak</Heading>
              <VStack align="start" spacing={2} color="#c0d1e8">
                <Text>Telepon: (021) 123-456</Text>
                <Text>Email: info@smkbinusa.sch.id</Text>
              </VStack>
            </Box>
          </SimpleGrid>

          <Box textAlign="center" pt={8} borderTop="1px solid #1e457a" color="#c0d1e8" fontSize="sm">
            &copy; 2025 SMK BINUSA. Semua Hak Cipta Dilindungi.
          </Box>
        </Container>
      </Box>

    </Box>
  );
}

export default App;