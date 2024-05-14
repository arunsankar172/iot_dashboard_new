//package com.iot_dashboard_new
//
//
//import android.content.Context
//import android.net.wifi.ScanResult
//import android.net.wifi.WifiManager
//
//class WifiScanner(private val context: Context) {
//
//    private val wifiManager: WifiManager =
//        context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
//
//    fun scanWifiNetworks(): List<ScanResult> {
//        wifiManager.startScan()
//        return wifiManager.scanResults
//    }
//}