package com.example.gurushantj.bluetoothmodule;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.Toast;

public class Mode1Login extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mode1_login);

        Switch modeSwitch=(Switch)findViewById(R.id.switch1);
        modeSwitch.setChecked(true);

        modeSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {

                if(!isChecked)
                {
                    Intent intent=new Intent(getApplicationContext(),MorsecodeActivity.class);
                    startActivity(intent);
                }

            }
        });

        try {
            Button loginButton = (Button) findViewById(R.id.button);
            loginButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    BluetoothUtil bluetoothUtilObj=BluetoothUtil.getInstance();
                    bluetoothUtilObj.writeMessage("#");

                }
            });
        }
        catch (Exception ex)
        {
            Toast.makeText(getApplicationContext(),ex.toString(),Toast.LENGTH_LONG).show();
        }

    }
}
