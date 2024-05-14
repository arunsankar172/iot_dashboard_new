package com.iot_dashboard_new

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import android.content.Context
import android.net.wifi.ScanResult
import android.net.wifi.WifiManager
import com.facebook.react.bridge.*
import android.provider.Settings
import androidx.core.content.ContextCompat
import androidx.core.app.ActivityCompat
import android.content.pm.PackageManager
//import com.facebook.react.bridge.
//import android.Manifest.permission.ACCESS_FINE_LOCATION
import android.Manifest
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.location.LocationManager
import android.net.wifi.WifiConfiguration
import android.net.wifi.WifiInfo
import android.net.wifi.WifiNetworkSuggestion

class WifiScannerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var wifiManager: WifiManager? = null
    private val locationManager: LocationManager = reactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
    private val context: Context = reactContext

    override fun getName(): String {
        return "WifiScanner"
    }

    override fun initialize() {
        super.initialize()
        wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
    }

    @ReactMethod
    fun isLocationEnabled(promise: Promise) {
        promise.resolve(locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER))
    }

    @ReactMethod
    fun enableLocationService() {
        val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        context.startActivity(intent)
    }

    @ReactMethod
    fun isWifiEnabled(promise: Promise) {
        val enabled = wifiManager?.isWifiEnabled
        Log.i("WifiScanner", "WiFi enabled: $enabled")
        promise.resolve(enabled)
    }

    @ReactMethod
    fun enableWifi() {
        Log.i("WifiScanner", "Enabling WiFi...")
//        wifiManager?.isWifiEnabled = true
        wifiManager?.setWifiEnabled(true);
    }


    @ReactMethod
    fun checkAndScanWifiNetworks(promise: Promise) {
        Log.i("WifiScanner", "Checking location permission and starting scan...")
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Log.i("WifiScanner", "Location permission not granted. Requesting permission...")
            ActivityCompat.requestPermissions(currentActivity!!, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), PERMISSION_REQUEST_CODE)
            promise.reject("PERMISSION_ERROR", "Location permission not granted")
            return
        }

        val wifiScanReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (intent.action == WifiManager.SCAN_RESULTS_AVAILABLE_ACTION) {
                    Log.i("WifiScanner", "WiFi scan results available.")
                    val wifiList = wifiManager?.scanResults
                    val wifiArray = Arguments.createArray()

                    wifiList?.forEach { result: ScanResult ->
                        val wifiObject = Arguments.createMap()
                        wifiObject.putString("SSID", result.SSID)
                        wifiObject.putString("BSSID", result.BSSID)
                        wifiObject.putInt("level", result.level)
                        wifiArray.pushMap(wifiObject)
                    }

                    promise.resolve(wifiArray)
                }
            }
        }

        context.registerReceiver(wifiScanReceiver, IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION))
        wifiManager?.startScan()
    }

//    @ReactMethod
//    fun getConnectedSSID(promise: Promise) {
//        val info: WifiInfo? = wifiManager?.connectionInfo
//        val ssid = info?.ssid?.replace("\"", "")
//        Log.i("WifiScanner", "Connected WiFi SSID: $ssid")
//        promise.resolve(ssid)
//    }

    @ReactMethod
    fun getConnectedSSID(promise: Promise) {
        val info = wifiManager?.connectionInfo
        val ssid = info?.ssid?.replace("\"", "")
        Log.i("WifiScanner", "Connected WiFi SSID: $ssid")
        promise.resolve(ssid)
    }

    @ReactMethod
    fun getGatewayIPAddress(promise: Promise) {
        val info = wifiManager?.dhcpInfo
        val gatewayIP = intToIp(info?.gateway)
        Log.i("WifiScanner", "Gateway IP Address: $gatewayIP")
        promise.resolve(gatewayIP)
    }

    private fun intToIp(ip: Int?): String? {
        if (ip == null) return null
        return "${ip and 0xFF}.${ip shr 8 and 0xFF}.${ip shr 16 and 0xFF}.${ip shr 24 and 0xFF}"
    }


    @ReactMethod
    fun connectToWifi(ssid: String, password: String, promise: Promise) {
        disconnectCurrentNetwork()
        val conf = WifiConfiguration()
        conf.SSID = "\"" + ssid + "\""
        conf.preSharedKey = "\"" + password + "\""

        val netId = wifiManager?.addNetwork(conf)
        netId?.let {
            Log.i("WifiScanner", "Connecting to WiFi network: $ssid")
            wifiManager?.enableNetwork(it, true)
            wifiManager?.reconnect()
            promise.resolve(true)
        } ?: promise.resolve(false)

//            val wifiConfig = WifiConfiguration()
//            wifiConfig.SSID = "\"" + ssid + "\""
//            wifiConfig.preSharedKey = "\"" + password + "\""
//
//            val netId = wifiManager?.addNetwork(wifiConfig)
//            wifiManager?.disconnect()
//            wifiManager?.enableNetwork(netId, true)
//            wifiManager?.reconnect()
//        Log.i("WifiScanner", "Connecting to WiFi network: $ssid")

    }

    private fun disconnectCurrentNetwork() {
        val currentNetwork = wifiManager?.connectionInfo
        currentNetwork?.let {
            Log.i("WifiScanner", "Disconnecting from current WiFi network: ${it.ssid}")
            wifiManager?.disableNetwork(it.networkId)
            wifiManager?.disconnect()
        }
    }

    companion object {
        private const val PERMISSION_REQUEST_CODE = 123
    }


}