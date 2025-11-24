import { useState } from "react";
import { 
  Box, Image, Heading, Text, SimpleGrid, Button, Badge, Flex, Container,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, VStack, HStack, Divider
} from "@chakra-ui/react";

const ekskuls = [
  { 
    nama: "Albin Media", 
    kateg: "Multimedia", 
    img: "https://placehold.co/600x400/0A2D5E/FDC800?text=Albin+Media", 
    desc: "Wadah jurnalistik, fotografi, dan videografi.",
    jadwal: "Sabtu, 09.00 - 12.00 WIB",
    lokasi: "Lab Multimedia",
    pembina: "Bpk. Hendra",
    syarat: "Membawa kamera (jika ada) atau smartphone."
  },
  { 
    nama: "Bulu Tangkis", 
    kateg: "Olahraga", 
    img: "https://placehold.co/600x400/FDC800/0A2D5E?text=Bulu+Tangkis",
    desc: "Mengasah teknik dan fisik atlet bulu tangkis.",
    jadwal: "Rabu, 15.00 - 17.00 WIB",
    lokasi: "GOR Binusa Hall A",
    pembina: "Ibu Susi",
    syarat: "Wajib memakai sepatu olahraga & membawa raket."
  },
  { 
    nama: "Basket", 
    kateg: "Olahraga", 
    img: "https://placehold.co/600x400/0A2D5E/FDC800?text=Basket",
    desc: "Kerja sama tim dan strategi di lapangan.",
    jadwal: "Jumat, 14.00 - 16.30 WIB",
    lokasi: "Lapangan Basket Utama",
    pembina: "Coach Dimas",
    syarat: "Fisik prima dan sepatu basket standar."
  },
  { 
    nama: "Band", 
    kateg: "Seni", 
    img: "https://placehold.co/600x400/FDC800/0A2D5E?text=Band",
    desc: "Ekspresikan dirimu melalui musik dan vokal.",
    jadwal: "Kamis, 15.00 - 17.00 WIB",
    lokasi: "Studio Musik Lt. 2",
    pembina: "Bpk. Yoyo",
    syarat: "Menguasai dasar alat musik atau vokal."
  },
  { 
    nama: "Futsal", 
    kateg: "Olahraga", 
    img: "https://placehold.co/600x400/0A2D5E/FDC800?text=Futsal",
    desc: "Latih kecepatan dan kekompakan tim.",
    jadwal: "Selasa & Jumat, 16.00 WIB",
    lokasi: "Lapangan Futsal Sekolah",
    pembina: "Coach Ari",
    syarat: "Memakai sepatu futsal & jersey latihan."
  },
  { 
    nama: "Volly", 
    kateg: "Olahraga", 
    img: "https://placehold.co/600x400/FDC800/0A2D5E?text=Volly",
    desc: "Teknik spike dan block yang presisi.",
    jadwal: "Senin, 15.30 - 17.30 WIB",
    lokasi: "Lapangan Voli",
    pembina: "Bpk. Tono",
    syarat: "Pakaian olahraga lengkap."
  },
  { 
    nama: "Taekwondo", 
    kateg: "Bela Diri", 
    img: "https://placehold.co/600x400/0A2D5E/FDC800?text=Taekwondo",
    desc: "Bela diri asal Korea yang melatih fisik & mental.",
    jadwal: "Sabtu, 08.00 - 10.00 WIB",
    lokasi: "Aula Serbaguna",
    pembina: "Sabeum Nim Rizky",
    syarat: "Baju Dobok (bisa dibeli saat pendaftaran)."
  },
  { 
    nama: "Paskibra", 
    kateg: "Disiplin", 
    img: "https://placehold.co/600x400/FDC800/0A2D5E?text=Paskibra",
    desc: "Melatih kedisiplinan dan baris-berbaris.",
    jadwal: "Sabtu, 07.00 - 11.00 WIB",
    lokasi: "Lapangan Upacara",
    pembina: "Ibu Ratna",
    syarat: "Potongan rambut rapi & fisik kuat."
  },
  { 
    nama: "Tari Tradisional", 
    kateg: "Seni", 
    img: "https://placehold.co/600x400/0A2D5E/FDC800?text=Tari+Tradisional",
    desc: "Melestarikan budaya bangsa melalui gerak.",
    jadwal: "Rabu, 14.00 - 16.00 WIB",
    lokasi: "Ruang Kaca/Tari",
    pembina: "Ibu Dewi",
    syarat: "Membawa selendang latihan."
  },
];

