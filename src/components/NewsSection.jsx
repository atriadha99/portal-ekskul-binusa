import { useState, useEffect } from "react";
import { Box, Container, Heading, SimpleGrid, Image, Text, Flex, Badge, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

export default function NewsSection() {
  const [berita, setBerita] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchBerita = async () => {
      const { data } = await supabase.from('berita').select('*').order('tanggal', { ascending: false }).limit(6);
      if (data) setBerita(data);
    };
    fetchBerita();
  }, []);

  const handleBaca = (item) => {
    setSelected(item);
    onOpen();
  };

  // Jika tidak ada berita, sembunyikan section ini
  if (berita.length === 0) return null;

  return (
    <Box py={16} bg="gray.50">
      <Container maxW="container.xl">
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="xl" color="#0A2D5E" mb={3} fontFamily="'Poppins', sans-serif">
            Berita & Kegiatan Terbaru
          </Heading>
          <Box w="60px" h="4px" bg="#FDC800" mx="auto" mb={4} />
          <Text color="gray.600">Dokumentasi kegiatan dan prestasi siswa SMK Binusa.</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {berita.map((item) => (
            <Box key={item.id} bg="white" borderRadius="xl" overflow="hidden" shadow="md" _hover={{ shadow: 'xl', transform: 'translateY(-5px)' }} transition="all 0.3s">
              <Image src={item.gambar || "https://via.placeholder.com/400x250"} h="200px" w="100%" objectFit="cover" />
              <Box p={6}>
                <Text fontSize="xs" color="gray.500" mb={2}>📅 {new Date(item.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                <Heading size="md" color="#0A2D5E" mb={3} fontFamily="'Poppins', sans-serif" lineHeight="1.4">
                  {item.judul}
                </Heading>
                <Text noOfLines={3} fontSize="sm" color="gray.600" mb={4}>
                  {item.konten}
                </Text>
                <Button variant="link" color="#FDC800" onClick={() => handleBaca(item)}>Baca Selengkapnya &rarr;</Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* MODAL BACA BERITA */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
          <ModalContent borderRadius="xl" overflow="hidden">
            {selected && (
              <>
                <Image src={selected.gambar} h="300px" w="100%" objectFit="cover" />
                <ModalHeader pt={6} pb={2} color="#0A2D5E" fontSize="2xl" fontFamily="'Poppins', sans-serif">
                  {selected.judul}
                </ModalHeader>
                <ModalCloseButton bg="white" rounded="full" mt={2} mr={2} />
                <ModalBody pb={8}>
                  <Badge mb={4} colorScheme="blue">
                    {new Date(selected.tanggal).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </Badge>
                  <Text color="gray.700" lineHeight="1.8" style={{ whiteSpace: "pre-wrap" }}>
                    {selected.konten}
                  </Text>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

      </Container>
    </Box>
  );
}