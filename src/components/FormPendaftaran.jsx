import { useState } from "react";
import { Box, Heading, Text, Button, Input, Select, Textarea, VStack, FormControl, FormLabel, SimpleGrid, Container, useToast } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

export default function FormPendaftaran() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    ekskul: "",
    no_wa: "",
    alasan: ""
  });
  const [fileBukti, setFileBukti] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileBukti(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.kelas || !form.ekskul || !form.no_wa) {
      toast({ title: "Harap lengkapi data wajib", status: "warning" });
      return;
    }

    setLoading(true);

    try {
      let buktiUrl = "";

      if (fileBukti) {
        const fileName = `bukti-${Date.now()}-${fileBukti.name}`;
        const { error: uploadError } = await supabase.storage
          .from('ekskul-storage')
          .upload(fileName, fileBukti);
        
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('ekskul-storage').getPublicUrl(fileName);
        buktiUrl = data.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('pendaftar') 
        .insert([{ 
          nama: form.nama, 
          kelas: form.kelas, 
          ekskul: form.ekskul, 
          no_wa: form.no_wa, 
          alasan: form.alasan,
          bukti_img: buktiUrl 
        }]);

      if (dbError) {
        console.error(dbError);
        toast({ title: "Pendaftaran Terkirim (Simulasi)", description: "Data belum masuk DB karena tabel 'pendaftar' belum dibuat.", status: "info" });
      } else {
        toast({ title: "Pendaftaran Berhasil!", status: "success" });
        setForm({ nama: "", kelas: "", ekskul: "", no_wa: "", alasan: "" });
        setFileBukti(null);
      }

    } catch (error) {
      toast({ title: "Gagal Mendaftar", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={20} bg="#f4f7fa" id="pendaftaran">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="start">
          <Box pt={10}>
            <Heading as="h3" size="xl" color="#0A2D5E" mb={6}>Siap Bergabung?</Heading>
            <Text color="gray.600" mb={6}>Pilih ekstrakurikuler yang kamu minati dan daftarkan dirimu sekarang.</Text>
            <Box p={6} bg="#0A2D5E" borderRadius="lg" color="white">
              <Text fontWeight="bold" color="#FDC800">Catatan Penting:</Text>
              <Text fontSize="sm">Pastikan nomor WhatsApp aktif.</Text>
            </Box>
          </Box>

          <Box bg="white" p={8} borderRadius="xl" boxShadow="lg">
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Nama Lengkap</FormLabel>
                <Input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama Siswa" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Kelas</FormLabel>
                <Input name="kelas" value={form.kelas} onChange={handleChange} placeholder="Kelas" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Ekskul Pilihan</FormLabel>
                <Input name="ekskul" value={form.ekskul} onChange={handleChange} placeholder="Nama Ekskul" type="text" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Nomor WA</FormLabel>
                <Input name="no_wa" value={form.no_wa} onChange={handleChange} placeholder="08xxxxxxxxxx" type="tel" />
              </FormControl>

              <FormControl>
                <FormLabel>Alasan Bergabung</FormLabel>
                <Textarea name="alasan" value={form.alasan} onChange={handleChange} placeholder="Ceritakan motivasimu..." />
              </FormControl>

              <FormControl>
                <FormLabel>Upload Bukti (Opsional)</FormLabel>
                <Input type="file" pt={1} onChange={handleFileChange} accept="image/*" />
              </FormControl>

              <Button 
                w="100%" size="lg" bg="#FDC800" color="#0A2D5E" fontWeight="bold" _hover={{ bg: "#eabf00" }}
                onClick={handleSubmit}
                isLoading={loading}
                loadingText="Mengirim..."
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