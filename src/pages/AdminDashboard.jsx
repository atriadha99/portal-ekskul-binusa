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
  const [users, setUsers] = useState([]); // State Users
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(""); // Tipe Modal: EKSKUL, BERITA, atau USER
  const [formData, setFormData] = useState({}); 
  const [fileGambar, setFileGambar] = useState(null); // State file upload
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem("userRole"); // Cek Role Admin yang login

  // --- 1. FETCH DATA DARI SUPABASE ---
  const fetchData = async () => {
    setLoading(true);
    
    // Ambil Data Ekskul
    const { data: dEkskul } = await supabase.from('ekskuls').select('*').order('id', { ascending: true });
    if (dEkskul) setEkskuls(dEkskul);

    // Ambil Data Pendaftar
    const { data: dPendaftar } = await supabase.from('pendaftar').select('*').order('created_at', { ascending: false });
    if (dPendaftar) setPendaftar(dPendaftar);

    // Ambil Data Berita
    const { data: dBerita } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
    if (dBerita) setBerita(dBerita);

    // Ambil Data User (Hanya jika admin)
    const { data: dUsers } = await supabase.from('users').select('*, ekskuls(nama)').order('id', { ascending: true });
    if (dUsers) setUsers(dUsers);

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. FUNGSI UPLOAD GAMBAR ---
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFileGambar(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    // Upload ke bucket 'ekskul-storage'
    const { error } = await supabase.storage.from('ekskul-storage').upload(fileName, file);
    if (error) throw error;
    
    // Ambil URL Publik
    const { data } = supabase.storage.from('ekskul-storage').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // --- 3. HANDLE SIMPAN DATA (CREATE / UPDATE) ---
  const handleSave = async () => {
    setUploading(true);
    try {
      let imageUrl = formData.img; // Default pakai URL lama
      if (fileGambar) {
        imageUrl = await uploadImage(fileGambar); // Upload file baru jika ada
      }

      if (modalType === "EKSKUL") {
        const payload = { 
          nama: formData.nama, 
          kateg: formData.kateg, 
          jadwal: formData.jadwal, 
          desc: formData.desc, 
          img: imageUrl 
        };
        if (isEditing) await supabase.from('ekskuls').update(payload).eq('id', formData.id);
        else await supabase.from('ekskuls').insert([payload]);
      
      } else if (modalType === "BERITA") {
        const payload = { 
          judul: formData.judul, 
          konten: formData.konten, 
          tanggal: formData.tanggal, 
          gambar: imageUrl 
        };
        if (isEditing) await supabase.from('berita').update(payload).eq('id', formData.id);
        else await supabase.from('berita').insert([payload]);

      } else if (modalType === "USER") {
        const payload = { 
          username: formData.username, 
          password: formData.password, 
          nama_lengkap: formData.nama_lengkap, 
          role: formData.role,
          ekskul_id: formData.ekskul_id ? parseInt(formData.ekskul_id) : null
        };
        if (isEditing) await supabase.from('users').update(payload).eq('id', formData.id);
        else await supabase.from('users').insert([payload]);
      }

      toast({ title: "Berhasil disimpan", status: "success" });
      fetchData(); // Refresh data tabel
      onClose();   // Tutup modal
    } catch (error) {
      toast({ title: "Gagal menyimpan", description: error.message, status: "error" });
    } finally {
      setUploading(false);
    }
  };

  // --- 4. HANDLE DELETE ---
  const handleDelete = async (table, id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      await supabase.from(table).delete().eq('id', id);
      toast({ title: "Data terhapus", status: "success" });
      fetchData();
    }
  };

  // --- 5. SETUP MODAL TRIGGERS ---
  const openAddEkskul = () => { setModalType("EKSKUL"); setIsEditing(false); setFileGambar(null); setFormData({ nama: "", kateg: "Olahraga", jadwal: "", desc: "", img: "" }); onOpen(); };
  const openEditEkskul = (item) => { setModalType("EKSKUL"); setIsEditing(true); setFileGambar(null); setFormData(item); onOpen(); };

  const openAddBerita = () => { setModalType("BERITA"); setIsEditing(false); setFileGambar(null); setFormData({ judul: "", konten: "", tanggal: new Date().toISOString().split('T')[0], img: "" }); onOpen(); };
  const openEditBerita = (item) => { setModalType("BERITA"); setIsEditing(true); setFileGambar(null); setFormData({ ...item, img: item.gambar }); onOpen(); };

  const openAddUser = () => { setModalType("USER"); setIsEditing(false); setFormData({ username: "", password: "", nama_lengkap: "", role: "pembina", ekskul_id: "" }); onOpen(); };
  const openEditUser = (item) => { setModalType("USER"); setIsEditing(true); setFormData(item); onOpen(); };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* HEADER DASHBOARD */}
      <Box bg="#0A2D5E" py={4} px={4} shadow="md" position="sticky" top="0" zIndex="999">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="md" color="white" fontFamily="'Poppins', sans-serif">
              Dashboard {localStorage.getItem("userRole")?.toUpperCase()}
            </Heading>
            <Flex gap={3}>
              <Button leftIcon={<ExternalLinkIcon />} size="sm" variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} onClick={() => navigate("/")}>
                Lihat Web
              </Button>
              <Button size="sm" colorScheme="red" onClick={handleLogout}>Logout</Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* KONTEN TABS */}
      <Container maxW="container.xl" py={8}>
        <Tabs variant="enclosed" colorScheme="blue" isLazy>
          <TabList mb={6} overflowX="auto">
            <Tab fontWeight="bold">🏫 Data Ekskul</Tab>
            <Tab fontWeight="bold">📰 Berita</Tab>
            <Tab fontWeight="bold">📝 Pendaftar <Badge ml={2} colorScheme="red">{pendaftar.length}</Badge></Tab>
            {/* Tab User hanya muncul jika login sebagai ADMIN */}
            {currentUserRole === 'admin' && <Tab fontWeight="bold">👥 Akun Pengguna</Tab>}
          </TabList>

          <TabPanels>
            
            {/* TAB 1: EKSKUL */}
            <TabPanel p={0}>
              <Flex justify="end" mb={4}>
                <Button leftIcon={<AddIcon />} bg="#FDC800" color="#0A2D5E" onClick={openAddEkskul}>Tambah Ekskul</Button>
              </Flex>
              <Box bg="white" borderRadius="xl" shadow="sm" overflowX="auto">
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

            {/* TAB 2: BERITA */}
            <TabPanel p={0}>
              <Flex justify="end" mb={4}>
                <Button leftIcon={<AddIcon />} colorScheme="green" onClick={openAddBerita}>Buat Berita</Button>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {berita.map((item) => (
                  <Box key={item.id} bg="white" p={4} borderRadius="lg" shadow="sm">
                    <Image src={item.gambar || "https://via.placeholder.com/300"} h="150px" w="100%" objectFit="cover" borderRadius="md" mb={3} />
                    <Heading size="sm" mb={2} noOfLines={2}>{item.judul}</Heading>
                    <Text fontSize="xs" color="gray.500" mb={3}>{item.tanggal}</Text>
                    <Flex gap={2}>
                      <Button size="xs" w="full" onClick={() => openEditBerita(item)}>Edit</Button>
                      <Button size="xs" colorScheme="red" onClick={() => handleDelete('berita', item.id)}>Hapus</Button>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* TAB 3: PENDAFTAR */}
            <TabPanel p={0}>
              <Box bg="white" borderRadius="xl" shadow="sm" overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50"><Tr><Th>Nama</Th><Th>Kelas</Th><Th>Ekskul</Th><Th>WA</Th><Th>Aksi</Th></Tr></Thead>
                  <Tbody>
                    {pendaftar.map((item) => (
                      <Tr key={item.id}>
                        <Td fontWeight="bold">{item.nama}</Td>
                        <Td>{item.kelas}</Td>
                        <Td>{item.ekskul}</Td>
                        <Td>
                          <Link href={`https://wa.me/${item.no_wa}`} isExternal color="blue.500">{item.no_wa}</Link>
                        </Td>
                        <Td>
                          <IconButton icon={<DeleteIcon />} size="xs" colorScheme="red" onClick={() => handleDelete('pendaftar', item.id)} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            {/* TAB 4: MANAJEMEN USER */}
            {currentUserRole === 'admin' && (
              <TabPanel p={0}>
                <Flex justify="space-between" mb={6}>
                  <Text color="gray.500">Kelola akun Guru Pembina & Ketua Ekskul.</Text>
                  <Button leftIcon={<AddIcon />} colorScheme="purple" onClick={openAddUser}>Tambah User</Button>
                </Flex>
                <Box bg="white" borderRadius="xl" shadow="sm" overflowX="auto">
                  <Table variant="simple">
                    <Thead bg="gray.50"><Tr><Th>Nama Lengkap</Th><Th>Username</Th><Th>Role</Th><Th>Aksi</Th></Tr></Thead>
                    <Tbody>
                      {users.map((item) => (
                        <Tr key={item.id}>
                          <Td fontWeight="bold">{item.nama_lengkap}</Td>
                          <Td>{item.username}</Td>
                          <Td>
                            <Badge colorScheme={item.role === 'admin' ? 'red' : item.role === 'pembina' ? 'blue' : 'green'}>
                              {item.role}
                            </Badge>
                          </Td>
                          <Td>
                            <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => openEditUser(item)} />
                            <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete('users', item.id)} />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            )}

          </TabPanels>
        </Tabs>
      </Container>

      {/* MODAL FORM DINAMIS (SATU MODAL UTK SEMUA) */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === "EKSKUL" ? "Form Ekskul" : modalType === "BERITA" ? "Form Berita" : "Form User"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
            {/* FORM EKSKUL */}
            {modalType === "EKSKUL" && (
              <>
                <FormControl mb={3}><FormLabel>Nama Ekskul</FormLabel><Input value={formData.nama} onChange={(e)=>setFormData({...formData, nama: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Kategori</FormLabel>
                  <Select value={formData.kateg} onChange={(e)=>setFormData({...formData, kateg: e.target.value})}>
                    <option>Olahraga</option><option>Seni</option><option>Multimedia</option><option>Wajib</option><option>Disiplin</option>
                  </Select>
                </FormControl>
                <FormControl mb={3}><FormLabel>Jadwal</FormLabel><Input value={formData.jadwal} onChange={(e)=>setFormData({...formData, jadwal: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Deskripsi</FormLabel><Textarea value={formData.desc} onChange={(e)=>setFormData({...formData, desc: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Upload Gambar</FormLabel><Input type="file" p={1} onChange={handleFileChange} /></FormControl>
              </>
            )}

            {/* FORM BERITA */}
            {modalType === "BERITA" && (
              <>
                <FormControl mb={3}><FormLabel>Judul Berita</FormLabel><Input value={formData.judul} onChange={(e)=>setFormData({...formData, judul: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Tanggal</FormLabel><Input type="date" value={formData.tanggal} onChange={(e)=>setFormData({...formData, tanggal: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Konten</FormLabel><Textarea rows={5} value={formData.konten} onChange={(e)=>setFormData({...formData, konten: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Upload Gambar</FormLabel><Input type="file" p={1} onChange={handleFileChange} /></FormControl>
              </>
            )}

            {/* FORM USER */}
            {modalType === "USER" && (
              <>
                <FormControl mb={3}><FormLabel>Nama Lengkap</FormLabel><Input value={formData.nama_lengkap} onChange={(e)=>setFormData({...formData, nama_lengkap: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Username</FormLabel><Input value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} /></FormControl>
                <FormControl mb={3}><FormLabel>Password</FormLabel><Input value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} placeholder={isEditing ? "(Kosongkan jika tidak ubah)" : ""} /></FormControl>
                <FormControl mb={3}><FormLabel>Role</FormLabel>
                  <Select value={formData.role} onChange={(e)=>setFormData({...formData, role: e.target.value})}>
                    <option value="admin">Admin</option>
                    <option value="pembina">Guru Pembina</option>
                    <option value="ketua">Ketua Ekskul</option>
                  </Select>
                </FormControl>
                <FormControl mb={3}><FormLabel>Pegang Ekskul Apa? (Opsional)</FormLabel>
                  <Select value={formData.ekskul_id} onChange={(e)=>setFormData({...formData, ekskul_id: e.target.value})} placeholder="-- Pilih Ekskul --">
                    {ekskuls.map(e => <option key={e.id} value={e.id}>{e.nama}</option>)}
                  </Select>
                </FormControl>
              </>
            )}

            <Button w="100%" colorScheme="blue" onClick={handleSave} isLoading={uploading}>
              Simpan Data
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}