package com.example.gurushantj.bluetoothmodule;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.os.Bundle;
import android.os.Environment;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import java.io.File;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Set;
import java.util.UUID;

public class BluetoothActivity extends AppCompatActivity  {

    private BluetoothDevice bluetoothDevice=null;
    private BluetoothSocket blueSocket=null;
    private  OutputStreamWriter osw=null;
    private InputStream inputStream;
    private OutputStream outputStream;
    private UUID applicationUID=UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    FileWriter file=null;
    BluetoothAdapter bluetoothAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bluetooth);
        Button bluetoothLoginButton=(Button)findViewById(R.id.bluetooth_login_button);
       try {
           File root = new File(Environment.getExternalStorageDirectory(), "exception.txt");
           FileWriter file=new FileWriter(root);
       }
       catch (Exception ex)
       {
           Toast.makeText(getApplicationContext(),"Error occured while creating a file",Toast.LENGTH_LONG ).show();
       }

        //Init bluetooth device
        Set<BluetoothDevice>pairedDevices=null;
        bluetoothAdapter= BluetoothAdapter.getDefaultAdapter();
        if(bluetoothAdapter==null)
        {
            Toast.makeText(getApplicationContext(),"Device does not support for bluetooth",Toast.LENGTH_LONG).show();
        }
        else {
            if (!bluetoothAdapter.isEnabled()) {
                Toast.makeText(getApplicationContext(), "Please enable your bluetoth", Toast.LENGTH_LONG).show();
            } else {
                pairedDevices = bluetoothAdapter.getBondedDevices();
                Toast.makeText(getApplicationContext(), "Paired devices " + pairedDevices.size(), Toast.LENGTH_LONG).show();
                for (BluetoothDevice blueDevice : pairedDevices) {
                    if (blueDevice.getName().equals("HC-05")) {
                        bluetoothDevice = blueDevice;
                        Toast.makeText(getApplicationContext(), "Found targeted bluetooth device=>" + bluetoothDevice.getName(), Toast.LENGTH_LONG).show();
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
        //end of bluetooth device
        bluetoothLoginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                sendBluetoothMessage();
            }
        });

        //Read message from bluetooth



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

    private void showToast(final byte bytes[])
    {
        final String message=new String(bytes);

            this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(BluetoothActivity.this,message,Toast.LENGTH_LONG).show();
             }
        });
    }
    private void sendBluetoothMessage()
    {

            new Thread(new Runnable() {
                @Override
                public void run() {
                    writeMessage("test");
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
                showToast(buffer);
               // Toast.makeText(getApplicationContext(),bytes,Toast.LENGTH_LONG).show();
            } catch (Throwable e) {
                e.printStackTrace();
                Toast.makeText(getApplicationContext(),"Error occured while sending data through bluetooth",Toast.LENGTH_LONG ).show();
                StringWriter swr=new StringWriter();
                PrintWriter print=new PrintWriter(swr);
                e.printStackTrace(print);
                writeToFile(swr.toString());
                closeFile();

            }
        }

    }

    public void writeMessage(String message)
    {
        try {
            outputStream.write(message.getBytes());
            outputStream.flush();
         //   blueSocket.close();
        }
        catch (Exception ex)
        {
            Toast.makeText(getApplicationContext(),"Error occured while sending data through bluetooth",Toast.LENGTH_LONG ).show();
            StringWriter swr=new StringWriter();
            PrintWriter print=new PrintWriter(swr);
            ex.printStackTrace(print);
            writeToFile(swr.toString());
            closeFile();
        }
    }

//    @Override
//    public void run() {
//        try {
//            blueSocket = bluetoothDevice.createRfcommSocketToServiceRecord(applicationUID);
//            bluetoothAdapter.cancelDiscovery();
//            blueSocket.connect();
//            outputStream=blueSocket.getOutputStream();
//            outputStream.write("gurushant".getBytes());
//            outputStream.flush();
//            blueSocket.close();
//        }
//        catch (Exception ex)
//        {
//            Toast.makeText(getApplicationContext(),"Error occured while sending data through bluetooth",Toast.LENGTH_LONG ).show();
//            StringWriter swr=new StringWriter();
//            PrintWriter print=new PrintWriter(swr);
//            ex.printStackTrace(print);
//            writeToFile(swr.toString());
//            closeFile();
//        }
//     }

    private void writeToFile(String exception)
    {
        // Write the string to the file
        try {
            file.write(exception);
            file.flush();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

    }

    private void closeFile()
    {
        try {
            file.close();
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

}
