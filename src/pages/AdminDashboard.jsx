import { useState, useEffect } from "react";
import {
  Box, Flex, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, FormControl, FormLabel, Input, Select, useToast, Container, Badge, Spinner, Text, Textarea, Image,
  Tabs, TabList, TabPanels, Tab, TabPanel, Link, SimpleGrid
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const [ekskuls, setEkskuls] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [berita, setBerita] = useState([]); 

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({}); 
  const [fileGambar, setFileGambar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    // 1. Ekskul
    const { data: dEkskul } = await supabase.from('ekskuls').select('*').order('id', { ascending: true });
    if (dEkskul) setEkskuls(dEkskul);

    const { data: dPendaftar } = await supabase.from('pendaftar').select('*').order('created_at', { ascending: false });
    if (dPendaftar) setPendaftar(dPendaftar);

    const { data: dBerita } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
    if (dBerita) setBerita(dBerita);
  };
  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFileGambar(e.target.files[0]);
  };

  const uploadImage = async (file, bucket = 'ekskul-storage') => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };


  const handleSave = async () => {
    setUploading(true);
    try {
      let imageUrl = formData.img;
      if (fileGambar) imageUrl = await uploadImage(fileGambar); 

      if (modalType === "EKSKUL") {
        const payload = { 
          nama: formData.nama, kateg: formData.kateg, jadwal: formData.jadwal, 
          desc: formData.desc, img: imageUrl 
        };
        if (isEditing) await supabase.from('ekskuls').update(payload).eq('id', formData.id);
        else await supabase.from('ekskuls').insert([payload]);
      
      } else if (modalType === "BERITA") {
        const payload = {
          judul: formData.judul, konten: formData.konten, tanggal: formData.tanggal,
          gambar: imageUrl 
        };
        if (isEditing) await supabase.from('berita').update(payload).eq('id', formData.id);
        else await supabase.from('berita').insert([payload]);
      }

      toast({ title: "Berhasil disimpan", status: "success" });
      fetchData();
      onClose();
    } catch (error) {
      toast({ title: "Gagal", description: error.message, status: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      await supabase.from(table).delete().eq('id', id);
      toast({ title: "Terhapus", status: "success" });
      fetchData();
    }
  };

  const openAddEkskul = () => {
    setModalType("EKSKUL"); setIsEditing(false); setFileGambar(null);
    setFormData({ nama: "", kateg: "Olahraga", jadwal: "", desc: "", img: "" });
    onOpen();
  };
  const openEditEkskul = (item) => {
    setModalType("EKSKUL"); setIsEditing(true); setFileGambar(null);
    setFormData(item);
    onOpen();
  };

  const openAddBerita = () => {
    setModalType("BERITA"); setIsEditing(false); setFileGambar(null);
    setFormData({ judul: "", konten: "", tanggal: new Date().toISOString().split('T')[0], img: "" });
    onOpen();
  };
  const openEditBerita = (item) => {
    setModalType("BERITA"); setIsEditing(true); setFileGambar(null);
    setFormData({ ...item, img: item.gambar });
    onOpen();
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/login");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="#0A2D5E" py={4} px={4} shadow="md" position="sticky" top="0" zIndex="999">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="md" color="white" fontFamily="'Poppins', sans-serif">Admin Dashboard</Heading>
            <Flex gap={3}>
              <Button leftIcon={<ExternalLinkIcon />} size="sm" variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} onClick={() => navigate("/")}>
                Lihat Web
              </Button>
              <Button size="sm" colorScheme="red" onClick={handleLogout}>Logout</Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Tabs variant="enclosed" colorScheme="blue" isLazy>
          <TabList mb={6}>
            <Tab fontWeight="bold">🏫 Data Ekskul</Tab>
            <Tab fontWeight="bold">📰 Berita & Lomba</Tab>
            <Tab fontWeight="bold">📝 Data Pendaftar <Badge ml={2} colorScheme="red">{pendaftar.length}</Badge></Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <Flex justify="end" mb={4}>
                <Button leftIcon={<AddIcon />} bg="#FDC800" color="#0A2D5E" onClick={openAddEkskul}>Tambah Ekskul</Button>
              </Flex>
              <Box bg="white" borderRadius="xl" shadow="sm" overflowX="auto" border="1px solid" borderColor="gray.200">
                <Table variant="simple">
                  <Thead bg="gray.50"><Tr><Th>Nama</Th><Th>Kategori</Th><Th>Aksi</Th></Tr></Thead>
                  <Tbody>
                    {ekskuls.map((item) => (
                      <Tr key={item.id}>
                        <Td fontWeight="bold">{item.nama}</Td>
                        <Td><Badge>{item.kateg}</Badge></Td>
                        <Td>
                          <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => openEditEkskul(item)} />
                          <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete('ekskuls', item.id)} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel p={0}>
              <Flex justify="space-between" align="center" mb={6}>
                <Text color="gray.500">Upload dokumentasi kegiatan atau info lomba di sini.</Text>
                <Button leftIcon={<AddIcon />} colorScheme="green" onClick={openAddBerita}>Buat Berita</Button>
              </Flex>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {berita.map((item) => (
                  <Box key={item.id} bg="white" p={4} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                    <Image src={item.gambar || "https://via.placeholder.com/300"} h="150px" w="100%" objectFit="cover" borderRadius="md" mb={3} />
                    <Text fontSize="xs" color="gray.500">{item.tanggal}</Text>
                    <Heading size="sm" my={2} noOfLines={2}>{item.judul}</Heading>
                    <Text fontSize="sm" color="gray.600" noOfLines={3} mb={4}>{item.konten}</Text>
                    <Flex gap={2}>
                      <Button size="xs" leftIcon={<EditIcon />} w="full" onClick={() => openEditBerita(item)}>Edit</Button>
                      <Button size="xs" colorScheme="red" icon={<DeleteIcon />} onClick={() => handleDelete('berita', item.id)}>Hapus</Button>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel p={0}>
              <Box bg="white" borderRadius="xl" shadow="sm" overflowX="auto" border="1px solid" borderColor="gray.200">
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50"><Tr><Th>Nama</Th><Th>Kelas</Th><Th>Ekskul</Th><Th>WA</Th><Th>Aksi</Th></Tr></Thead>
                  <Tbody>
                    {pendaftar.map((item) => (
                      <Tr key={item.id}>
                        <Td fontWeight="bold">{item.nama}</Td>
                        <Td>{item.kelas}</Td>
                        <Td>{item.ekskul}</Td>
                        <Td><Link href={`https://wa.me/${item.no_wa}`} isExternal color="blue.500">{item.no_wa}</Link></Td>
                        <Td><IconButton icon={<DeleteIcon />} size="xs" colorScheme="red" onClick={() => handleDelete('pendaftar', item.id)} /></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalType === "EKSKUL" ? "Form Ekskul" : "Form Berita / Kegiatan"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
            {modalType === "EKSKUL" ? (
              <>
                <FormControl mb={3}><FormLabel>Nama</FormLabel><Input value={formData.nama} onChange={(e)=>setFormData({...formData, nama: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Kategori</FormLabel>
                  <Select value={formData.kateg} onChange={(e)=>setFormData({...formData, kateg: e.target.value})}>
                    <option>Olahraga</option><option>Seni</option><option>Multimedia</option><option>Wajib</option>
                  </Select>
                </FormControl>
                <FormControl mb={3}><FormLabel>Jadwal</FormLabel><Input value={formData.jadwal} onChange={(e)=>setFormData({...formData, jadwal: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Deskripsi</FormLabel><Textarea value={formData.desc} onChange={(e)=>setFormData({...formData, desc: e.target.value})} /></FormControl>
              </>
            ) : (
              <>
                <FormControl mb={3}><FormLabel>Judul Kegiatan</FormLabel><Input value={formData.judul} onChange={(e)=>setFormData({...formData, judul: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Tanggal</FormLabel><Input type="date" value={formData.tanggal} onChange={(e)=>setFormData({...formData, tanggal: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Konten Berita</FormLabel><Textarea rows={5} value={formData.konten} onChange={(e)=>setFormData({...formData, konten: e.target.value})} /></FormControl>
              </>
            )}

            <FormControl mb={3}>
              <FormLabel>Gambar</FormLabel>
              <Input type="file" p={1} onChange={handleFileChange} />
              {formData.img && !fileGambar && <Text fontSize="xs" mt={1} color="blue.500">Gambar tersimpan ada.</Text>}
            </FormControl>

            <Button w="100%" colorScheme="blue" onClick={handleSave} isLoading={uploading}>Simpan</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}