import { Box, Heading, Text, Button, Input, Select, Textarea, VStack, FormControl, FormLabel, SimpleGrid, Container } from "@chakra-ui/react";

export default function FormPendaftaran() {
  return (
    <Box py={20} bg="#f4f7fa" id="pendaftaran">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="start">
          
          {/* Bagian Kiri: Informasi */}
          <Box pt={10}>
            <Heading as="h3" size="xl" color="#0A2D5E" mb={6} fontFamily="'Poppins', sans-serif">
              Siap Bergabung?
            </Heading>
            <Text color="gray.600" mb={6} fontSize="lg" lineHeight="1.8">
              Pilih ekstrakurikuler yang kamu minati dan daftarkan dirimu sekarang. Mulailah perjalananmu mengasah bakat, membangun karakter, dan meraih prestasi bersama kami.
            </Text>
            <Box p={6} bg="#0A2D5E" borderRadius="lg" color="white">
              <Text fontWeight="bold" color="#FDC800" mb={2}>Catatan Penting:</Text>
              <Text fontSize="sm" opacity={0.9}>
                Pastikan data yang kamu isi valid. Admin ekskul akan menghubungimu melalui WhatsApp untuk jadwal latihan perdana.
              </Text>
            </Box>
          </Box>

          {/* Bagian Kanan: Form */}
          <Box bg="white" p={8} borderRadius="xl" boxShadow="lg">
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel color="#0A2D5E" fontWeight="bold">Nama Lengkap</FormLabel>
                <Input placeholder="Nama Siswa" size="lg" focusBorderColor="#FDC800" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel color="#0A2D5E" fontWeight="bold">Kelas</FormLabel>
                <Select placeholder="-- Pilih Kelas --" size="lg" focusBorderColor="#FDC800">
                  <option>X DKV</option>
                  <option>X TKJ</option>
                  <option>X AKL</option>
                  <option>X MPLB</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="#0A2D5E" fontWeight="bold">Ekskul Pilihan</FormLabel>
                <Select placeholder="-- Pilih Ekskul --" size="lg" focusBorderColor="#FDC800">
                  <option>Albin Media</option>
                  <option>Bulu Tangkis</option>
                  <option>Basket</option>
                  <option>Band</option>
                  <option>Futsal</option>
                  <option>Volly</option>
                  <option>Taekwondo</option>
                  <option>Petanque</option>
                  <option>Pramuka</option>
                  <option>Paskibra</option>
                  <option>Tari Tradisional</option>
                  <option>Hadroh</option>
                  <option>Tari Saman</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="#0A2D5E" fontWeight="bold">Nomor WA Aktif</FormLabel>
                <Input type="tel" placeholder="08xxxxxxxxxx" size="lg" focusBorderColor="#FDC800" />
              </FormControl>

              <FormControl>
                <FormLabel color="#0A2D5E" fontWeight="bold">Alasan Bergabung</FormLabel>
                <Textarea rows={3} placeholder="Ceritakan motivasimu..." focusBorderColor="#FDC800" />
              </FormControl>

              <Button 
                w="100%" 
                size="lg"
                bg="#FDC800" 
                color="#0A2D5E" 
                _hover={{ bg: "#eabf00" }}
                fontWeight="bold"
                mt={4}
              >
                Kirim Pendaftaran
              </Button>
            </VStack>
          </Box>

        </SimpleGrid>
      </Container>
    </Box>
  );
}