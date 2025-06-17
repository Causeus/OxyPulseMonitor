#include <WiFi.h>
#include <WiFiManager.h> 
#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEClient.h>

#define MAX_DATA_DISPLAY 10

BLEScan* pBLEScan;
BLEAdvertisedDevice myDevice;
BLEClient* pClient;
bool deviceFound = false;
bool reachedMaxData = false;
int dataCounter = 0;
int sptotal = 0;
int prtotal = 0;
String diagnosa = "";

int deviceId = 1;

String TARGET_DEVICE_NAMES[] = {
  "HJ-NARIGMED", "Hj-Narigmed", "hj-narigmed", "Hj-narigmed", "hj-Narigmed", "HJ-narigmed", "HJ-Narigmed"
};

class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    if (reachedMaxData) return;

    if (advertisedDevice.haveName()) {
      String deviceName = advertisedDevice.getName().c_str();
      
      for (int i = 0; i < sizeof(TARGET_DEVICE_NAMES) / sizeof(TARGET_DEVICE_NAMES[0]); i++) {
        if (deviceName == TARGET_DEVICE_NAMES[i]) {  
          myDevice = advertisedDevice;
          deviceFound = true;
          pBLEScan->stop();
          Serial.println("Target device ditemukan!"); 
          return;
        }
      }
    }
  }
};

void notifyCallback(BLERemoteCharacteristic* pBLERemoteCharacteristic,
                    uint8_t* pData, size_t length, bool isNotify) {
  if (reachedMaxData) return;
  
  if (length >= 17 && pData[0] == 0xFA && pData[1] == 0x0B && pData[2] == 0x81) {
    int spo2Percent = pData[3];
    int pulseRate = pData[4];

    if (spo2Percent < 70 || spo2Percent > 100) return;
    if (pulseRate < 30 || pulseRate > 200) return;

    sptotal += spo2Percent;
    prtotal += pulseRate;
    dataCounter++;

    Serial.printf("Data ke-%d dari %d\n", dataCounter, MAX_DATA_DISPLAY);

    if (dataCounter >= MAX_DATA_DISPLAY) {
      reachedMaxData = true;
      int spmean = sptotal / MAX_DATA_DISPLAY;
      int prmean = prtotal / MAX_DATA_DISPLAY;
      Serial.printf("Rata-rata SpO2: %d %%\n", spmean);
      Serial.printf("Rata-rata Pulse Rate: %d BPM\n", prmean);
      String bpmdiagnose = "";
      String spdiagnose = "";
      if (spmean < 90){
        spdiagnose = "Severe hypoxemia (very low oxygen level)";
      }else if (spmean < 95){
        spdiagnose = "Mild hypoxemia (low oxygen level)";
      }else{
        spdiagnose = "Normal oxygen level";
      }

      if (prmean > 100){
        bpmdiagnose = "Tachycardia (heart rate too fast)";
      }else if (prmean < 60){
        bpmdiagnose = "Bradycardia (heart rate too slow)";
      }else{
        bpmdiagnose = "Normal heart rate";
      }

      diagnosa = spdiagnose + "\n" + bpmdiagnose;

      sendHealthData(deviceId, spmean, prmean, diagnosa);

      if (pClient && pClient->isConnected()) {
        pClient->disconnect();
        Serial.println("Terputus dari device.");
      }
    }
  }
}

void connectAndListServices() {
  if (reachedMaxData) return;

  Serial.println("Mencoba untuk menghubungkan ke device...");
  pClient = BLEDevice::createClient();
  if (!pClient->connect(&myDevice)) {
    Serial.println("Gagal terkoneksi ke device.");
    deviceFound = false;
    delete pClient;
    pClient = nullptr;
    return;
  }

  Serial.println("Berhasil terkoneksi ke device!");

  BLERemoteService* pRemoteService = pClient->getService("0000FFF0-0000-1000-8000-00805f9b34fb");
  if (!pRemoteService) {
    Serial.println("Service tidak ditemukan.");
    pClient->disconnect();
    delete pClient;
    pClient = nullptr;
    deviceFound = false;
    return;
  }

  BLERemoteCharacteristic* pRemoteCharacteristic = pRemoteService->getCharacteristic("0000FFF1-0000-1000-8000-00805f9b34fb");
  if (!pRemoteCharacteristic) {
    Serial.println("Karakteristik tidak ditemukan.");
    pClient->disconnect();
    delete pClient;
    pClient = nullptr;
    deviceFound = false;
    return;
  }

  if (pRemoteCharacteristic->canNotify()) {
    dataCounter = 0;
    sptotal = 0;
    prtotal = 0;
    reachedMaxData = false;
    pRemoteCharacteristic->registerForNotify(notifyCallback);
    Serial.println("Mendaftar untuk menerima notifikasi...");
  } else {
    Serial.println("Karakteristik tidak mendukung notifikasi.");
    pClient->disconnect();
    delete pClient;
    pClient = nullptr;
    deviceFound = false;
  }
}

void sendHealthData(int deviceId, int spo2, int bpm, String diagnosa) {
  HTTPClient http;

  String url = "http://192.168.0.150:8080/oxypulsemeter/sendData.php";

  String postData = "device_id=" + String(deviceId) + "&spo2=" + String(spo2) + "&bpm=" + String(bpm) + "&diagnosa=" + diagnosa;

  http.begin(url);  
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  
  int httpCode = http.POST(postData); 
  Serial.println(httpCode); 
  Serial.println(postData);
  if (httpCode == 200) {
    Serial.println("Data berhasil dikirim ke server!");
  } else {
    Serial.println("Gagal mengirim data ke server.");
  }

  http.end();
}

void setup() {
  Serial.begin(115200);

  WiFiManager wifiManager;
  wifiManager.autoConnect("Oximeter");
  Serial.println("WiFi terkoneksi!");

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);
  pBLEScan->start(10, false);
}

void loop() {
  if (reachedMaxData) {
    delay(1000);
    return;
  }

  if (deviceFound && !pClient) {
    connectAndListServices();
  } else if (pClient && !pClient->isConnected() && !reachedMaxData) {
    Serial.println("Koneksi terputus, mencoba reconnect...");
    delete pClient;
    pClient = nullptr;
    deviceFound = false;
    dataCounter = 0;
    pBLEScan->start(10, false);
  }

  delay(1000);
}
