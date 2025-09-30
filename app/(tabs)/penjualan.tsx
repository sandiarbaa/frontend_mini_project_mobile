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
  harga: string;
}

interface ItemPenjualan {
  id: number;
  penjualan_id: number;
  barang_id: number;
  qty: number;
  barang: Barang;
}

interface Pelanggan {
  id: number;
  nama: string;
  domisili: string;
  jenis_kelamin: string;
}

interface Penjualan {
  id: number;
  tgl: string;
  subtotal: string;
  pelanggan: Pelanggan;
  item_penjualans: ItemPenjualan[];
}

export default function TampilPenjualan() {
  const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPenjualans = async () => {
    try {
      const res = await axios.get("http://192.168.1.8:8000/api/penjualans");
      setPenjualans(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil penjualan:", err);
      Alert.alert("Error", "Gagal mengambil data penjualan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Konfirmasi", "Yakin hapus penjualan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.1.8:8000/api/penjualans/${id}`);
            fetchPenjualans();
          } catch (error) {
            console.error("Gagal hapus penjualan:", error);
            Alert.alert("Error", "Gagal hapus penjualan");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPenjualans();
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

  const renderItem = ({ item, index }: { item: Penjualan; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { width: 40 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { width: 100 }]}>{item.tgl}</Text>
      <Text style={[styles.cell, { width: 120 }]}>{item.pelanggan?.nama}</Text>

      <View style={[styles.cellStyle, { width: 150 }]}>
        {item.item_penjualans && item.item_penjualans.length > 0 ? (
          item.item_penjualans.map((i, idx) => (
            <Text key={idx} style={styles.cell}>
              {i.barang?.nama ?? "Barang"} ({i.qty})
            </Text>
          ))
        ) : (
          <Text style={styles.cell}>-</Text>
        )}
      </View>

      <View style={styles.actionCell}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#007AFF" }]}
          onPress={() => router.push(`/penjualan/ubah-penjualan?id=${item.id}`)}
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
        onPress={() => router.push("/penjualan/tambah-penjualan")}
      >
        <Text style={styles.btnTextAdd}>+ Tambah Penjualan</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Daftar Penjualan</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          {/* Header */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.headerCell, { width: 40 }]}>No</Text>
            <Text style={[styles.headerCell, { width: 100 }]}>Tanggal</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Pelanggan</Text>
            <Text style={[styles.headerCell, { width: 80 }]}>Items</Text>
            <Text style={[styles.headerCell, { width: 150 }]}>Aksi</Text>
          </View>

          {/* Data */}
          <FlatList
            data={penjualans}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.empty}>Tidak ada data penjualan.</Text>
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
  header: {
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 6,
  },
  cellStyle: { justifyContent: "flex-start", paddingRight: 4 },
  cell: { fontSize: 14, color: "#374151" },
  headerCell: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  button: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  btnText: { color: "white", fontSize: 12 },
  btnTextAdd: { color: "white", fontSize: 16 },
  empty: { textAlign: "center", padding: 20, color: "#6B7280" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  actionCell: {
    width: 150,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 6,
  },
});
