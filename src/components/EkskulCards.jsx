import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Import Supabase
import { Box, Image, Heading, Text, SimpleGrid, Button, Badge, Flex, Container, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";

export default function EkskulCards() {
  const [ekskulList, setEkskulList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);

  // AMBIL DATA DARI SUPABASE
  useEffect(() => {
    const fetchEkskuls = async () => {
      const { data, error } = await supabase.from('ekskuls').select('*');
      if (!error) {
        setEkskulList(data);
      }
    };
    
    fetchEkskuls();
  }, []);

  const handleDetail = (item) => {
    setSelected(item);
    onOpen();
  };

  return (
    <Box py={16} bg="white" id="daftar-ekskul">
      <Container maxW="container.xl">
        {/* ... JUDUL SECTION SAMA SEPERTI SEBELUMNYA ... */}
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="2xl" color="#0A2D5E" mb={4} fontFamily="'Poppins', sans-serif">
            Daftar Ekstrakurikuler
          </Heading>
          <Box w="80px" h="4px" bg="#FDC800" mx="auto" />
        </Box>

        {ekskulList.length === 0 ? (
          <Text textAlign="center">Loading data ekskul...</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {ekskulList.map((item) => (
              <Box key={item.id} bg="white" borderRadius="xl" overflow="hidden" boxShadow="md" border="1px solid" borderColor="gray.100">
                {/* Placeholder Image */}
                <Image src={`https://placehold.co/600x400/0A2D5E/FDC800?text=${item.nama}`} h="220px" w="100%" objectFit="cover" />
                <Box p={6}>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading size="md" color="#0A2D5E">{item.nama}</Heading>
                    <Badge colorScheme="blue">{item.kateg}</Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" mb={5} noOfLines={2}>
                    {item.desc || "Kegiatan pengembangan bakat siswa."}
                  </Text>
                  <Button w="100%" variant="outline" colorScheme="blue" onClick={() => handleDetail(item)}>
                    Lihat Detail
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* ... MODAL DETAIL SAMA SEPERTI SEBELUMNYA ... */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
          <ModalContent>
            {selected && (
              <>
                <ModalHeader bg="#0A2D5E" color="white">{selected.nama}</ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody py={6}>
                  <Text fontWeight="bold" mb={2}>Kategori: <Badge>{selected.kateg}</Badge></Text>
                  <Text fontWeight="bold" mb={2}>Jadwal: {selected.jadwal || "-"}</Text>
                  <Text color="gray.600" mt={4}>{selected.desc || "Belum ada deskripsi."}</Text>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={onClose}>Tutup</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

      </Container>
    </Box>
  );
}