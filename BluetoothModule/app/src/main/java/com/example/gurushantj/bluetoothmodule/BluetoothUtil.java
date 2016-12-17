package com.example.gurushantj.bluetoothmodule;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.widget.Toast;

import java.io.FileWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Set;
import java.util.UUID;

/**
 * Created by gurushant.j on 12/17/2016.
 */
public class BluetoothUtil {
    private BluetoothDevice bluetoothDevice = null;
    private BluetoothSocket blueSocket = null;
    private OutputStreamWriter osw = null;
    private InputStream inputStream;
    private OutputStream outputStream;
    private UUID applicationUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    FileWriter file = null;
   static BluetoothAdapter bluetoothAdapter;

    private static BluetoothUtil bluetoothUtilInstance=null;
    public static  BluetoothUtil getInstance()
    {
        if(bluetoothUtilInstance==null)
        {
            bluetoothUtilInstance=new BluetoothUtil();
            bluetoothUtilInstance.initBluetoothDevice();
        }

        return  bluetoothUtilInstance;
    }

    private BluetoothAdapter getBluetoothAdapter()
    {
        return bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

    }

    public static String getBluetoothAddress()
    {
        return bluetoothAdapter.getAddress();
    }
    public String initBluetoothDevice() {
        Set<BluetoothDevice> pairedDevices = null;
        bluetoothAdapter = getBluetoothAdapter();
        if (bluetoothAdapter == null) {
            return "Device does not support for bluetooth";
        } else {
            if (!bluetoothAdapter.isEnabled()) {
                return "Please enable your bluetoth";
            } else {
                pairedDevices = bluetoothAdapter.getBondedDevices();

                for (BluetoothDevice blueDevice : pairedDevices) {
                    if (blueDevice.getName().equals("HC-05")) {
                        bluetoothDevice = blueDevice;

                        break;
                    }

                }
                if (bluetoothDevice != null) {
                    try {
                        blueSocket = bluetoothDevice.createRfcommSocketToServiceRecord(applicationUID);
                        bluetoothAdapter.cancelDiscovery();
                        blueSocket.connect();
                        outputStream = blueSocket.getOutputStream();
                        inputStream = blueSocket.getInputStream();
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }


                }

            }
        }
        return "SUCCESS";
    }
    public void readMessageThread()
    {
        new Thread(new Runnable() {
            @Override
            public void run() {
                readMessage();
            }
        }).start();
    }
    private void sendBluetoothMessage(final String message)
    {
        new Thread(new Runnable() {
            @Override
            public void run() {
                writeMessage(message);
            }
        }).start();
    }

    public void readMessage()
    {


        while (true) {
            try {
                final int BUFFER_SIZE = 1024;
                byte[] buffer = new byte[BUFFER_SIZE];
                int bytes = 0;
                int b = BUFFER_SIZE;
                //   Toast.makeText(getApplicationContext(),"Listening to the port for data read",Toast.LENGTH_LONG ).show();
                bytes = inputStream.read(buffer, bytes, BUFFER_SIZE - bytes);
            } catch (Throwable e) {
                e.printStackTrace();

            }
        }

    }

    public void closeConnection()
    {
        try {
            blueSocket.close();
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }
    public void writeMessage(String message)
    {
        try {
            outputStream.write(message.getBytes());
            outputStream.flush();
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

}