export default function EkskulCards() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEkskul, setSelectedEkskul] = useState(null);

  const handleOpenDetail = (item) => {
    setSelectedEkskul(item);
    onOpen();
  };

  return (
    <Box py={16} bg="white" id="daftar-ekskul">
      <Container maxW="container.xl">

        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="2xl" color="#0A2D5E" mb={4} fontFamily="'Poppins', sans-serif">
            Daftar Ekstrakurikuler
          </Heading>
          <Box w="80px" h="4px" bg="#FDC800" mx="auto" />
        </Box>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {ekskuls.map((item, index) => (
            <Box 
              key={index} 
              bg="white" 
              borderRadius="xl" 
              overflow="hidden" 
              boxShadow="0 4px 6px rgba(0,0,0,0.05)"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
              border="1px solid"
              borderColor="gray.100"
            >
              <Image src={item.img} alt={item.nama} h="220px" w="100%" objectFit="cover" />
              <Box p={6}>
                <Flex justify="space-between" align="center" mb={3}>
                  <Heading size="md" color="#0A2D5E" fontFamily="'Poppins', sans-serif">{item.nama}</Heading>
                  <Badge 
                    colorScheme={
                      item.kateg === 'Olahraga' ? 'blue' : 
                      item.kateg === 'Seni' ? 'orange' : 
                      item.kateg === 'Multimedia' ? 'purple' : 'green'
                    } 
                    borderRadius="full" 
                    px={2}
                  >
                    {item.kateg}
                  </Badge>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={5} noOfLines={2}>
                  {item.desc}
                </Text>
                <Button 
                  w="100%" 
                  variant="outline" 
                  borderColor="#0A2D5E" 
                  color="#0A2D5E" 
                  _hover={{ bg: "#0A2D5E", color: "white" }}
                  onClick={() => handleOpenDetail(item)}
                >
                  Lihat Detail
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered motionPreset="slideInBottom">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
          <ModalContent borderRadius="xl" overflow="hidden">
            {selectedEkskul && (
              <>
                <Image 
                  src={selectedEkskul.img} 
                  alt={selectedEkskul.nama} 
                  h="250px" 
                  w="100%" 
                  objectFit="cover" 
                />
                <ModalHeader bg="#0A2D5E" color="white">
                  <Flex justify="space-between" align="center">
                    <Text fontFamily="'Poppins', sans-serif">{selectedEkskul.nama}</Text>
                    <Badge colorScheme="yellow" color="#0A2D5E" fontSize="xs">{selectedEkskul.kateg}</Badge>
                  </Flex>
                </ModalHeader>
                <ModalCloseButton color="white" />
                
                <ModalBody p={6}>
                  <VStack align="start" spacing={4} divider={<Divider />}>
                    <Box>
                      <Text fontWeight="bold" color="#0A2D5E" mb={1}>Deskripsi</Text>
                      <Text color="gray.600" fontSize="sm">{selectedEkskul.desc} Kegiatan ini bertujuan untuk mengembangkan bakat siswa secara profesional dan menyenangkan.</Text>
                    </Box>
                    
                    <SimpleGrid columns={2} w="100%" spacing={4}>
                      <Box>
                        <Text fontWeight="bold" color="#0A2D5E" fontSize="sm">📅 Jadwal</Text>
                        <Text color="gray.600" fontSize="sm">{selectedEkskul.jadwal}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="#0A2D5E" fontSize="sm">📍 Lokasi</Text>
                        <Text color="gray.600" fontSize="sm">{selectedEkskul.lokasi}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color="#0A2D5E" fontSize="sm">👤 Pembina</Text>
                        <Text color="gray.600" fontSize="sm">{selectedEkskul.pembina}</Text>
                      </Box>
                    </SimpleGrid>

                    <Box bg="orange.50" p={3} borderRadius="md" w="100%" borderLeft="4px solid orange">
                      <Text fontWeight="bold" color="orange.700" fontSize="sm">Persyaratan:</Text>
                      <Text color="orange.800" fontSize="sm">{selectedEkskul.syarat}</Text>
                    </Box>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>Tutup</Button>
                  <Button bg="#FDC800" color="#0A2D5E" _hover={{ bg: "#eabf00" }} as="a" href="#pendaftaran" onClick={onClose}>
                    Daftar Sekarang
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

      </Container>
    </Box>
  );
}