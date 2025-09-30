import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Barang {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
}

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function BarangScreen() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBarangs = async () => {
    try {
      const res = await axios.get("http://192.168.1.8:8000/api/barangs");
      setBarangs(res.data.data || []);
    } catch (error) {
      console.error("Gagal fetch barang:", error);
      Alert.alert("Error", "Gagal mengambil data barang");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Konfirmasi", "Yakin hapus barang ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.1.8:8000/api/barangs/${id}`);
            fetchBarangs();
          } catch (error) {
            console.error("Gagal hapus barang:", error);
            Alert.alert("Error", "Gagal hapus barang");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBarangs();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Barang; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { width: 40 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { width: 120 }]}>{item.nama}</Text>
      <Text style={[styles.cell, { width: 100 }]}>{item.kategori}</Text>
      <Text style={[styles.cell, { width: 120 }]}>
        {formatRupiah(item.harga)}
      </Text>
      <View style={[styles.actionCell]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#007AFF" }]}
          onPress={() => router.push(`/barang/ubah-barang?id=${item.id}`)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30" }]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: "#34C759", marginBottom: 10 },
        ]}
        onPress={() => router.push("/barang/tambah-barang")}
      >
        <Text style={styles.btnTextAdd}>+ Tambah Barang</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Daftar Barang</Text>

      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.headerCell, { width: 40 }]}>No</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Nama</Text>
            <Text style={[styles.headerCell, { width: 100 }]}>Kategori</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Harga</Text>
            <Text style={[styles.headerCell, { width: 150 }]}>Aksi</Text>
          </View>

          <FlatList
            data={barangs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.empty}>Tidak ada data barang.</Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  header: { backgroundColor: "#E5E7EB", borderRadius: 6, marginBottom: 6 },
  cell: { fontSize: 14, color: "#374151" },
  headerCell: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  button: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  btnText: { color: "white", fontSize: 12 },
  btnTextAdd: { color: "white", fontSize: 16 },
  empty: { textAlign: "center", padding: 20, color: "#6B7280" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  actionCell: { width: 150, flexDirection: "row", gap: 6 },
});
