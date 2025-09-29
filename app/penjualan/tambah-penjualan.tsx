import api from "@/lib/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TambahPenjualan() {
  const [tgl, setTgl] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const [pelangganId, setPelangganId] = useState<number | null>(null);
  const [pelanggans, setPelanggans] = useState<any[]>([]);

  const [barangs, setBarangs] = useState<any[]>([]);
  //   const [items, setItems] = useState([{ barang_id: "", qty: "" }]);
  const [items, setItems] = useState([
    { id: Date.now(), barang_id: "", qty: "" },
  ]);

  const [errors, setErrors] = useState<{
    pelanggan?: string;
    items?: string[];
  }>({});
  const [loading, setLoading] = useState(false);

  // Fetch data pelanggan dan barang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPelanggan, resBarang] = await Promise.all([
          api.get("/pelanggans"),
          api.get("/barangs"),
        ]);
        setPelanggans(resPelanggan.data.data || []);
        setBarangs(resBarang.data.data || []);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), barang_id: "", qty: "" }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleChangeItem = (id: number, field: string, value: string) => {
    if (field === "barang_id") {
      const isDuplicate = items.some(
        (item) => item.id !== id && item.barang_id === value
      );
      if (isDuplicate) {
        Alert.alert("Peringatan", "Barang ini sudah dipilih di item lain");
        return; // batalin update
      }
    }

    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const validate = () => {
    let valid = true;
    const newErrors: { pelanggan?: string; items?: string[] } = {};

    if (!pelangganId) {
      newErrors.pelanggan = "Pelanggan wajib dipilih";
      valid = false;
    }

    const itemErrors: string[] = [];
    items.forEach((item, idx) => {
      if (!item.barang_id || !item.qty) {
        itemErrors[idx] = "Barang dan Qty wajib diisi";
        valid = false;
      } else {
        itemErrors[idx] = "";
      }
    });

    newErrors.items = itemErrors;
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/penjualans", {
        tgl: tgl.toISOString().split("T")[0], // format YYYY-MM-DD
        pelanggan_id: pelangganId,
        items: items.map((i) => ({
          barang_id: Number(i.barang_id),
          qty: Number(i.qty),
        })),
      });
      Alert.alert("Sukses", "Penjualan berhasil ditambahkan", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("Gagal tambah:", err);
      Alert.alert("Error", "Gagal menambah penjualan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Tambah Penjualan</Text>

      {/* Date Picker */}
      <Text style={styles.label}>Tanggal</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
        <Text>{tgl.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          value={tgl}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDate(false);
            if (selectedDate) setTgl(selectedDate);
          }}
        />
      )}

      {/* Pelanggan Dropdown */}
      {/* Pelanggan Dropdown */}
      <Text style={styles.label}>Pelanggan</Text>
      <View
        style={[
          styles.pickerContainer,
          errors.pelanggan ? { borderColor: "red" } : {},
        ]}
      >
        <Picker
          selectedValue={pelangganId}
          onValueChange={(val) => setPelangganId(Number(val))}
        >
          <Picker.Item label="-- Pilih Pelanggan --" value="" />
          {pelanggans.map((p) => (
            <Picker.Item key={p.id} label={p.nama} value={p.id} />
          ))}
        </Picker>
      </View>
      {errors.pelanggan && (
        <Text style={styles.errorText}>{errors.pelanggan}</Text>
      )}

      {/* Items */}
      <Text style={styles.label}>Items</Text>

      {items.map((item, index) => (
        <View key={item.id} style={{ marginBottom: 12 }}>
          <View style={styles.itemRow}>
            <View
              style={[
                styles.pickerContainer,
                { flex: 1, marginRight: 8 },
                errors.items?.[index] ? { borderColor: "red" } : {},
              ]}
            >
              <Picker
                selectedValue={item.barang_id}
                onValueChange={(val) =>
                  handleChangeItem(item.id, "barang_id", String(val))
                }
              >
                <Picker.Item label="-- Pilih Barang --" value="" />
                {barangs.map((b) => (
                  <Picker.Item key={b.id} label={b.nama} value={String(b.id)} />
                ))}
              </Picker>
            </View>

            <TextInput
              style={[
                styles.input,
                { flex: 1, marginRight: 8 },
                errors.items?.[index] ? { borderColor: "red" } : {},
              ]}
              placeholder="Qty"
              value={item.qty}
              onChangeText={(val) => handleChangeItem(item.id, "qty", val)}
              keyboardType="numeric"
            />

            {items.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={{ color: "white" }}>X</Text>
              </TouchableOpacity>
            )}
          </View>

          {errors.items?.[index] ? (
            <Text style={styles.errorText}>{errors.items[index]}</Text>
          ) : null}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>+ Tambah Barang</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  label: { marginTop: 10, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "white",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
  },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  removeButton: {
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: { color: "white" },
  button: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
  errorText: { color: "red", marginBottom: 6 },
});
