import api from "@/lib/api";
import { Picker } from "@react-native-picker/picker";
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

export default function TambahBarang() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("RT");
  const [harga, setHarga] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nama.trim() || !harga.trim()) {
      Alert.alert("Validasi", "Nama dan Harga wajib diisi");
      return;
    }
    try {
      setLoading(true);
      await api.post("/barangs", {
        nama,
        kategori,
        harga: parseInt(harga, 10),
      });
      Alert.alert("Sukses", "Barang berhasil ditambahkan", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Gagal tambah barang:", error);
      Alert.alert("Error", "Gagal menambahkan barang");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Barang</Text>

      <Text style={styles.label}>Nama</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama"
        value={nama}
        onChangeText={setNama}
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={kategori} onValueChange={setKategori}>
          <Picker.Item label="Rumah Tangga" value="RT" />
          <Picker.Item label="Alat Tulis Kantor" value="ATK" />
          <Picker.Item label="Elektronik" value="ELEKTRONIK" />
          <Picker.Item label="Peralatan Masak" value="MASAK" />
        </Picker>
      </View>

      <Text style={styles.label}>Harga</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan harga"
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
      />

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
