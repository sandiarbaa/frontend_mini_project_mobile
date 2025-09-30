import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TambahPelanggan() {
  const [nama, setNama] = useState("");
  const [domisili, setDomisili] = useState("JAK-UT");
  const [jenisKelamin, setJenisKelamin] = useState("PRIA");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nama.trim()) {
      Alert.alert("Validasi", "Nama wajib diisi");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://192.168.1.8:8000/api/pelanggans", {
        nama,
        domisili,
        jenis_kelamin: jenisKelamin,
      });
      Alert.alert("Sukses", "Pelanggan berhasil ditambahkan", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Gagal tambah pelanggan:", error);
      Alert.alert("Error", "Gagal menambahkan pelanggan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Pelanggan</Text>

      <Text style={styles.label}>Nama</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama"
        value={nama}
        onChangeText={setNama}
      />

      <Text style={styles.label}>Domisili</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={domisili} onValueChange={setDomisili}>
          <Picker.Item label="Jakarta Utara" value="JAK-UT" />
          <Picker.Item label="Jakarta Timur" value="JAK-TIM" />
          <Picker.Item label="Jakarta Selatan" value="JAK-SEL" />
          <Picker.Item label="Jakarta Barat" value="JAK-BAR" />
        </Picker>
      </View>

      <Text style={styles.label}>Jenis Kelamin</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={jenisKelamin} onValueChange={setJenisKelamin}>
          <Picker.Item label="Pria" value="PRIA" />
          <Picker.Item label="Wanita" value="WANITA" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E3A8A",
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#1E40AF" },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
