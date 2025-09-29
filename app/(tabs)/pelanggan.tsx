import api from "@/lib/api";
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

interface Pelanggan {
  id: number;
  nama: string;
  domisili: string;
  jenis_kelamin: string;
}

export default function PelangganScreen() {
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPelanggans = async () => {
    try {
      const res = await api.get("/pelanggans");
      setPelanggans(res.data.data || []);
    } catch (error) {
      console.error("Gagal fetch pelanggan:", error);
      Alert.alert("Error", "Gagal mengambil data pelanggan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Konfirmasi", "Yakin hapus pelanggan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/pelanggans/${id}`);
            fetchPelanggans(); // refresh data setelah delete
          } catch (error) {
            console.error("Gagal hapus pelanggan:", error);
            Alert.alert("Error", "Gagal hapus pelanggan");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPelanggans();
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

  const renderItem = ({ item, index }: { item: Pelanggan; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { width: 40 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { width: 120 }]}>{item.nama}</Text>
      <Text style={[styles.cell, { width: 120 }]}>{item.domisili}</Text>
      <Text style={[styles.cell, { width: 60 }]}>{item.jenis_kelamin}</Text>
      <View style={[styles.actionCell]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#007AFF" }]}
          onPress={() => router.push(`/pelanggan/ubah-pelanggan?id=${item.id}`)}
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
        onPress={() => router.push("/pelanggan/tambah-pelanggan")}
      >
        <Text style={styles.btnTextAdd}>+ Tambah Pelanggan</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Daftar Pelanggan</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Header */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.headerCell, { width: 40 }]}>No</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Nama</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Domisili</Text>
            <Text style={[styles.headerCell, { width: 60 }]}>JK</Text>
            <Text style={[styles.headerCell, { width: 150 }]}>Aksi</Text>
          </View>

          {/* Data */}
          <FlatList
            data={pelanggans}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.empty}>Tidak ada data pelanggan.</Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
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
  cell: {
    fontSize: 14,
    color: "#374151",
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "white",
    fontSize: 12,
  },
  btnTextAdd: {
    color: "white",
    fontSize: 16,
  },
  empty: {
    textAlign: "center",
    padding: 20,
    color: "#6B7280",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionCell: {
    width: 150,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 6,
  },
});
