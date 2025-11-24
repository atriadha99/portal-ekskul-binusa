import { useState, useEffect } from "react";
import {
  Box, Flex, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, FormControl, FormLabel, Input, Select, useToast, Container, Badge, Spinner, Text, Textarea, Image,
  Tabs, TabList, TabPanels, Tab, TabPanel, Link
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const [ekskuls, setEkskuls] = useState([]);
  const [pendaftar, setPendaftar] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ id: "", nama: "", kateg: "", jadwal: "", desc: "", img: "" });
  const [fileGambar, setFileGambar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    
    const { data: dataEkskul, error: errEkskul } = await supabase
      .from('ekskuls')
      .select('*')
      .order('id', { ascending: true });
    
    if (!errEkskul) setEkskuls(dataEkskul);

    const { data: dataPendaftar, error: errPendaftar } = await supabase
      .from('pendaftar')
      .select('*')
      .order('created_at', { ascending: false });

    if (!errPendaftar) setPendaftar(dataPendaftar);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) setFileGambar(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    const fileName = `ekskul-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('ekskul-storage').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('ekskul-storage').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveEkskul = async () => {
    if (!formData.nama || !formData.kateg) {
      toast({ title: "Data tidak lengkap", status: "warning" });
      return;
    }
    setUploading(true);
    try {
      let imageUrl = formData.img;
      if (fileGambar) imageUrl = await uploadImage(fileGambar);

      const payload = { 
        nama: formData.nama, 
        kateg: formData.kateg, 
        jadwal: formData.jadwal, 
        desc: formData.desc,
        img: imageUrl 
      };

      if (isEditing) {
        await supabase.from('ekskuls').update(payload).eq('id', formData.id);
        toast({ title: "Ekskul diupdate", status: "success" });
      } else {
        await supabase.from('ekskuls').insert([payload]);
        toast({ title: "Ekskul ditambah", status: "success" });
      }
      fetchData();
      onClose();
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEkskul = async (id) => {
    if (window.confirm("Hapus ekskul ini?")) {
      await supabase.from('ekskuls').delete().eq('id', id);
      fetchData();
      toast({ title: "Terhapus", status: "success" });
    }
  };

  const prepareEdit = (item) => {
    setFormData(item); setFileGambar(null); setIsEditing(true); onOpen();
  };
  const prepareAdd = () => {
    setFormData({ id: "", nama: "", kateg: "Olahraga", jadwal: "", desc: "", img: "" }); 
    setFileGambar(null); setIsEditing(false); onOpen();
  };

  const handleDeletePendaftar = async (id) => {
    if (window.confirm("Hapus data pendaftar ini?")) {
      const { error } = await supabase.from('pendaftar').delete().eq('id', id);
      if (!error) {
        toast({ title: "Data pendaftar dihapus", status: "success" });
        fetchData();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/login");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* HEADER */}
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
            <Tab fontWeight="bold">📝 Data Pendaftar <Badge ml={2} colorScheme="red">{pendaftar.length}</Badge></Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <Flex justify="space-between" mb={6}>
                <Heading size="md" color="gray.700">List Ekstrakurikuler</Heading>
                <Button leftIcon={<AddIcon />} bg="#FDC800" color="#0A2D5E" _hover={{ bg: "#eabf00" }} onClick={prepareAdd}>
                  Tambah Ekskul
                </Button>
              </Flex>

              <Box bg="white" borderRadius="xl" shadow="sm" overflowX="auto" border="1px solid" borderColor="gray.200">
                <Table variant="simple">
                  <Thead bg="gray.50"><Tr><Th>Gambar</Th><Th>Nama</Th><Th>Kategori</Th><Th>Jadwal</Th><Th>Aksi</Th></Tr></Thead>
                  <Tbody>
                    {loading ? <Tr><Td colSpan={5} textAlign="center"><Spinner /></Td></Tr> : 
                     ekskuls.map((item) => (
                      <Tr key={item.id}>
                        <Td><Image src={item.img || "https://via.placeholder.com/50"} boxSize="40px" borderRadius="md" objectFit="cover" /></Td>
                        <Td fontWeight="bold">{item.nama}</Td>
                        <Td><Badge>{item.kateg}</Badge></Td>
                        <Td>{item.jadwal}</Td>
                        <Td>
                          <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => prepareEdit(item)} />
                          <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDeleteEkskul(item.id)} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel p={0}>
              <Heading size="md" mb={6} color="gray.700">Masuk Pendaftaran</Heading>
              
              <Box bg="white" borderRadius="xl" shadow="sm" overflowX="auto" border="1px solid" borderColor="gray.200">
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Tanggal</Th>
                      <Th>Nama Siswa</Th>
                      <Th>Kelas</Th>
                      <Th>Pilihan Ekskul</Th>
                      <Th>No WA</Th>
                      <Th>Bukti</Th>
                      <Th>Aksi</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {loading ? <Tr><Td colSpan={7} textAlign="center"><Spinner /></Td></Tr> : 
                     pendaftar.length === 0 ? <Tr><Td colSpan={7} textAlign="center" py={8}>Belum ada pendaftar.</Td></Tr> :
                     pendaftar.map((item) => (
                      <Tr key={item.id} _hover={{ bg: "blue.50" }}>
                        <Td fontSize="xs" color="gray.500">
                          {new Date(item.created_at).toLocaleDateString("id-ID")}
                        </Td>
                        <Td fontWeight="bold">{item.nama}</Td>
                        <Td>{item.kelas}</Td>
                        <Td><Badge colorScheme="green">{item.ekskul}</Badge></Td>
                        <Td>
                          <Link href={`https://wa.me/${item.no_wa}`} isExternal color="blue.500" fontSize="sm">
                            {item.no_wa} <ExternalLinkIcon mx="2px" />
                          </Link>
                        </Td>
                        <Td>
                          {item.bukti_img ? (
                            <Link href={item.bukti_img} isExternal>
                              <Button size="xs" colorScheme="purple" variant="outline">Lihat Foto</Button>
                            </Link>
                          ) : <Text fontSize="xs" color="gray.400">-</Text>}
                        </Td>
                        <Td>
                          <IconButton 
                            icon={<DeleteIcon />} 
                            size="xs" 
                            colorScheme="red" 
                            variant="ghost"
                            onClick={() => handleDeletePendaftar(item.id)} 
                          />
                        </Td>
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
          <ModalHeader>{isEditing ? "Edit Ekskul" : "Tambah Ekskul"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3}><FormLabel>Nama</FormLabel><Input value={formData.nama} onChange={(e)=>setFormData({...formData, nama: e.target.value})} /></FormControl>
            <FormControl mb={3}><FormLabel>Kategori</FormLabel>
              <Select value={formData.kateg} onChange={(e)=>setFormData({...formData, kateg: e.target.value})}>
                <option value="Olahraga">Olahraga</option><option value="Seni">Seni</option><option value="Multimedia">Multimedia</option><option value="Akademik">Akademik</option>
              </Select>
            </FormControl>
            <FormControl mb={3}><FormLabel>Jadwal</FormLabel><Input value={formData.jadwal} onChange={(e)=>setFormData({...formData, jadwal: e.target.value})} /></FormControl>
            <FormControl mb={3}><FormLabel>Deskripsi</FormLabel><Textarea value={formData.desc} onChange={(e)=>setFormData({...formData, desc: e.target.value})} /></FormControl>
            <FormControl mb={3}>
              <FormLabel>Gambar</FormLabel>
              <Input type="file" p={1} onChange={handleFileChange} />
              {formData.img && !fileGambar && <Text fontSize="xs" mt={1}>Gambar lama: <Link href={formData.img} isExternal color="blue.500">Lihat</Link></Text>}
            </FormControl>
            <Button w="100%" colorScheme="blue" onClick={handleSaveEkskul} isLoading={uploading}>Simpan</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}